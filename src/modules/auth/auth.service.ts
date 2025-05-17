import { JWT } from "@fastify/jwt";
import { UserRole } from "@prisma/client";
import { hashing } from "@/lib/hashing/hashing.js";
import { ACCES_TOKEN_EXPIRES_IN } from "./auth.const.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
} from "@/lib/errors/errors.js";
import {
    defaultAuthUserSelect,
    UserRepository,
} from "@/database/repositories/user/user.repository.js";
import {
    AccessTokenJWT,
    SignInBody,
    SignInResponse,
    SignUpBody,
    SignUpResponse,
} from "@/lib/validation/auth/auth.schema.js";

export type AuthService = {
    signUp: (p: SignUpBody) => Promise<SignUpResponse>;
    signIn: (p: SignInBody) => Promise<SignInResponse>;
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

    signIn: async (p: SignInBody) => {
        const user = await userRepository.findUnique({
            where: {
                email: p.email,
            },
            select: {
                id: true,
                password: true,
            },
        });

        if (!user) {
            throw new BadRequestError("Invalid email or password.");
        }

        const isPasswordValid = await hashing.comparePassword(
            p.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new BadRequestError("Invalid email or password.");
        }

        const tokenPayload: AccessTokenJWT = {
            id: user.id,
            type: "access",
        };

        const token = jwt.sign(tokenPayload, {
            expiresIn: ACCES_TOKEN_EXPIRES_IN,
        });

        const userData = await userRepository.findUnique({
            where: {
                id: user.id,
            },
            select: defaultAuthUserSelect,
        });

        if (!userData) {
            throw new NotFoundError("User not found.");
        }

        return {
            message: "User signed in successfully.",
            data: {
                user: userData,
                token,
            },
        };
    },
});

addDIResolverName(createauthService, "authService");
