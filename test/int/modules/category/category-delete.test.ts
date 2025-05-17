import { FastifyInstance } from "fastify";
import { configureServer } from "@/server.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpBody, SignInBody } from "@/lib/validation/auth/auth.schema.js";
import { CreateCategoryBody } from "@/lib/validation/category/category.schema.js";
import { randomUUID } from "crypto";

// Integration tests for DELETE /api/categories/:id

describe("DELETE /api/categories/:id", () => {
    let server: FastifyInstance;
    let token: string;
    let userId: string;
    const password = "Password123!";
    const userEmail = `cat.delete+${Date.now()}@example.com`;

    beforeEach(async () => {
        server = await configureServer();
        // Sign up user
        const signUpPayload: SignUpBody = {
            firstName: "Cat",
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
        userId = signInJson.data.user.id;
        return async () => {
            await server.close();
        };
    });

    it("should delete a category for the user", async () => {
        // Create a category to delete
        const payload: CreateCategoryBody = {
            name: `Delete Category ${Date.now()}`,
        };
        const createRes = await server.inject({
            method: "POST",
            url: "/api/categories",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: payload,
        });
        expect(createRes.statusCode).toBe(200);
        const categoryId = createRes.json().data.category.id;

        // Delete the category
        const response = await server.inject({
            method: "DELETE",
            url: `/api/categories/${categoryId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toBe(200);
        const json = response.json();
        expect(json).toHaveProperty("message");
        // Check in DB
        const dbCategory = await server.prisma.category.findUnique({
            where: { id: categoryId },
        });
        expect(dbCategory).toBeNull();
    });

    it("should fail with 401 if JWT is missing", async () => {
        // Create a category to get a valid id
        const payload: CreateCategoryBody = {
            name: `NoAuth Delete Category ${Date.now()}`,
        };
        const createRes = await server.inject({
            method: "POST",
            url: "/api/categories",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: payload,
        });
        const categoryId = createRes.json().data.category.id;
        // Try to delete without auth
        const response = await server.inject({
            method: "DELETE",
            url: `/api/categories/${categoryId}`,
        });
        expect(response.statusCode).toBe(401);
    });

    it("should return 404 for non-existent category", async () => {
        const fakeId = randomUUID();
        const response = await server.inject({
            method: "DELETE",
            url: `/api/categories/${fakeId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(response.statusCode).toBe(404);
    });
});
