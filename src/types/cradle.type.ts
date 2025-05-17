import { JWT } from "@fastify/jwt";
import { EnvConfig } from "./env.type.js";
import { FastifyBaseLogger } from "fastify";
import { PrismaClient } from "@prisma/client/extension";
import { AuthService } from "@/modules/auth/auth.service.js";
import { AuthHandler } from "@/modules/auth/auth.handler.js";
import { UserService } from "@/modules/user/user.service.js";
import { UserHandler } from "@/modules/user/user.handler.js";
import { UserRepository } from "@/database/repositories/user/user.repository.js";
import { CategoryRepository } from "@/database/repositories/category/category.repository.js";
import { AuditLogRepository } from "@/database/repositories/audit-log/audit-log.repository.js";
import { TransactionRepository } from "@/database/repositories/transaction/transaction.repository.js";

export type Cradle = {
    log: FastifyBaseLogger;
    prisma: PrismaClient;
    config: EnvConfig;
    jwt: JWT;

    authService: AuthService;
    authHandler: AuthHandler;

    categoryRepository: CategoryRepository;

    auditLogRepository: AuditLogRepository;

    transactionRepository: TransactionRepository;

    userRepository: UserRepository;

    userService: UserService;
    userHandler: UserHandler;
};
