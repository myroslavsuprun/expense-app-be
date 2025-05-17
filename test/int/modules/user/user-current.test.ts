import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";

// Integration tests for GET /api/users/current

describe("GET /api/users/current", () => {
    let server: FastifyInstance;
    let token: string;
    let userEmail: string;
    let userId: string;
    const password = "Password123!";

    beforeEach(async () => {
        server = await configureServer();
        userEmail = `current.user+${Date.now()}@example.com`;

        const signUpPayload: SignUpBody = {
            firstName: "Current",
            lastName: "User",
            email: userEmail,
            password,
        };

        // Sign up user
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

    it("should fetch the current user with valid JWT", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/api/users/current",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("data.user");
        expect(json.data.user.email).toBe(userEmail);
        expect(json.data.user.id).toBe(userId);
    });

    it("should fail with 401 if JWT is missing", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/api/users/current",
        });

        expect(response.statusCode).toBe(401);
    });

    it("should fail with 401 if JWT is invalid", async () => {
        const response = await server.inject({
            method: "GET",
            url: "/api/users/current",
            headers: {
                Authorization: "Bearer invalid.token.here",
            },
        });

        expect(response.statusCode).toBe(401);
    });
});
