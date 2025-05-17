import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "@/lib/errors/errors.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { FindUniqueOrFail } from "@/database/prisma/prisma.type.js";
import { BaseRepository, generateRepository } from "../generate.repository.js";

export const defaultTransactionSelect = {
    id: true,
    description: true,
    amount: true,
    date: true,
    type: true,
    createdAt: true,

    category: {
        select: {
            id: true,
            name: true,
        },
    },
} satisfies Prisma.TransactionSelect;

export type TransactionRepository = BaseRepository<"transaction"> & {
    findUniqueOrFail: FindUniqueOrFail<
        Prisma.TransactionFindUniqueArgs,
        Prisma.$TransactionPayload
    >;
};

export const createTransactionRepository = (
    prisma: PrismaClient
): TransactionRepository => {
    const repository = generateRepository(prisma, "Transaction");

    return {
        ...repository,
        findUniqueOrFail: async (args) => {
            const transaction = await prisma.transaction.findUnique(args);

            if (!transaction) {
                throw new NotFoundError("Transaction not found.");
            }

            return transaction;
        },
    };
};

addDIResolverName(createTransactionRepository, "transactionRepository");

