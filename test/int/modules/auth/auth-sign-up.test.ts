import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody } from "@/lib/validation/auth/auth.schema.js";

// Integration tests for POST /api/auth/sign-up

describe("POST /api/auth/sign-up", () => {
    let server: FastifyInstance;

    beforeEach(async () => {
        server = await configureServer();

        return async () => {1
            await server.close();
        };
    });

    it("should create a new user", async () => {
        const payload: SignUpBody = {
            firstName: "John",
            lastName: "Doe",
            email: `john.doe+${Date.now()}@example.com`,
            password: "Password123!",
        };

        const response = await server.inject({
            method: "POST",
            url: "/api/auth/sign-up",
            body: payload,
        });

        expect(response.statusCode).toBe(200);

        // Check user exists in DB
        const user = await server.prisma.user.findUnique({
            where: { email: payload.email },
        });

        expect(user).toBeTruthy();
        expect(user?.firstName).toBe(payload.firstName);
        expect(user?.lastName).toBe(payload.lastName);
        expect(user?.email).toBe(payload.email);
    });

    it("should create default categories for the user", async () => {
        const payload: SignUpBody = {
            firstName: "Cat",
            lastName: "Owner",
            email: `cat.owner+${Date.now()}@example.com`,
            password: "Password123!",
        };

        await server.inject({
            method: "POST",
            url: "/api/auth/sign-up",
            body: payload,
        });

        const user = await server.prisma.user.findUnique({
            where: { email: payload.email },
        });

        expect(user).toBeTruthy();

        const categories = await server.prisma.category.findMany({
            where: { userId: user?.id },
        });

        expect(categories.length).toBeGreaterThan(0);
    });

    it("should not allow signing up with an existing email", async () => {
        const payload: SignUpBody = {
            firstName: "Jane",
            lastName: "Smith",
            email: `jane.smith+${Date.now()}@example.com`,
            password: "Password123!",
        };

        // First signup
        await server.inject({
            method: "POST",
            url: "/api/auth/sign-up",
            body: payload,
        });

        // Second signup with same email
        const response = await server.inject({
            method: "POST",
            url: "/api/auth/sign-up",
            body: payload,
        });

        const { statusCode } = response;
        const json = response.json();

        expect(statusCode).toBe(409);
        expect(json).toHaveProperty("error");
        expect(json.message).toMatch(/already exists/i);
    });

    it("should reject signup with missing fields", async () => {
        const response = await server.inject({
            method: "POST",
            url: "/api/auth/sign-up",
            body: {
                // Missing required fields
            },
        });

        const { statusCode } = response;
        const json = response.json();

        expect(statusCode).toBe(400);
        expect(json).toHaveProperty("error");
    });
});
