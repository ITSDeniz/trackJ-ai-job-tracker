import jwt from "jsonwebtoken";
import {
  TokenService,
  UserTokenPayload,
} from "../../application/ports/TokenService.js";

export class JwtTokenService implements TokenService {
  constructor(private readonly jwtSecret: string) {}

  generateToken(payload: UserTokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: "1d" });
  }

  verifyToken(token: string): UserTokenPayload {
    return jwt.verify(token, this.jwtSecret) as UserTokenPayload;
  }
}
