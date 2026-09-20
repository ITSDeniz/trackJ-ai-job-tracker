import { OAuth2Client } from "google-auth-library";
import {
  OAuthVerifier,
  OAuthUserProfile,
} from "../../application/ports/OAuthVerifier.js";

export class GoogleAuthService implements OAuthVerifier {
  private client: OAuth2Client;
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
    this.client = new OAuth2Client(clientId);
  }

  async verifyGoogleToken(idToken: string): Promise<OAuthUserProfile> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new Error("Invalid Google token payload.");
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      emailVerified: Boolean(payload.email_verified),
      name: payload.name,
      pictureUrl: payload.picture,
    };
  }
}
