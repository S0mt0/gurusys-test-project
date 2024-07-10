import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../lib/hooks";
import { Label, Switch } from "../utils";
import { cn } from "../../lib/utils";

export const ToggleTheme = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  const handleThemeSelection = () => {
    if (theme === "light") setTheme("dark");
    if (theme === "dark") setTheme("light");
  };

  return (
    <div className={cn("flex items-center w-fit space-x-2", className)}>
      <Label htmlFor="ui-theme">
        {theme === "light" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Label>
      <Switch id="ui-theme" onClick={handleThemeSelection} />
    </div>
  );
};
