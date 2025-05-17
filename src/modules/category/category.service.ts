import { countOffset } from "@/lib/misc/offest.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { PAGINATION_DEFAULT } from "@/lib/constants/global.constant.js";
import {
    CategoryRepository,
    defaultCategorySelect,
} from "@/database/repositories/category/category.repository.js";
import {
    CreateCategoryBody,
    CreateCategoryResponse,
    DeleteCategoryParams,
    DeleteCategoryResponse,
    GetCategoriesQuery,
    GetCategoriesResponse,
} from "@/lib/validation/category/category.schema.js";

export type CategoryService = {
    getCategories: (p: {
        query: GetCategoriesQuery;
        userId: string;
    }) => Promise<GetCategoriesResponse>;
    deleteCategory: (p: {
        params: DeleteCategoryParams;
        userId: string;
    }) => Promise<DeleteCategoryResponse>;
    createCategory: (p: {
        userId: string;
        payload: CreateCategoryBody;
    }) => Promise<CreateCategoryResponse>;
};

export const createCategoryService = (
    categoryRepository: CategoryRepository
): CategoryService => ({
    createCategory: async ({ userId, payload }) => {
        const category = await categoryRepository.create({
            data: {
                name: payload.name,
                userId,
            },
            select: defaultCategorySelect,
        });

        return {
            message: "Category created successfully.",
            data: {
                category,
            },
        };
    },

    getCategories: async ({ query, userId }) => {
        const {
            page = PAGINATION_DEFAULT.PAGE,
            limit = PAGINATION_DEFAULT.LIMIT,
        } = query;

        const [categories, total] = await Promise.all([
            categoryRepository.findMany({
                where: {
                    userId,
                },
                select: defaultCategorySelect,
                take: limit,
                skip: countOffset(page, limit),
                orderBy: {
                    name: "asc",
                },
            }),
            categoryRepository.count({
                where: {
                    userId,
                },
            }),
        ]);

        return {
            message: "Categories fetched successfully.",
            data: {
                categories,
                total,
            },
        };
    },

    deleteCategory: async ({ params, userId }) => {
        await categoryRepository.findUniqueOrFail({
            where: {
                id: params.id,
                userId,
            },
        });

        await categoryRepository.delete({
            where: {
                id: params.id,
            },
        });

        return {
            message: "Category deleted successfully.",
        };
    },
});

addDIResolverName(createCategoryService, "categoryService");
