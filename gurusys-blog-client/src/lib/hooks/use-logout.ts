import { toast } from "react-hot-toast";

import { logout } from "../api";
import { useAuthStore } from ".";

export const useLogout = () => {
  const { endSession } = useAuthStore();

  const signOut = () => {
    logout()
      .then(() => endSession())
      .catch(() => toast.error("Network error, please try again."));
  };

  return signOut;
};
