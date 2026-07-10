import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { prisma } from "../../../infrastructure/database/prismaClient.js";
import { z } from "zod";

const UpdateCompanySchema = z.object({
  website: z.string().url("Must be a valid URL").or(z.string().length(0)).nullable().optional(),
  industry: z.string().max(100).nullable().optional(),
  size: z.string().max(50).nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export class CompanyController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const companies = await prisma.company.findMany({
        where: { userId },
        include: {
          _count: {
            select: { jobApplications: true },
          },
        },
        orderBy: { name: "asc" },
      });
      res.status(200).json({
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      if (!id) {
        res.status(400).json({ error: "Company ID is required" });
        return;
      }

      const existing = await prisma.company.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        res.status(404).json({ error: "Company not found" });
        return;
      }

      const result = UpdateCompanySchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: "Validation failed",
          fields: result.error.flatten().fieldErrors,
        });
        return;
      }

      const updated = await prisma.company.update({
        where: { id },
        data: result.data,
      });

      res.status(200).json({
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      if (!id) {
        res.status(400).json({ error: "Company ID is required" });
        return;
      }

      const existing = await prisma.company.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        res.status(404).json({ error: "Company not found" });
        return;
      }

      const jobCount = await prisma.jobApplication.count({
        where: { companyId: id },
      });

      if (jobCount > 0) {
        res.status(400).json({
          error: "Cannot delete company with active job applications.",
        });
        return;
      }

      await prisma.company.delete({
        where: { id },
      });

      res.status(200).json({
        message: "Company deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}
