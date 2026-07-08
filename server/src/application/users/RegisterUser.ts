import { ConflictError } from "../../domain/shared/errors.js";
import { User } from "../../domain/users/User.js";
import { HashService } from "../ports/HashService.js";
import { UserRepository } from "../ports/UserRepository.js";

interface RegisterUserCommand {
  email: string;
  name?: string;
  passwordPlain: string;
}

export class RegisterUser {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictError("A user with this email already exists.");
    }

    const passwordHash = await this.hashService.hash(command.passwordPlain);

    const newUser = await this.userRepository.create({
      email: command.email,
      name: command.name,
      passwordHash,
    });

    return newUser;
  }
}
