import "dotenv/config";
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const port = Number.parseInt(process.env.PORT ?? "5050", 10);
let server;

const startServer = async () => {
  await connectDatabase();

  server = app.listen(port, () => {
    console.log(`🚀 API disponible en http://localhost:${port}/api`);
  });
};

const shutdown = (signal) => {
  console.log(`\n${signal} recibido. Cerrando la aplicación...`);

  if (!server) {
    return disconnectDatabase();
  }

  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

await startServer().catch((error) => {
  console.error("❌ No se ha podido iniciar la API:", error.message);
  process.exitCode = 1;
});
