import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthenticateWithGoogle } from "./AuthenticateWithGoogle.js";
import { UserRepository } from "../ports/UserRepository.js";
import { OAuthVerifier, OAuthUserProfile } from "../ports/OAuthVerifier.js";
import { TokenService } from "../ports/TokenService.js";
import { UnauthorizedError } from "../../domain/shared/errors.js";

describe("AuthenticateWithGoogle Use Case", () => {
  let mockUserRepository: UserRepository;
  let mockOAuthVerifier: OAuthVerifier;
  let mockTokenService: TokenService;
  let useCase: AuthenticateWithGoogle;

  const mockGoogleProfile: OAuthUserProfile = {
    googleId: "google-12345",
    email: "user@example.com",
    emailVerified: true,
    name: "John Doe",
  };

  const mockUser = {
    id: "user-1",
    email: "user@example.com",
    name: "John Doe",
    googleId: "google-12345",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByGoogleId: vi.fn(),
      linkGoogleId: vi.fn(),
      getPasswordHashByEmail: vi.fn(),
      create: vi.fn(),
      createOAuthUser: vi.fn(),
    };

    mockOAuthVerifier = {
      verifyGoogleToken: vi.fn().mockResolvedValue(mockGoogleProfile),
    };

    mockTokenService = {
      generateToken: vi.fn().mockReturnValue("jwt-token-123"),
      verifyToken: vi.fn(),
    };

    useCase = new AuthenticateWithGoogle(
      mockUserRepository,
      mockOAuthVerifier,
      mockTokenService,
    );
  });

  it("should throw UnauthorizedError if Google email is not verified", async () => {
    vi.mocked(mockOAuthVerifier.verifyGoogleToken).mockResolvedValueOnce({
      ...mockGoogleProfile,
      emailVerified: false,
    });

    await expect(useCase.execute({ idToken: "unverified-token" })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("should authenticate and return token for existing Google user", async () => {
    vi.mocked(mockUserRepository.findByGoogleId).mockResolvedValueOnce(mockUser);

    const result = await useCase.execute({ idToken: "valid-token" });

    expect(mockUserRepository.findByGoogleId).toHaveBeenCalledWith("google-12345");
    expect(mockTokenService.generateToken).toHaveBeenCalledWith({
      userId: mockUser.id,
      email: mockUser.email,
    });
    expect(result).toEqual({
      user: mockUser,
      token: "jwt-token-123",
    });
  });

  it("should link googleId to existing user with matching email and return token", async () => {
    vi.mocked(mockUserRepository.findByGoogleId).mockResolvedValueOnce(null);
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce({
      ...mockUser,
      googleId: null,
    });
    vi.mocked(mockUserRepository.linkGoogleId).mockResolvedValueOnce(mockUser);

    const result = await useCase.execute({ idToken: "valid-token" });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("user@example.com");
    expect(mockUserRepository.linkGoogleId).toHaveBeenCalledWith("user-1", "google-12345");
    expect(result.token).toBe("jwt-token-123");
  });

  it("should create a new OAuth user if user does not exist", async () => {
    vi.mocked(mockUserRepository.findByGoogleId).mockResolvedValueOnce(null);
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null);
    vi.mocked(mockUserRepository.createOAuthUser).mockResolvedValueOnce(mockUser);

    const result = await useCase.execute({ idToken: "valid-token" });

    expect(mockUserRepository.createOAuthUser).toHaveBeenCalledWith({
      email: "user@example.com",
      name: "John Doe",
      googleId: "google-12345",
    });
    expect(result.user).toEqual(mockUser);
    expect(result.token).toBe("jwt-token-123");
  });
});
