import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { NavBar } from "./nav-bar";

export const AppLayout = () => {
  return (
    <main className="bg-slate-50 dark:bg-[#0b1939] min-h-screen font-gelasio dark:text-white">
      <Toaster position="top-center" />
      <NavBar />
      <Outlet />
    </main>
  );
};

export default AppLayout;
