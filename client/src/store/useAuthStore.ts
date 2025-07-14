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
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  email: null,

  setToken: (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      set({ accessToken: token, email: decoded.email });
    } catch (error: any) {
      console.error("Error decoding token: ", error.message);
    }
  },

  clearAuth: () => {
    set({ accessToken: null, email: null });
  },
}));
