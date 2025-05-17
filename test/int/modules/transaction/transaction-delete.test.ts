import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { TransactionType } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";
import { CreateCategoryBody } from "@/lib/validation/category/category.schema.js";
import { CreateTransactionBody } from "@/lib/validation/transaction/transaction.schema.js";

// Integration tests for DELETE /api/transactions/:id

describe("DELETE /api/transactions/:id", () => {
    let server: FastifyInstance;
    let token: string;
    let categoryId: string;
    let transactionId: string;
    const password = "Password123!";
    const userEmail = `txn.delete+${Date.now()}@example.com`;

    beforeEach(async () => {
        server = await configureServer();

        // Sign up user
        const signUpPayload: SignUpBody = {
            firstName: "Txn",
            lastName: "Deleter",
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
            description: "Delete Transaction",
            amount: 300,
            type: TransactionType.EXPENSE,
            categoryId,
            date: new Date(),
        };

        const txnRes = await server.inject({
            method: "POST",
            url: "/api/transactions",
            headers: { Authorization: `Bearer ${token}` },
            body: txnPayload,
        });

        transactionId = txnRes.json().data.transaction.id;

        return async () => {
            await server.close();
        };
    });

    it("should delete a transaction for the user", async () => {
        const response = await server.inject({
            method: "DELETE",
            url: `/api/transactions/${transactionId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("message");

        // Check in DB
        const dbTxn = await server.prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        expect(dbTxn).toBeNull();
    });

    it("should fail with 401 if JWT is missing", async () => {
        const response = await server.inject({
            method: "DELETE",
            url: `/api/transactions/${transactionId}`,
        });

        expect(response.statusCode).toBe(401);
    });

    it("should return 404 for non-existent transaction", async () => {
        const fakeId = randomUUID();

        const response = await server.inject({
            method: "DELETE",
            url: `/api/transactions/${fakeId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.statusCode).toBe(404);
    });
});
