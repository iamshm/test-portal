import app from "./app";
import { config } from "./config";
import { dbMonitor } from "./utils/dbMonitor";

const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);

  // Start basic database health monitoring
  dbMonitor.start();
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Closing server...");
  dbMonitor.stop();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
