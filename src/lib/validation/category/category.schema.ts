import { z } from "zod";

const defaultCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.date(),
});

export const createCategoryBodySchema = z.object({
    name: z.string(),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const createCategoryResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        category: defaultCategorySchema,
    }),
});

export type CreateCategoryResponse = z.infer<
    typeof createCategoryResponseSchema
>;

export const getCategoriesQuerySchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
});

export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;

export const getCategoriesResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        categories: z.array(defaultCategorySchema),
    }),
});

export type GetCategoriesResponse = z.infer<typeof getCategoriesResponseSchema>;

export const deleteCategoryParamsSchema = z.object({
    id: z.string().uuid(),
});

export type DeleteCategoryParams = z.infer<typeof deleteCategoryParamsSchema>;

export const deleteCategoryResponseSchema = z.object({
    message: z.string(),
});

export type DeleteCategoryResponse = z.infer<
    typeof deleteCategoryResponseSchema
>;
