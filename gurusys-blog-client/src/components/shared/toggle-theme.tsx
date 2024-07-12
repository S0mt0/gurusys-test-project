import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../lib/hooks";
import { Button } from "../utils";
import { cn } from "../../lib/utils";

export const ToggleTheme = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  const handleThemeSelection = () => {
    if (theme === "light") setTheme("dark");
    if (theme === "dark") setTheme("light");
  };

  return (
    <div className={cn("flex items-center w-fit space-x-2", className)}>
      <Button
        onClick={handleThemeSelection}
        size={"icon"}
        variant={"ghost"}
        className="rounded-full hover:bg-transparent"
      >
        {theme === "light" ? (
          <Sun className="h-6 w-6 hover:opacity-70" />
        ) : (
          <Moon className="h-6 w-6 hover:opacity-70" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};
