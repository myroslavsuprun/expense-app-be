import { NotFoundError } from "@/lib/errors/errors.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { GetCurrentUserResponse } from "@/lib/validation/user/user.schema.js";
import {
    defaultUserSelect,
    UserRepository,
} from "@/database/repositories/user/user.repository.js";

export type UserService = {
    getCurrentUser: (p: { userId: string }) => Promise<GetCurrentUserResponse>;
};

export const createUserService = (
    userRepository: UserRepository
): UserService => ({
    getCurrentUser: async ({ userId }) => {
        const user = await userRepository.findUnique({
            where: {
                id: userId,
            },
            select: defaultUserSelect,
        });

        if (!user) {
            throw new NotFoundError("User not found.");
        }

        return {
            message: "Current user fetched successfully.",
            data: {
                user,
            },
        };
    },
});

addDIResolverName(createUserService, "userService");
