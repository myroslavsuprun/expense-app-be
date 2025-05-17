import { addDIResolverName } from "@/lib/awilix/awilix.js";

export type UserHandler = {};

export const createUserHandler = (): UserHandler => {
    return {};
};

addDIResolverName(createUserHandler, "userHandler");