import bcrypt from "bcryptjs";
import { HashService } from "../../application/ports/HashService.js";

export class BcryptHashService implements HashService {
  private readonly rounds = 10;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.rounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
