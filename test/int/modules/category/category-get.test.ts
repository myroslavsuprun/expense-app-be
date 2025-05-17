import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";

// Integration tests for GET /api/categories

describe("GET /api/categories", () => {
    let server: FastifyInstance;
    let token: string;
    let userId: string;
    const password = "Password123!";
    const userEmail = `cat.get+${Date.now()}@example.com`;

    beforeEach(async () => {
        server = await configureServer();
        // Sign up user
        const signUpPayload: SignUpBody = {
            firstName: "Cat",
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
        userId = signInJson.data.user.id;
        return async () => {
            await server.close();
        };
    });

    it("should return all categories for the user", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/api/categories",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("data.categories");
        expect(Array.isArray(json.data.categories)).toBe(true);
        // Should include default categories
        expect(json.data.categories.length).toBeGreaterThan(0);
        // Check that all categories belong to the user
        for (const cat of json.data.categories) {
            expect(cat).toHaveProperty("id");
            expect(cat).toHaveProperty("name");
            expect(cat).toHaveProperty("createdAt");
        }
    });

    it("should fail with 401 if JWT is missing", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/api/categories",
        });
        expect(response.statusCode).toBe(401);
    });
});
