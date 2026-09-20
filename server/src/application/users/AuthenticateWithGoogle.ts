import { UnauthorizedError } from "../../domain/shared/errors.js";
import { User } from "../../domain/users/User.js";
import { OAuthVerifier } from "../ports/OAuthVerifier.js";
import { TokenService } from "../ports/TokenService.js";
import { UserRepository } from "../ports/UserRepository.js";

interface AuthenticateWithGoogleCommand {
  idToken: string;
}

interface AuthenticateWithGoogleResult {
  user: User;
  token: string;
}

export class AuthenticateWithGoogle {
  constructor(
    private userRepository: UserRepository,
    private oauthVerifier: OAuthVerifier,
    private tokenService: TokenService,
  ) {}

  async execute(
    command: AuthenticateWithGoogleCommand,
  ): Promise<AuthenticateWithGoogleResult> {
    const googleProfile = await this.oauthVerifier.verifyGoogleToken(
      command.idToken,
    );

    if (!googleProfile.emailVerified) {
      throw new UnauthorizedError(
        "Google email address is not verified. Please verify your Google account first.",
      );
    }

    // 1. Check if user already exists by Google ID
    let user = await this.userRepository.findByGoogleId(googleProfile.googleId);

    // 2. If not found by Google ID, check if user exists by email (link account)
    if (!user) {
      const existingUserByEmail = await this.userRepository.findByEmail(
        googleProfile.email,
      );

      if (existingUserByEmail) {
        user = await this.userRepository.linkGoogleId(
          existingUserByEmail.id,
          googleProfile.googleId,
        );
      } else {
        // 3. New user provisioning
        user = await this.userRepository.createOAuthUser({
          email: googleProfile.email,
          name: googleProfile.name,
          googleId: googleProfile.googleId,
        });
      }
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
