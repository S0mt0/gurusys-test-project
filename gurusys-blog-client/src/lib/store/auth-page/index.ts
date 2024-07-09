import { create } from "zustand";

export const authPageStore = create<PageStore>()((set) => ({
  activePage: (localStorage.getItem("auth_page") as AuthPages) || "logIn",

  setActivePage: (activePage) =>
    set(() => {
      localStorage.setItem("auth_page", activePage);
      return { activePage };
    }),

  resetPage: () => set(() => ({ activePage: "logIn" })),
}));
