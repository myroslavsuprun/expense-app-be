import { z } from "zod";
import { UserRole } from "@prisma/client";

const authUserSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    role: z.nativeEnum(UserRole),
});

export const signUpBodySchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export type SignUpBody = z.infer<typeof signUpBodySchema>;

export const signUpResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        user: authUserSchema,
        token: z.string(),
    }),
});

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;

export const signInBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type SignInBody = z.infer<typeof signInBodySchema>;

export const signInResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        user: authUserSchema,
        token: z.string(),
    }),
});

export type SignInResponse = z.infer<typeof signInResponseSchema>;

export const accessTokenJWTSchema = z.object({
    id: z.string(),
    type: z.literal("access"),
});

export type AccessTokenJWT = z.infer<typeof accessTokenJWTSchema>;
