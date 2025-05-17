import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest } from "fastify";
import { UnauthorizedError } from "@/lib/errors/errors.js";
import { FastifyPlugin } from "@/lib/fastify/fastify.constant.js";
import {
    AccessTokenJWT,
    accessTokenJWTSchema,
} from "@/lib/validation/auth/auth.schema.js";

const configureAuthPlugin = async (fastify: FastifyInstance) => {
    fastify.decorate("authenticate", async (request: FastifyRequest) => {
        try {
            const authHeader = request.headers.authorization;

            if (!authHeader) {
                throw new UnauthorizedError("Missing authorization header");
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                throw new UnauthorizedError("Invalid token format");
            }

            const decodedToken = fastify.jwt.verify<AccessTokenJWT>(token);

            await accessTokenJWTSchema.parseAsync(decodedToken);

            request.user = {
                id: decodedToken.id,
            };
        } catch {
            throw new UnauthorizedError("Unauthorized");
        }
    });
};

export default fp(configureAuthPlugin, {
    name: FastifyPlugin.Authenticate,
    dependencies: [FastifyPlugin.Jwt],
});
