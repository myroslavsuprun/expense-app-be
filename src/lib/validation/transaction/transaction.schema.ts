import { z } from "zod";
import { TransactionType } from "@prisma/client";

const defaultTransactionSchema = z.object({
    id: z.string(),
    description: z.string(),
    amount: z.number().int(),
    date: z.date(),
    createdAt: z.date(),
    type: z.nativeEnum(TransactionType),

    category: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .nullable(),
});

export const getTransactionsQuerySchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    categoryId: z.string().uuid().optional(),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;

export const getTransactionsResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        transactions: z.array(defaultTransactionSchema),
        total: z.number(),
    }),
});

export type GetTransactionsResponse = z.infer<
    typeof getTransactionsResponseSchema
>;

export const createTransactionBodySchema = z.object({
    description: z.string(),
    amount: z.number().int(),
    type: z.nativeEnum(TransactionType),
    categoryId: z.string().uuid().nullable(),
    date: z.coerce.date(),
});

export type CreateTransactionBody = z.infer<typeof createTransactionBodySchema>;

export const createTransactionResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        transaction: defaultTransactionSchema,
    }),
});

export type CreateTransactionResponse = z.infer<
    typeof createTransactionResponseSchema
>;

export const deleteTransactionParamsSchema = z.object({
    id: z.string().uuid(),
});

export type DeleteTransactionParams = z.infer<
    typeof deleteTransactionParamsSchema
>;

export const deleteTransactionResponseSchema = z.object({
    message: z.string(),
});

export type DeleteTransactionResponse = z.infer<
    typeof deleteTransactionResponseSchema
>;

export const updateTransactionBodySchema = z.object({
    description: z.string().optional(),
    amount: z.number().int().optional(),
    type: z.nativeEnum(TransactionType).optional(),
    categoryId: z.string().uuid().nullable().optional(),
    date: z.coerce.date().optional(),
});

export type UpdateTransactionBody = z.infer<typeof updateTransactionBodySchema>;

export const updateTransactionParamsSchema = z.object({
    id: z.string().uuid(),
});

export type UpdateTransactionParams = z.infer<
    typeof updateTransactionParamsSchema
>;

export const updateTransactionResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        transaction: defaultTransactionSchema,
    }),
});

export type UpdateTransactionResponse = z.infer<
    typeof updateTransactionResponseSchema
>;
