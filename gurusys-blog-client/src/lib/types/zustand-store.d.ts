interface AuthStore {
  accessToken: string | null;
  trusted_device: boolean;
  isLoggedIn: boolean;

  setAuthToken(accessToken: string | null): void;
  setTrustDevice(trusted_device: boolean): void;
  setIsLoggedIn(isLoggedIn: boolean): void;
  toggleIsTrustedDevice(): void;
  endSession(): void;
}

interface ProfileStore {
  profile: UserProfile | null;

  setProfile(profile: UserProfile | null): void;
  getInitials(): string;
}

interface PageStore {
  activePage: AuthPages;
  setActivePage(activePage: AuthPages): void;
  resetPage(): void;
}
