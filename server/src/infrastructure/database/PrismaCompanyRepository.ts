import { prisma } from "./prismaClient.js";
import {
  Company,
  CompanyRepository,
} from "../../application/ports/CompanyRepository.js";

export class PrismaCompanyRepository implements CompanyRepository {
  async findByName(name: string, userId: string): Promise<Company | null> {
    return prisma.company.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async findById(id: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { id },
    });
  }

  async create(name: string, userId: string): Promise<Company> {
    return prisma.company.create({
      data: {
        name,
        userId,
      },
    });
  }
}
