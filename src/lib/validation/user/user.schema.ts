import { z } from "zod";

const defaultUserSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const getCurrentUserResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        user: defaultUserSchema,
    }),
});

export type GetCurrentUserResponse = z.infer<
    typeof getCurrentUserResponseSchema
>;
