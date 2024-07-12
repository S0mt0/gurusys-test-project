import { logout } from "../api";
import { useAuthStore } from ".";

export const useLogout = () => {
  const { endSession } = useAuthStore();

  const signOut = () => {
    logout().finally(() => endSession());
  };

  return signOut;
};
