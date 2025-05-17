import { FastifyInstance } from "fastify";
import { UserHandler } from "./user.handler.js";

enum UserRoutes {}

export const createUserRoutes = (
    fastify: FastifyInstance,
    userHandler: UserHandler
) => {};