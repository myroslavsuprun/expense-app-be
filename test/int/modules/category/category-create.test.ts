import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";
import { CreateCategoryBody } from "@/lib/validation/category/category.schema.js";

// Integration tests for POST /api/categories

describe("POST /api/categories", () => {
    let server: FastifyInstance;
    let token: string;
    let userId: string;
    const password = "Password123!";
    const userEmail = `cat.create+${Date.now()}@example.com`;

    beforeEach(async () => {
        server = await configureServer();

        // Sign up user
        const signUpPayload: SignUpBody = {
            firstName: "Cat",
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

        return async () => {
            await server.close();
        };
    });

    it("should create a new category for the user", async () => {
        const payload: CreateCategoryBody = {
            name: `Test Category ${Date.now()}`,
        };

        const response = await server.inject({
            method: "POST",
            url: "/api/categories",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: payload,
        });

        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("data.category");
        expect(json.data.category.name).toBe(payload.name);

        // Check in DB
        const dbCategory = await server.prisma.category.findFirst({
            where: { name: payload.name, userId },
        });

        expect(dbCategory).toBeTruthy();
        expect(dbCategory?.name).toBe(payload.name);
        expect(dbCategory?.userId).toBe(userId);
    });

    it("should fail with 401 if JWT is missing", async () => {
        const payload: CreateCategoryBody = {
            name: `NoAuth Category ${Date.now()}`,
        };

        const response = await server.inject({
            method: "POST",
            url: "/api/categories",
            body: payload,
        });

        expect(response.statusCode).toBe(401);
    });
});
