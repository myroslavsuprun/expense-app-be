import { CategoryService } from "./category.service.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import {
    BodyRequest,
    ParamsRequest,
    QueryRequest,
} from "@/types/handler.type.js";
import {
    CreateCategoryBody,
    DeleteCategoryParams,
    GetCategoriesQuery,
} from "@/lib/validation/category/category.schema.js";

export type CategoryHandler = {
    getCategories: QueryRequest<GetCategoriesQuery>;
    deleteCategory: ParamsRequest<DeleteCategoryParams>;
    createCategory: BodyRequest<CreateCategoryBody>;
};

export const createCategoryHandler = (
    categoryService: CategoryService
): CategoryHandler => {
    return {
        getCategories: async (request, reply) => {
            const userId = request.user.id;
            const query = request.query;

            const data = await categoryService.getCategories({
                query,
                userId,
            });

            return reply.send(data);
        },

        deleteCategory: async (request, reply) => {
            const userId = request.user.id;
            const params = request.params;

            const data = await categoryService.deleteCategory({
                params,
                userId,
            });

            return reply.send(data);
        },

        createCategory: async (request, reply) => {
            const userId = request.user.id;
            const payload = request.body;

            const data = await categoryService.createCategory({
                userId,
                payload,
            });

            return reply.send(data);
        },
    };
};

addDIResolverName(createCategoryHandler, "categoryHandler");

