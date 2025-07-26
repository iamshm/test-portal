import { PrismaClient } from "@prisma/client";

class DatabaseMonitor {
  private prisma: PrismaClient;
  private checkInterval: NodeJS.Timeout | null;
  private readonly MONITOR_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });
    this.checkInterval = null;
  }

  async start() {
    this.checkInterval = setInterval(() => {
      this.checkDatabaseHealth();
    }, this.MONITOR_INTERVAL);

    // Initial check
    await this.checkDatabaseHealth();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkDatabaseHealth() {
    try {
      // Basic health check
      await this.prisma.$queryRaw`SELECT 1`;

      // Check active connections (connection pool)
      const connectionCount = await this.prisma.$queryRaw<{ count: number }[]>`
        SELECT count(*) FROM pg_stat_activity
      `;

      // Basic query performance check
      const slowQueries = await this.prisma.$queryRaw<
        { query: string; duration: number }[]
      >`
        SELECT query, total_exec_time as duration
        FROM pg_stat_statements
        WHERE total_exec_time > 1000
        LIMIT 3
      `;

      // Log basic metrics
      console.log("Database Health Check:", {
        timestamp: new Date(),
        connections: connectionCount[0].count,
        slowQueriesCount: slowQueries.length,
      });
    } catch (error) {
      console.error("Database health check failed:", error);
    }
  }
}

export const dbMonitor = new DatabaseMonitor();
