import { useShallow } from "zustand/react/shallow";

import { authPageStore, authStore, profileStore } from "../store";

export const useAuthStore = () => {
  return authStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      trusted_device: state.trusted_device,
      isLoggedIn: state.isLoggedIn,
      persistLogin: state.setTrustDevice,
      toggleIsTrustedDevice: state.toggleIsTrustedDevice,
      setAuth: state.setAuthToken,
      setIsLoggedIn: state.setIsLoggedIn,
      endSession: state.endSession,
    }))
  );
};

export const useProfileStore = () => {
  return profileStore(
    useShallow((state) => ({
      profile: state.profile,
      setProfile: state.setProfile,
      getInitials: state.getInitials,
    }))
  );
};

export const useAuthPageStore = () => {
  return authPageStore(
    useShallow((state) => ({
      activePage: state.activePage,
      togglePages: state.setActivePage,
      resetPage: state.resetPage,
    }))
  );
};
