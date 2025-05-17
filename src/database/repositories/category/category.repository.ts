import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "@/lib/errors/errors.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { FindUniqueOrFail } from "@/database/prisma/prisma.type.js";
import { BaseRepository, generateRepository } from "../generate.repository.js";

export const defaultCategorySelect = {
    id: true,
    name: true,
    createdAt: true,
} satisfies Prisma.CategorySelect;

export type CategoryRepository = BaseRepository<"category"> & {
    findUniqueOrFail: FindUniqueOrFail<
        Prisma.CategoryFindUniqueArgs,
        Prisma.$CategoryPayload
    >;
};

export const createCategoryRepository = (
    prisma: PrismaClient
): CategoryRepository => {
    const repository = generateRepository(prisma, "Category");

    return {
        ...repository,
        findUniqueOrFail: async (args) => {
            const result = await prisma.category.findUnique(args);

            if (!result) {
                throw new NotFoundError("Category not found.");
            }

            return result;
        },
    };
};

addDIResolverName(createCategoryRepository, "categoryRepository");

