import { PrismaClient } from "@prisma/client";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { BaseRepository, generateRepository } from "../generate.repository.js";

export type CategoryRepository = BaseRepository<"category"> & {};

export const createCategoryRepository = (
    prisma: PrismaClient
): CategoryRepository => {
    const repository = generateRepository(prisma, "Category");

    return {
        ...repository,
    };
};

addDIResolverName(createCategoryRepository, "categoryRepository");