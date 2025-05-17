import { FastifyInstance } from "fastify";
import { UserHandler } from "./user.handler.js";
import { getCurrentUserResponseSchema } from "@/lib/validation/user/user.schema.js";

export const createUserRoutes = (
    fastify: FastifyInstance,
    userHandler: UserHandler
) => {
    fastify.get(
        "/current",
        {
            preValidation: [fastify.authenticate],
            schema: {
                tags: ["User"],
                summary: "Get current logged in user",
                response: {
                    200: getCurrentUserResponseSchema,
                },
            },
        },
        userHandler.getCurrentUser
    );
};

