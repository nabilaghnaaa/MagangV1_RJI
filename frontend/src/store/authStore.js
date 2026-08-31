import { create } from "zustand";
import authService from "../services/authService";

const STORAGE_KEYS = {
  token: "rji_token",
  user: "rji_user",
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Gagal membaca user dari localStorage:", error);
    localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
};

const getStoredToken = () => {
  return localStorage.getItem(STORAGE_KEYS.token);
};

const saveSession = (token, user) => {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
};

const useAuthStore = create((set, get) => ({
  token: getStoredToken(),
  user: getStoredUser(),
  isAuthenticated: Boolean(getStoredToken()),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await authService.login(
        email,
        password
      );

      const { token, user } = response.data;

      saveSession(token, user);

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return {
        success: true,
        token,
        user,
      };
    } catch (error) {
      set({
        isLoading: false,
      });

      throw new Error(
        error.response?.data?.message ||
          "Login gagal. Silakan coba lagi."
      );
    }
  },

  restoreSession: async () => {
    const token = getStoredToken();

    if (!token) {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return false;
    }

    set({
      isLoading: true,
    });

    try {
      const response =
        await authService.getCurrentUser();

      const user = response.data;

      localStorage.setItem(
        STORAGE_KEYS.user,
        JSON.stringify(user)
      );

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      clearSession();

      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return false;
    }
  },

  logout: () => {
    clearSession();

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  hasRole: (roleName) => {
    const user = get().user;

    return user?.role?.name === roleName;
  },

  hasPermission: (permissionName) => {
    const user = get().user;

    const permissions = user?.permissions || [];

    return permissions.includes(permissionName);
  },

  hasAnyPermission: (permissionNames = []) => {
    const user = get().user;

    const permissions = user?.permissions || [];

    return permissionNames.some((permission) =>
      permissions.includes(permission)
    );
  },

  hasAllPermissions: (permissionNames = []) => {
    const user = get().user;

    const permissions = user?.permissions || [];

    return permissionNames.every((permission) =>
      permissions.includes(permission)
    );
  },
}));

export default useAuthStore;