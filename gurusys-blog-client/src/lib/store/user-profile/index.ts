import { create } from "zustand";

export const profileStore = create<ProfileStore>()((set, get) => ({
  profile: null,

  setProfile: (profile) => set(() => ({ profile })),

  getInitials: () => {
    const profile = get().profile?.personal_info;

    const fullname = profile?.fullname ?? "";
    const [first_name, last_name] = fullname.split(" ");

    const firstInitial = first_name ? first_name.charAt(0).toUpperCase() : "";
    const lastInitial = last_name ? last_name.charAt(0).toUpperCase() : "";

    const initials = lastInitial
      ? `${firstInitial}${lastInitial}`
      : firstInitial;

    if (initials) return initials;

    const username = profile?.username
      ? profile.username.charAt(0).toUpperCase()
      : "A";

    return username;
  },
}));
