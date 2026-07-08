import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { PrismaJobApplicationRepository } from "../../../infrastructure/database/PrismaJobApplicationRepository.js";
import { PrismaCompanyRepository } from "../../../infrastructure/database/PrismaCompanyRepository.js";
import { CreateJobApplication } from "../../../application/job-applications/CreateJobApplication.js";
import { GetJobApplication } from "../../../application/job-applications/GetJobApplication.js";
import { GetJobApplications } from "../../../application/job-applications/GetJobApplications.js";
import { UpdateJobApplication } from "../../../application/job-applications/UpdateJobApplication.js";
import { DeleteJobApplication } from "../../../application/job-applications/DeleteJobApplication.js";

const jobAppRepository = new PrismaJobApplicationRepository();
const companyRepository = new PrismaCompanyRepository();

const createUseCase = new CreateJobApplication(jobAppRepository, companyRepository);
const getOneUseCase = new GetJobApplication(jobAppRepository);
const getAllUseCase = new GetJobApplications(jobAppRepository);
const updateUseCase = new UpdateJobApplication(jobAppRepository, companyRepository);
const deleteUseCase = new DeleteJobApplication(jobAppRepository);

export class JobApplicationController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const app = await createUseCase.execute({
        userId,
        ...req.body,
      });

      res.status(201).json({
        data: app,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const app = await getOneUseCase.execute(id, userId);

      res.status(200).json({
        data: app,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const query = req.query as unknown as {
        page: number;
        pageSize: number;
        status?: string;
        priority?: string;
        companyId?: string;
        search?: string;
        nextActionBefore?: Date;
        sort?: string;
      };

      const page = query.page;
      const pageSize = query.pageSize;

      // Parse sorting (e.g. -createdAt -> field: "createdAt", direction: "desc")
      let sortField = "createdAt";
      let sortDirection: "asc" | "desc" = "desc";
      const sortParam = query.sort;
      if (sortParam) {
        if (sortParam.startsWith("-")) {
          sortField = sortParam.substring(1);
          sortDirection = "desc";
        } else {
          sortField = sortParam;
          sortDirection = "asc";
        }
      }

      const result = await getAllUseCase.execute({
        userId,
        filters: {
          status: query.status,
          priority: query.priority,
          companyId: query.companyId,
          search: query.search,
          nextActionBefore: query.nextActionBefore,
        },
        sort: {
          field: sortField,
          direction: sortDirection,
        },
        pagination: {
          page,
          pageSize,
        },
      });

      res.status(200).json({
        data: result.data,
        pagination: {
          page,
          pageSize,
          total: result.total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const app = await updateUseCase.execute({
        id,
        userId,
        ...req.body,
      });

      res.status(200).json({
        data: app,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      await deleteUseCase.execute(id, userId);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
