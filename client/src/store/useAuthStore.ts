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
  email: string | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  email: null,
  isLoading: true,

  setToken: (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      set({ accessToken: token, email: decoded.email });
    } catch (error: any) {
      console.error("Error decoding token: ", error.message);
    }
  },

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  logout: () => {
    set({ accessToken: null, email: null });
  },
}));
