import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "@workspace/db";

async function start() {
  const rawPort = process.env["PORT"];

  if (!rawPort) {
    throw new Error(
      "PORT environment variable is required but was not provided.",
    );
  }

  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  // Run database migrations on every startup — safe, idempotent
  logger.info("Running database migrations...");
  await runMigrations();

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
