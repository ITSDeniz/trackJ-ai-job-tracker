import { Request, Response, NextFunction } from "express";
import { RegisterUser } from "../../../application/users/RegisterUser.js";
import { LoginUser } from "../../../application/users/LoginUser.js";
import { PrismaUserRepository } from "../../../infrastructure/database/PrismaUserRepository.js";
import { BcryptHashService } from "../../../infrastructure/security/BcryptHashService.js";
import { JwtTokenService } from "../../../infrastructure/security/JwtTokenService.js";
import { loadConfig } from "../../../config/loadConfig.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { prisma } from "../../../infrastructure/database/prismaClient.js";

const config = loadConfig();
const userRepository = new PrismaUserRepository();
const hashService = new BcryptHashService();
const tokenService = new JwtTokenService(config.jwtSecret);

const registerUseCase = new RegisterUser(userRepository, hashService);
const loginUseCase = new LoginUser(userRepository, hashService, tokenService);

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const user = await registerUseCase.execute({
        email,
        passwordPlain: password,
        name,
      });

      res.status(201).json({
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await loginUseCase.execute({
        email,
        passwordPlain: password,
      });

      res.status(200).json({
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          error: { code: "unauthorized", message: "Not authenticated" },
        });
        return;
      }
      const user = await userRepository.findById(userId);
      if (!user) {
        res
          .status(404)
          .json({ error: { code: "not_found", message: "User not found" } });
        return;
      }
      res.status(200).json({
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { email, name, password } = req.body;

      // 1. If email is changing, verify it is not already taken by another user
      if (email) {
        const existing = await userRepository.findByEmail(email.trim().toLowerCase());
        if (existing && existing.id !== userId) {
          res.status(400).json({
            error: {
              code: "conflict",
              message: "Email address is already in use.",
            },
          });
          return;
        }
      }

      // 2. Build the data object dynamically
      const updateData: any = {};
      if (email) updateData.email = email.trim().toLowerCase();
      if (name !== undefined) updateData.name = name;
      if (password) {
        updateData.password = await hashService.hash(password);
      }

      // 3. Update in database
      const updated = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        data: {
          user: updated,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

