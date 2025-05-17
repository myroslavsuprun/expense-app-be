import { addDIResolverName } from "@/lib/awilix/awilix.js";

export type UserService = {};

export const createuserService = (): UserService => ({});

addDIResolverName(createuserService, "userService");