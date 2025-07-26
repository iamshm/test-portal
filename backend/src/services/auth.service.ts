import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseService } from "./base.service";
import { AppError } from "../middleware/error.middleware";
import { config } from "../config";
import type { User } from "@prisma/client";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export class AuthService extends BaseService {
  constructor() {
    super("user");
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new AppError(400, "User already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        data.password,
        config.bcryptSaltRounds
      );

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
        },
      });

      // Generate token
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error registering user");
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new AppError(401, "Invalid credentials");
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new AppError(401, "Invalid credentials");
      }

      // Generate token
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error logging in");
    }
  }

  async getCurrentUser(userId: number): Promise<Omit<User, "password">> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError(404, "User not found");
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error fetching user");
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );
  }

  async validateToken(
    token: string
  ): Promise<{ userId: number; email: string }> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: number;
        email: string;
      };
      return decoded;
    } catch (error) {
      throw new AppError(401, "Invalid token");
    }
  }
}
