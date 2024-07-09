type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

type AuthPages =
  | "logIn"
  | "signUp"
  | "forgotPassword"
  | "resetPassword"
  | "verifyPasswordOtp";

type FormMessageProp = {
  message: string;
};
