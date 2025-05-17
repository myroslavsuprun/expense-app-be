import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { TransactionType } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";
import { CreateCategoryBody } from "@/lib/validation/category/category.schema.js";
import { CreateTransactionBody } from "@/lib/validation/transaction/transaction.schema.js";

// Integration tests for GET /api/transactions

describe("GET /api/transactions", () => {
    let server: FastifyInstance;
    let token: string;
    let categoryId: string;
    const password = "Password123!";
    const userEmail = `txn.get+${Date.now()}@example.com`;

    beforeEach(async () => {
        server = await configureServer();

        // Sign up user
        const signUpPayload: SignUpBody = {
            firstName: "Txn",
            lastName: "Getter",
            email: userEmail,
            password,
        };

        await server.inject({
            method: "POST",
            url: "/api/auth/sign-up",
            body: signUpPayload,
        });

        // Sign in to get token
        const signInPayload: SignInBody = {
            email: userEmail,
            password,
        };

        const signInRes = await server.inject({
            method: "POST",
            url: "/api/auth/sign-in",
            body: signInPayload,
        });

        const signInJson = signInRes.json();
        token = signInJson.data.token;
        // Create a category for transaction
        const catPayload: CreateCategoryBody = { name: `TxnCat${Date.now()}` };

        const catRes = await server.inject({
            method: "POST",
            url: "/api/categories",
            headers: { Authorization: `Bearer ${token}` },
            body: catPayload,
        });

        categoryId = catRes.json().data.category.id;

        // Create a transaction
        const txnPayload: CreateTransactionBody = {
            description: "Get Transaction",
            amount: 200,
            type: TransactionType.INCOME,
            categoryId,
            date: new Date(),
        };

        await server.inject({
            method: "POST",
            url: "/api/transactions",
            headers: { Authorization: `Bearer ${token}` },
            body: txnPayload,
        });

        return async () => {
            await server.close();
        };
    });

    it("should return all transactions for the user", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/api/transactions",
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("data.transactions");
        expect(Array.isArray(json.data.transactions)).toBe(true);
        expect(json.data.transactions.length).toBeGreaterThan(0);

        for (const txn of json.data.transactions) {
            expect(txn).toHaveProperty("id");
            expect(txn).toHaveProperty("description");
            expect(txn).toHaveProperty("amount");
            expect(txn).toHaveProperty("type");
            expect(txn).toHaveProperty("date");
        }
    });

    it("should fail with 401 if JWT is missing", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/api/transactions",
        });

        expect(response.statusCode).toBe(401);
    });
});
