import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController.js";

export const companyRouter = Router();
const controller = new CompanyController();

companyRouter.get("/", (req, res, next) => controller.getAll(req, res, next));
