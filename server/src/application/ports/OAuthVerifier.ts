export interface OAuthUserProfile {
  googleId: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  pictureUrl?: string;
}

export interface OAuthVerifier {
  verifyGoogleToken(idToken: string): Promise<OAuthUserProfile>;
}
