import { FastifyInstance } from "fastify";
import { AuthHandler } from "./auth.handler.js";
import {
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
                body: signUpBodySchema,
                response: {
                    200: signUpResponseSchema,
                },
            },
        },
        authHandler.signUp
    );

    // fastify.post(
    //     "/login",
    //     {
    //         schema: {
    //             body: authHandler.loginBodySchema,
    //         },
    //     },
    //     authHandler.login
    // );
};
