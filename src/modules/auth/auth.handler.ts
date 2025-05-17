import { AuthService } from "./auth.service.js";
import { BodyRequest } from "@/types/handler.type.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { SignUpBody } from "@/lib/validation/auth/auth.schema.js";

export type AuthHandler = {
    signUp: BodyRequest<SignUpBody>;
};

export const createAuthHandler = (authService: AuthService): AuthHandler => {
    return {
        signUp: async (request, reply) => {
            const data = await authService.signUp(request.body);

            return reply.send(data);
        },
    };
};

addDIResolverName(createAuthHandler, "authHandler");

