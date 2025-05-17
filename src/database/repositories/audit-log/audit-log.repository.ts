import { PrismaClient } from "@prisma/client";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { BaseRepository, generateRepository } from "../generate.repository.js";

export type AuditLogRepository = BaseRepository<"auditLog"> & {};

export const createAuditLogRepository = (
    prisma: PrismaClient
): AuditLogRepository => {
    const repository = generateRepository(prisma, "AuditLog");

    return {
        ...repository,
    };
};

addDIResolverName(createAuditLogRepository, "auditLogRepository");