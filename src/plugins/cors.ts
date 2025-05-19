import fp from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";

const configureCors = async (fastify: FastifyInstance) => {
    await fastify.register(fastifyCors, {
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    });
};

export default fp(configureCors, {});
