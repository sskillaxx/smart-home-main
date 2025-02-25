import { create } from "zustand";
import { AuthState, LoginFormData, RegisterFormData } from "../types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (data: LoginFormData) => {
    // TODO: Implement actual API call
    set({
      isAuthenticated: true,
      user: {
        id: "1",
        email: data.email,
        firstName: "John",
        lastName: "Doe",
        houseName: "My Smart House",
      },
    });
  },
  register: async (data: RegisterFormData) => {
    // TODO: Implement actual API call
    set({
      isAuthenticated: true,
      user: {
        id: "1",
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        houseName: data.houseName,
      },
    });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
