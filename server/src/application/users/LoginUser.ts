import { UnauthorizedError } from "../../domain/shared/errors.js";
import { User } from "../../domain/users/User.js";
import { HashService } from "../ports/HashService.js";
import { TokenService } from "../ports/TokenService.js";
import { UserRepository } from "../ports/UserRepository.js";

interface LoginUserCommand {
  email: string;
  passwordPlain: string;
}

interface LoginUserResult {
  user: User;
  token: string;
}

export class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private tokenService: TokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const passwordHash = await this.userRepository.getPasswordHashByEmail(
      command.email,
    );
    if (!passwordHash) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isPasswordValid = await this.hashService.compare(
      command.passwordPlain,
      passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const token = this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      token,
    };
  }
}
