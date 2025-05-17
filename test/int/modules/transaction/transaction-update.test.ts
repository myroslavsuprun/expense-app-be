import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { TransactionType } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";
import { CreateCategoryBody } from "@/lib/validation/category/category.schema.js";
import {
    CreateTransactionBody,
    UpdateTransactionBody,
} from "@/lib/validation/transaction/transaction.schema.js";

// Integration tests for PATCH /api/transactions/:id

describe("PATCH /api/transactions/:id", () => {
    let server: FastifyInstance;
    let token: string;
    let categoryId: string;
    let transactionId: string;
    const password = "Password123!";
    const userEmail = `txn.update+${Date.now()}@example.com`;

    beforeEach(async () => {
        server = await configureServer();

        // Sign up user
        const signUpPayload: SignUpBody = {
            firstName: "Txn",
            lastName: "Updater",
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
            description: "Update Transaction",
            amount: 400,
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

    it("should update a transaction for the user", async () => {
        const updatePayload: UpdateTransactionBody = {
            description: "Updated Transaction",
            amount: 999,
        };

        const response = await server.inject({
            method: "PATCH",
            url: `/api/transactions/${transactionId}`,
            headers: { Authorization: `Bearer ${token}` },
            body: updatePayload,
        });

        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("data.transaction");

        expect(json.data.transaction.description).toBe(
            updatePayload.description
        );

        expect(json.data.transaction.amount).toBe(updatePayload.amount);

        // Check in DB
        const dbTxn = await server.prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        expect(dbTxn?.description).toBe(updatePayload.description);
        expect(dbTxn?.amount).toBe(updatePayload.amount);
    });

    it("should fail with 401 if JWT is missing", async () => {
        const updatePayload: UpdateTransactionBody = {
            description: "NoAuth Update",
        };

        const response = await server.inject({
            method: "PATCH",
            url: `/api/transactions/${transactionId}`,
            body: updatePayload,
        });

        expect(response.statusCode).toBe(401);
    });

    it("should return 404 for non-existent transaction", async () => {
        const updatePayload: UpdateTransactionBody = {
            description: "NotFound Update",
        };

        const fakeId = "00000000-0000-0000-0000-000000000000";

        const response = await server.inject({
            method: "PATCH",
            url: `/api/transactions/${fakeId}`,
            headers: { Authorization: `Bearer ${token}` },
            body: updatePayload,
        });

        expect(response.statusCode).toBe(404);
    });
});
