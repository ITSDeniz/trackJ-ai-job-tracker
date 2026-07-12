import {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";
import { apiClient } from "@/lib/api/apiClient";

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, passwordPlain: string) => Promise<void>;
  register: (
    email: string,
    passwordPlain: string,
    name?: string,
  ) => Promise<void>;
  updateProfile: (data: {
    email?: string;
    name?: string | null;
    password?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("tj_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiClient.get<{ user: User }>("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("tj_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, passwordPlain: string) => {
    const data = await apiClient.post<{ user: User; token: string }>(
      "/auth/login",
      {
        email,
        password: passwordPlain,
      },
    );
    localStorage.setItem("tj_token", data.token);
    setUser(data.user);
  };

  const register = async (
    email: string,
    passwordPlain: string,
    name?: string,
  ) => {
    await apiClient.post<{ user: User }>("/auth/register", {
      email,
      password: passwordPlain,
      name,
    });
    // For registration, auto-login the user by logging them in:
    await login(email, passwordPlain);
  };

  const updateProfile = async (data: {
    email?: string;
    name?: string | null;
    password?: string;
  }) => {
    const res = await apiClient.patch<{ user: User }>("/auth/profile", data);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("tj_token");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
