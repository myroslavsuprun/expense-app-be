import { FastifyInstance } from "fastify";
import { AuthHandler } from "./auth.handler.js";
import {
    signInBodySchema,
    signInResponseSchema,
    signUpBodySchema,
    signUpResponseSchema,
} from "@/lib/validation/auth/auth.schema.js";

export const createAuthRoutes = (
    fastify: FastifyInstance,
    authHandler: AuthHandler
) => {
    fastify.post(
        "/sign-up",
        {
            schema: {
                tags: ["Auth"],

                summary: "Register a new user",
                body: signUpBodySchema,
                response: {
                    200: signUpResponseSchema,
                },
            },
        },
        authHandler.signUp
    );

    fastify.post(
        "/sign-in",
        {
            schema: {
                tags: ["Auth"],
                summary: "Sign in user",

                body: signInBodySchema,
                response: {
                    200: signInResponseSchema,
                },
            },
        },
        authHandler.signIn
    );
};
