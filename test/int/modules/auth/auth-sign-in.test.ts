import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";

// Integration tests for POST /api/auth/sign-in

describe("POST /api/auth/sign-in", () => {
    let server: FastifyInstance;
    const password = "Password123!";
    const email = `signin.user+${Date.now()}@example.com`;

    const signUpPayload: SignUpBody = {
        firstName: "SignIn",
        lastName: "User",
        email,
        password,
    };

    beforeEach(async () => {
        server = await configureServer();

        // Ensure user exists for sign-in
        await server.inject({
            method: "POST",
            url: "/api/auth/sign-up",
            body: signUpPayload,
        });

        return async () => {
            await server.close();
        };
    });

    it("should sign in an existing user with correct credentials", async () => {
        const payload: SignInBody = {
            email,
            password,
        };

        const response = await server.inject({
            method: "POST",
            url: "/api/auth/sign-in",
            body: payload,
        });

        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("data.user");
        expect(json).toHaveProperty("data.token");
        expect(json.data.user.email).toBe(email);
    });

    it("should not sign in with wrong password", async () => {
        const payload: SignInBody = {
            email,
            password: "WrongPassword!",
        };

        const response = await server.inject({
            method: "POST",
            url: "/api/auth/sign-in",
            body: payload,
        });

        expect(response.statusCode).toBe(400);
        const json = response.json();
        expect(json).toHaveProperty("error");
        expect(json.message).toMatch(/invalid email or password/i);
    });

    it("should not sign in with non-existent email", async () => {
        const payload: SignInBody = {
            email: `notfound+${Date.now()}@example.com`,
            password,
        };

        const response = await server.inject({
            method: "POST",
            url: "/api/auth/sign-in",
            body: payload,
        });

        expect(response.statusCode).toBe(400);
        const json = response.json();
        expect(json).toHaveProperty("error");
        expect(json.message).toMatch(/invalid email or password/i);
    });
});
