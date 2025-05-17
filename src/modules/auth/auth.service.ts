import { JWT } from "@fastify/jwt";
import { UserRole } from "@prisma/client";
import { hashing } from "@/lib/hashing/hashing.js";
import { ConflictError } from "@/lib/errors/errors.js";
import { ACCES_TOKEN_EXPIRES_IN } from "./auth.const.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import {
    AccessTokenJWT,
    SignUpBody,
    SignUpResponse,
} from "@/lib/validation/auth/auth.schema.js";
import {
    defaultAuthUserSelect,
    UserRepository,
} from "@/database/repositories/user/user.repository.js";

export type AuthService = {
    signUp: (p: SignUpBody) => Promise<SignUpResponse>;
};

export const createauthService = (
    userRepository: UserRepository,
    jwt: JWT
): AuthService => ({
    signUp: async (p: SignUpBody) => {
        const user = await userRepository.findUnique({
            where: {
                email: p.email,
            },
            select: {
                id: true,
            },
        });

        if (user) {
            throw new ConflictError(
                "User with the provided email already exists."
            );
        }

        const passwordHashed = await hashing.hashPassword(p.password);

        const createdUser = await userRepository.create({
            data: {
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                password: passwordHashed,
                role: UserRole.USER,
            },
            select: defaultAuthUserSelect,
        });

        const tokenPayload: AccessTokenJWT = {
            id: createdUser.id,
            type: "access",
        };

        const token = jwt.sign(tokenPayload, {
            expiresIn: ACCES_TOKEN_EXPIRES_IN,
        });

        return {
            message: "User created successfully.",
            data: {
                user: createdUser,
                token,
            },
        };
    },
});

addDIResolverName(createauthService, "authService");
