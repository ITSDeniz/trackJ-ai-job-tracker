import { prisma } from "./prismaClient.js";
import { User } from "../../domain/users/User.js";
import { UserRepository } from "../../application/ports/UserRepository.js";

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { googleId } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async linkGoogleId(userId: string, googleId: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });
    return this.mapToDomain(user);
  }

  async getPasswordHashByEmail(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });
    if (!user) return null;
    return user.password;
  }

  async create(user: {
    email: string;
    name?: string;
    passwordHash: string;
  }): Promise<User> {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name || null,
        password: user.passwordHash,
      },
    });
    return this.mapToDomain(created);
  }

  async createOAuthUser(user: {
    email: string;
    name?: string;
    googleId: string;
  }): Promise<User> {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name || null,
        googleId: user.googleId,
      },
    });
    return this.mapToDomain(created);
  }

  private mapToDomain(dbUser: {
    id: string;
    email: string;
    name: string | null;
    googleId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      googleId: dbUser.googleId,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    };
  }
}
