import { FastifyReply, FastifyRequest } from "fastify";

export type BodyRequest<T> = (
    r: FastifyRequest<{
        Body: T;
    }>,
    rp: FastifyReply
) => Promise<void>;

export type BodyParamsRequest<T, U> = (
    r: FastifyRequest<{
        Body: T;
        Params: U;
    }>,
    rp: FastifyReply
) => Promise<void>;

export type RequestResponse = (
    r: FastifyRequest,
    rp: FastifyReply
) => Promise<void>;

export type QueryRequest<T> = (
    r: FastifyRequest<{
        Querystring: T;
    }>,
    rp: FastifyReply
) => Promise<void>;

export type ParamsRequest<T> = (
    r: FastifyRequest<{
        Params: T;
    }>,
    rp: FastifyReply
) => Promise<void>;
