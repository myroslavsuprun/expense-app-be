import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { TransactionType } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";
import { CreateCategoryBody } from "@/lib/validation/category/category.schema.js";
import { CreateTransactionBody } from "@/lib/validation/transaction/transaction.schema.js";

// Integration tests for POST /api/transactions

describe("POST /api/transactions", () => {
    let server: FastifyInstance;
    let token: string;
    let userId: string;
    let categoryId: string;
    const password = "Password123!";
    const userEmail = `txn.create+${Date.now()}@example.com`;

    beforeEach(async () => {
        server = await configureServer();

        // Sign up user
        const signUpPayload: SignUpBody = {
            firstName: "Txn",
            lastName: "Creator",
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
        userId = signInJson.data.user.id;
        // Create a category for transaction
        const catPayload: CreateCategoryBody = { name: `TxnCat${Date.now()}` };

        const catRes = await server.inject({
            method: "POST",
            url: "/api/categories",
            headers: { Authorization: `Bearer ${token}` },
            body: catPayload,
        });

        categoryId = catRes.json().data.category.id;

        return async () => {
            await server.close();
        };
    });

    it("should create a new transaction for the user", async () => {
        const payload: CreateTransactionBody = {
            description: "Test Transaction",
            amount: 100,
            type: TransactionType.EXPENSE,
            categoryId,
            date: new Date(),
        };

        const response = await server.inject({
            method: "POST",
            url: "/api/transactions",
            headers: { Authorization: `Bearer ${token}` },
            body: payload,
        });

        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("data.transaction");
        expect(json.data.transaction.description).toBe(payload.description);

        // Check in DB
        const dbTxn = await server.prisma.transaction.findFirst({
            where: { description: payload.description, userId },
        });

        expect(dbTxn).toBeTruthy();
        expect(dbTxn?.amount).toBe(payload.amount);
        expect(dbTxn?.categoryId).toBe(categoryId);
    });

    it("should fail with 401 if JWT is missing", async () => {
        const payload: CreateTransactionBody = {
            description: "NoAuth Transaction",
            amount: 50,
            type: TransactionType.EXPENSE,
            categoryId,
            date: new Date(),
        };

        const response = await server.inject({
            method: "POST",
            url: "/api/transactions",
            body: payload,
        });

        expect(response.statusCode).toBe(401);
    });
});
