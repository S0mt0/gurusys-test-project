import { create } from "zustand";

export const authStore = create<AuthStore>()((set) => ({
  accessToken: null,
  trusted_device: lsgParse("trusted_device") || false,
  isLoggedIn: lsgParse("isLoggedIn") || false,

  setAuthToken: (accessToken) => set(() => ({ accessToken })),

  setTrustDevice: (trusted_device) =>
    set(() => {
      lsJson("trusted_device", trusted_device);
      return { trusted_device };
    }),

  toggleIsTrustedDevice: () =>
    set((state) => {
      lsJson("trusted_device", !state.trusted_device);
      return { trusted_device: !state.trusted_device };
    }),

  setIsLoggedIn: (isLoggedIn) =>
    set(() => {
      lsJson("isLoggedIn", isLoggedIn);
      return { isLoggedIn };
    }),

  endSession: () => {
    lsJson("isLoggedIn", false);
    set(() => ({
      trusted_device: false,
      isLoggedIn: false,
      accessToken: null,
    }));
  },
}));
