import { FastifyReply, FastifyRequest } from "fastify";

export type BodyRequest<T> = (
    r: FastifyRequest<{
        Body: T;
    }>,
    rp: FastifyReply
) => Promise<void>;

export type RequestResponse = (
    r: FastifyRequest,
    rp: FastifyReply
) => Promise<void>;
