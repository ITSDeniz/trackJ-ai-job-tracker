import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { prisma } from "../../../infrastructure/database/prismaClient.js";

export class CompanyController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const companies = await prisma.company.findMany({
        where: { userId },
        orderBy: { name: "asc" },
      });
      res.status(200).json({
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  }
}
