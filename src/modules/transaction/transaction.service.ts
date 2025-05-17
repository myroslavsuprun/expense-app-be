import { Prisma } from "@prisma/client";
import { countOffset } from "@/lib/misc/offest.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { PAGINATION_DEFAULT } from "@/lib/constants/global.constant.js";
import { CategoryRepository } from "@/database/repositories/category/category.repository.js";
import {
    defaultTransactionSelect,
    TransactionRepository,
} from "@/database/repositories/transaction/transaction.repository.js";
import {
    CreateTransactionBody,
    GetTransactionsQuery,
    UpdateTransactionResponse,
    DeleteTransactionResponse,
    CreateTransactionResponse,
    UpdateTransactionParams,
    GetTransactionsResponse,
    DeleteTransactionParams,
    UpdateTransactionBody,
} from "@/lib/validation/transaction/transaction.schema.js";

export type TransactionService = {
    createTransaction: (p: {
        userId: string;
        payload: CreateTransactionBody;
    }) => Promise<CreateTransactionResponse>;

    getTransactions: (p: {
        query: GetTransactionsQuery;
        userId: string;
    }) => Promise<GetTransactionsResponse>;

    deleteTransaction: (p: {
        params: DeleteTransactionParams;
        userId: string;
    }) => Promise<DeleteTransactionResponse>;

    updateTransaction: (p: {
        params: UpdateTransactionParams;
        userId: string;
        payload: UpdateTransactionBody;
    }) => Promise<UpdateTransactionResponse>;
};

export const createTransactionService = (
    transactionRepository: TransactionRepository,
    categoryRepository: CategoryRepository
): TransactionService => ({
    createTransaction: async ({ userId, payload }) => {
        if (payload.categoryId) {
            await categoryRepository.findUniqueOrFail({
                where: {
                    userId,
                    id: payload.categoryId,
                },
                select: {
                    id: true,
                },
            });
        }

        const transaction = await transactionRepository.create({
            data: {
                description: payload.description,
                amount: payload.amount,
                type: payload.type,
                categoryId: payload.categoryId,
                date: payload.date,
                userId,
            },
            select: defaultTransactionSelect,
        });

        return {
            message: "Transaction created successfully.",
            data: {
                transaction,
            },
        };
    },

    getTransactions: async ({ query, userId }) => {
        const {
            page = PAGINATION_DEFAULT.PAGE,
            limit = PAGINATION_DEFAULT.LIMIT,
            categoryId,
        } = query;

        if (categoryId) {
            await categoryRepository.findUniqueOrFail({
                where: {
                    userId,
                    id: categoryId,
                },
                select: {
                    id: true,
                },
            });
        }

        const where: Prisma.TransactionWhereInput = {
            userId,
            ...(categoryId && {
                categoryId,
            }),
        };

        const [transactions, total] = await Promise.all([
            transactionRepository.findMany({
                where,
                select: defaultTransactionSelect,
                take: limit,
                skip: countOffset(page, limit),
                orderBy: {
                    date: "desc",
                },
            }),
            transactionRepository.count({
                where,
            }),
        ]);

        return {
            message: "Transactions retrieved successfully.",
            data: {
                transactions,
                total,
            },
        };
    },

    deleteTransaction: async ({ params, userId }) => {
        await transactionRepository.findUniqueOrFail({
            where: {
                id: params.id,
                userId,
            },
            select: defaultTransactionSelect,
        });

        await transactionRepository.delete({
            where: {
                id: params.id,
            },
        });

        return {
            message: "Transaction deleted successfully.",
        };
    },

    updateTransaction: async ({ params, userId, payload }) => {
        await transactionRepository.findUniqueOrFail({
            where: {
                id: params.id,
                userId,
            },
            select: {
                id: true,
            },
        });

        if (payload.categoryId) {
            await categoryRepository.findUniqueOrFail({
                where: {
                    userId,
                    id: payload.categoryId,
                },
                select: {
                    id: true,
                },
            });
        }

        const transaction = await transactionRepository.update({
            where: {
                id: params.id,
                userId,
            },
            data: {
                description: payload.description,
                amount: payload.amount,
                type: payload.type,
                categoryId: payload.categoryId,
                date: payload.date,
            },
            select: defaultTransactionSelect,
        });

        return {
            message: "Transaction updated successfully.",
            data: {
                transaction,
            },
        };
    },
});

addDIResolverName(createTransactionService, "transactionService");
