import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "@/lib/errors/errors.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { FindUniqueOrFail } from "@/database/prisma/prisma.type.js";
import { BaseRepository, generateRepository } from "../generate.repository.js";

export const defaultAuthUserSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserRepository = BaseRepository<"user"> & {
    findUniqueOrFail: FindUniqueOrFail<
        Prisma.UserFindUniqueArgs,
        Prisma.$UserPayload
    >;
};

export const createUserRepository = (prisma: PrismaClient): UserRepository => {
    const repository = generateRepository(prisma, "User");

    return {
        ...repository,
        findUniqueOrFail: async (args) => {
            const result = await prisma.user.findUnique(args);

            if (!result) {
                throw new NotFoundError("User not found");
            }

            return result;
        },
    };
};

addDIResolverName(createUserRepository, "userRepository");

