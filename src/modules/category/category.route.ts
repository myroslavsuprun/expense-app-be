import { FastifyInstance } from "fastify";
import { CategoryHandler } from "./category.handler.js";
import {
    createCategoryBodySchema,
    createCategoryResponseSchema,
    deleteCategoryParamsSchema,
    deleteCategoryResponseSchema,
    getCategoriesQuerySchema,
    getCategoriesResponseSchema,
} from "@/lib/validation/category/category.schema.js";

export const createCategoryRoutes = (
    fastify: FastifyInstance,
    categoryHandler: CategoryHandler
) => {
    fastify.get(
        "/",
        {
            preValidation: [fastify.authenticate],
            schema: {
                tags: ["Category"],
                summary: "Get all categories",
                querystring: getCategoriesQuerySchema,
                response: {
                    200: getCategoriesResponseSchema,
                },
            },
        },
        categoryHandler.getCategories
    );

    fastify.post(
        "/",
        {
            preValidation: [fastify.authenticate],
            schema: {
                tags: ["Category"],
                summary: "Create a new category",
                body: createCategoryBodySchema,
                response: {
                    200: createCategoryResponseSchema,
                },
            },
        },
        categoryHandler.createCategory
    );

    fastify.delete(
        "/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                tags: ["Category"],
                summary: "Delete a category",
                params: deleteCategoryParamsSchema,
                response: {
                    200: deleteCategoryResponseSchema,
                },
            },
        },
        categoryHandler.deleteCategory
    );
};

