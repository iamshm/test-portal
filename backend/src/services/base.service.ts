import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.middleware";

interface AuditableAction {
  userId?: number;
  action: "create" | "update" | "delete";
  changes: Record<string, any>;
}

export abstract class BaseService {
  protected prisma: PrismaClient;
  protected model: string;

  constructor(model: string) {
    this.prisma = new PrismaClient();
    this.model = model;
  }

  protected async findAll(include?: any) {
    try {
      return await (this.prisma[this.model] as any).findMany({
        where: {
          deletedAt: null,
        },
        ...(include && { include }),
      });
    } catch (error) {
      throw new AppError(500, `Error fetching ${this.model}s`);
    }
  }

  protected async findById(id: number, include?: any) {
    try {
      const item = await (this.prisma[this.model] as any).findFirst({
        where: {
          id,
          deletedAt: null,
        },
        ...(include && { include }),
      });

      if (!item) {
        throw new AppError(404, `${this.model} not found`);
      }

      return item;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, `Error fetching ${this.model}`);
    }
  }

  protected async create(
    data: any,
    auditInfo?: { userId: number },
    include?: any
  ) {
    try {
      const result = await this.prisma.$transaction(
        async (prisma: PrismaClient) => {
          // Create the record
          const item = await (prisma[this.model] as any).create({
            data: {
              ...data,
              createdBy: auditInfo?.userId,
            },
            ...(include && { include }),
          });

          // Create audit log
          if (auditInfo?.userId) {
            await this.createAuditLog({
              userId: auditInfo.userId,
              action: "create",
              changes: { ...data },
              entityId: item.id,
            });
          }

          return item;
        }
      );

      return result;
    } catch (error) {
      throw new AppError(500, `Error creating ${this.model}`);
    }
  }

  protected async update(
    id: number,
    data: any,
    auditInfo?: { userId: number },
    include?: any
  ) {
    try {
      const result = await this.prisma.$transaction(
        async (prisma: PrismaClient) => {
          // Get current state for audit
          const currentItem = await (prisma[this.model] as any).findUnique({
            where: { id },
          });

          if (!currentItem) {
            throw new AppError(404, `${this.model} not found`);
          }

          // Update the record
          const item = await (prisma[this.model] as any).update({
            where: { id },
            data: {
              ...data,
              updatedBy: auditInfo?.userId,
            },
            ...(include && { include }),
          });

          // Create audit log
          if (auditInfo?.userId) {
            await this.createAuditLog({
              userId: auditInfo.userId,
              action: "update",
              changes: {
                before: currentItem,
                after: data,
              },
              entityId: id,
            });
          }

          return item;
        }
      );

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, `Error updating ${this.model}`);
    }
  }

  protected async delete(id: number, auditInfo?: { userId: number }) {
    try {
      await this.prisma.$transaction(async (prisma: PrismaClient) => {
        // Soft delete the record
        await (prisma[this.model] as any).update({
          where: { id },
          data: {
            deletedAt: new Date(),
            deletedBy: auditInfo?.userId,
          },
        });

        // Create audit log
        if (auditInfo?.userId) {
          await this.createAuditLog({
            userId: auditInfo.userId,
            action: "delete",
            changes: { id },
            entityId: id,
          });
        }
      });
    } catch (error) {
      throw new AppError(500, `Error deleting ${this.model}`);
    }
  }

  protected async findOne(where: any, include?: any) {
    try {
      const item = await (this.prisma[this.model] as any).findFirst({
        where: {
          ...where,
          deletedAt: null,
        },
        ...(include && { include }),
      });

      if (!item) {
        throw new AppError(404, `${this.model} not found`);
      }

      return item;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, `Error fetching ${this.model}`);
    }
  }

  protected async findMany(where: any, include?: any, orderBy?: any) {
    try {
      return await (this.prisma[this.model] as any).findMany({
        where: {
          ...where,
          deletedAt: null,
        },
        ...(include && { include }),
        ...(orderBy && { orderBy }),
      });
    } catch (error) {
      throw new AppError(500, `Error fetching ${this.model}s`);
    }
  }

  private async createAuditLog(audit: AuditableAction & { entityId: number }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          entityType: this.model,
          entityId: audit.entityId,
          action: audit.action,
          changes: audit.changes,
          performedBy: audit.userId,
        },
      });
    } catch (error) {
      console.error("Error creating audit log:", error);
      // Don't throw error as audit log failure shouldn't affect main operation
    }
  }
}
