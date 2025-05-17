import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { TransactionService } from "./transaction.service.js";
import {
    BodyParamsRequest,
    BodyRequest,
    ParamsRequest,
    QueryRequest,
} from "@/types/handler.type.js";
import {
    CreateTransactionBody,
    UpdateTransactionBody,
    DeleteTransactionParams,
    UpdateTransactionParams,
    GetTransactionsQuery,
} from "@/lib/validation/transaction/transaction.schema.js";

export type TransactionHandler = {
    createTransaction: BodyRequest<CreateTransactionBody>;
    updateTransaction: BodyParamsRequest<
        UpdateTransactionBody,
        UpdateTransactionParams
    >;
    deleteTransaction: ParamsRequest<DeleteTransactionParams>;
    getTransactions: QueryRequest<GetTransactionsQuery>;
};

export const createTransactionHandler = (
    transactionService: TransactionService
): TransactionHandler => {
    return {
        createTransaction: async (req, res) => {
            const userId = req.user.id;
            const { body } = req;

            const response = await transactionService.createTransaction({
                userId,
                payload: body,
            });

            return res.send(response);
        },

        updateTransaction: async (req, res) => {
            const userId = req.user.id;
            const { body, params } = req;

            const response = await transactionService.updateTransaction({
                userId,
                params,
                payload: body,
            });

            return res.send(response);
        },

        deleteTransaction: async (req, res) => {
            const userId = req.user.id;
            const { params } = req;

            const response = await transactionService.deleteTransaction({
                userId,
                params,
            });

            return res.send(response);
        },

        getTransactions: async (req, res) => {
            const userId = req.user.id;
            const { query } = req;

            const response = await transactionService.getTransactions({
                query,
                userId,
            });

            return res.send(response);
        },
    };
};

addDIResolverName(createTransactionHandler, "transactionHandler");

