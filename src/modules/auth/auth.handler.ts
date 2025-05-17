import { AuthService } from "./auth.service.js";
import { BodyRequest } from "@/types/handler.type.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { SignInBody, SignUpBody } from "@/lib/validation/auth/auth.schema.js";

export type AuthHandler = {
    signUp: BodyRequest<SignUpBody>;
    signIn: BodyRequest<SignInBody>;
};

export const createAuthHandler = (authService: AuthService): AuthHandler => {
    return {
        signUp: async (request, reply) => {
            const data = await authService.signUp(request.body);

            return reply.send(data);
        },

        signIn: async (request, reply) => {
            const data = await authService.signIn(request.body);

            return reply.send(data);
        },
    };
};

addDIResolverName(createAuthHandler, "authHandler");
