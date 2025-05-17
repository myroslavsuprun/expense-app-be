import { AwilixContainer } from "awilix";
import { EnvConfig } from "./env.type.js";
import { Cradle } from "./cradle.type.ts";
import { PrismaClient, User } from "@prisma/client";

declare module "fastify" {
    export interface FastifyInstance {
        config: EnvConfig;
        prisma: PrismaClient;
        di: AwilixContainer<Cradle>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authenticate: any;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: string;
        };
    }
}
