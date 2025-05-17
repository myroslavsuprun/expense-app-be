import { FastifyInstance } from "fastify";
import { createCategoryRoutes } from "./category.route.js";

// Define the endpoint prefix by providing autoPrefix module property.
export const autoPrefix = "/api/categories";

export default async function (fastify: FastifyInstance) {
    const categoryHandler = fastify.di.resolve("categoryHandler");
    createCategoryRoutes(fastify, categoryHandler);
}

