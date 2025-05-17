import { UserService } from "./user.service.js";
import { RequestResponse } from "@/types/handler.type.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";

export type UserHandler = {
    getCurrentUser: RequestResponse;
};

export const createUserHandler = (userService: UserService): UserHandler => {
    return {
        getCurrentUser: async (request, reply) => {
            const userId = request.user.id;

            const data = await userService.getCurrentUser({ userId });

            return reply.send(data);
        },
    };
};

addDIResolverName(createUserHandler, "userHandler");

