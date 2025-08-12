import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  email: string | null;
  isAuthOpen: boolean;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setToken: (token: string) => void;

  setIsAuthOpen: (auth: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  email: null,

  isAuthOpen: false,

  isLoading: true,

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setToken: (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      set({ accessToken: token, userId: decoded.userId, email: decoded.email });
    } catch (error: any) {
      console.error("Error decoding token: ", error.message);
    }
  },

  setIsAuthOpen: (auth: boolean) => {
    set({ isAuthOpen: auth });
  },

  logout: () => {
    set({ accessToken: null, userId: null, email: null });
  },
}));
