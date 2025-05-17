import { FastifyInstance } from "fastify";
import { TransactionHandler } from "./transaction.handler.js";
import {
    createTransactionBodySchema,
    createTransactionResponseSchema,
    deleteTransactionParamsSchema,
    deleteTransactionResponseSchema,
    getTransactionsQuerySchema,
    getTransactionsResponseSchema,
    updateTransactionBodySchema,
    updateTransactionParamsSchema,
    updateTransactionResponseSchema,
} from "@/lib/validation/transaction/transaction.schema.js";

export const createTransactionRoutes = (
    fastify: FastifyInstance,
    transactionHandler: TransactionHandler
) => {
    fastify.get(
        "/",
        {
            preValidation: [fastify.authenticate],
            schema: {
                tags: ["Transaction"],
                summary: "Get all transactions",
                querystring: getTransactionsQuerySchema,
                response: {
                    200: getTransactionsResponseSchema,
                },
            },
        },
        transactionHandler.getTransactions
    );

    fastify.post(
        "/",
        {
            preValidation: [fastify.authenticate],
            schema: {
                tags: ["Transaction"],
                summary: "Create a new transaction",
                body: createTransactionBodySchema,
                response: {
                    200: createTransactionResponseSchema,
                },
            },
        },
        transactionHandler.createTransaction
    );

    fastify.delete(
        "/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                tags: ["Transaction"],
                summary: "Delete a transaction",
                params: deleteTransactionParamsSchema,
                response: {
                    200: deleteTransactionResponseSchema,
                },
            },
        },
        transactionHandler.deleteTransaction
    );

    fastify.patch(
        "/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                tags: ["Transaction"],
                summary: "Update a transaction",
                params: updateTransactionParamsSchema,
                body: updateTransactionBodySchema,
                response: {
                    200: updateTransactionResponseSchema,
                },
            },
        },
        transactionHandler.updateTransaction
    );
};

