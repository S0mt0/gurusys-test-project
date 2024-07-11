import { Bell, SearchIcon, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";

import { Button, Input, Logo } from "../utils";
import { ProfileAvatar } from "./profile-avatar";
import { ToggleTheme } from "./toggle-theme";
import { useAuthStore } from "../../lib/hooks";

export const NavBar = () => {
  const { accessToken } = useAuthStore();

  return (
    <nav className="px-8 py-4 flex justify-between gap-6 items-center border-b">
      <div className="flex gap-12 items-center">
        <Logo />

        <div className="relative bg-muted rounded-full w-[200px] hidden sm:block">
          <SearchIcon className="input-icon h-5 w-5 pointer-events-none" />
          <Input
            className="rounded-full w-full pl-10 text-lg pr-4 py-5 dark:focus-within:ring-slate-600"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex gap-4 items-center w-fit">
        <ToggleTheme />
        <Button
          asChild
          variant={"ghost"}
          className="items-center space-x-2 cursor-pointer hidden sm:flex"
        >
          <Link to="/new-story" className="inline-flex items-center gap-2">
            <SquarePen
              strokeWidth={1.2}
              className="w-6 h-6 text-foreground/75 hover:text-foreground"
            />
            Write
          </Link>
        </Button>
        <Button
          variant={"ghost"}
          className="inline-flex sm:hidden cursor-pointer"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
        {accessToken && (
          <Bell
            className="h-6 w-6 m-0 text-foreground/75 hover:text-foreground"
            strokeWidth={1.2}
          />
        )}
        <ProfileAvatar />
      </div>
    </nav>
  );
};
