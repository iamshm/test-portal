import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.middleware";

export abstract class BaseController {
  protected prisma: PrismaClient;
  protected model: string;

  constructor(model: string) {
    this.prisma = new PrismaClient();
    this.model = model;
  }

  protected async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await (this.prisma[this.model] as any).findMany();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  protected async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const item = await (this.prisma[this.model] as any).findUnique({
        where: { id: Number(id) },
      });

      if (!item) {
        throw new AppError(404, `${this.model} not found`);
      }

      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  protected async create(
    req: Request,
    res: Response,
    next: NextFunction,
    additionalData: Record<string, any> = {}
  ) {
    try {
      const data = { ...req.body, ...additionalData };
      const item = await (this.prisma[this.model] as any).create({
        data,
      });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  protected async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const item = await (this.prisma[this.model] as any).update({
        where: { id: Number(id) },
        data: req.body,
      });
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await (this.prisma[this.model] as any).delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
