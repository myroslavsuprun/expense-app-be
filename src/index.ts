/// <reference types="./types/index.d.ts" />
import closeWithGrace from "close-with-grace";
import { execSync } from "child_process";
import { configureServer } from "./server.js";

const runMigrations = () => {
    console.log("Running database migrations...");

    try {
        execSync("npm run prisma:deploy");

        console.log("Migrations completed successfully");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

const main = async () => {
    // Run migrations before starting the server
    runMigrations();

    const fastify = await configureServer();

    const address = await fastify.listen({
        port: fastify.config.PORT,
        host: fastify.config.HOST,
    });

    fastify.log.info(`Documentation available at ${address}/api/docs/`);

    closeWithGrace(
        {
            delay: 500,
            logger: fastify.log,
        },
        async function ({ err, signal }) {
            if (err) {
                fastify.log.error(err, "server failed with an error");
            }

            fastify.log.info("server is closing: %s", signal);

            await fastify.close();
        }
    );
};

main().catch((err) => {
    console.error(err);

    process.exit(1);
});
