import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth";

const prisma = new PrismaClient();

export class AuthController {
  async register(req: Request<{}, {}, RegisterRequest>, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        password,
        config.bcryptSaltRounds
      );

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: "24h" }
      );

      const response: AuthResponse = {
        token,
        user,
      };

      return res.status(201).json(response);
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request<{}, {}, LoginRequest>, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: "24h" }
      );

      const response: AuthResponse = {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async me(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
