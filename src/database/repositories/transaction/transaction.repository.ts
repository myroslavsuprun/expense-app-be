import { PrismaClient } from "@prisma/client";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { BaseRepository, generateRepository } from "../generate.repository.js";

export type TransactionRepository = BaseRepository<"transaction"> & {};

export const createTransactionRepository = (
    prisma: PrismaClient
): TransactionRepository => {
    const repository = generateRepository(prisma, "Transaction");

    return {
        ...repository,
    };
};

addDIResolverName(createTransactionRepository, "transactionRepository");