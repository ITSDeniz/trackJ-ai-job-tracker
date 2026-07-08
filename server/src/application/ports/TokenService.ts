export interface UserTokenPayload {
  userId: string;
  email: string;
}

export interface TokenService {
  generateToken(payload: UserTokenPayload): string;
  verifyToken(token: string): UserTokenPayload;
}
