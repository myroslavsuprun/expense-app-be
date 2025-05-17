import { FastifyInstance } from "fastify";
import { createTransactionRoutes } from "./transaction.route.js";

// Define the endpoint prefix by providing autoPrefix module property.
export const autoPrefix = "/api/transactions";

export default async function (fastify: FastifyInstance) {
    const transactionHandler = fastify.di.resolve("transactionHandler");
    createTransactionRoutes(fastify, transactionHandler);
}

