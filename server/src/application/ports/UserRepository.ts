import { User } from "../../domain/users/User.js";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  getPasswordHashByEmail(email: string): Promise<string | null>;
  create(user: {
    email: string;
    name?: string;
    passwordHash: string;
  }): Promise<User>;
}
