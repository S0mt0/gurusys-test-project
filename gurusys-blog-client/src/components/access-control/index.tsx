import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";

import { useAuthStore, useRefreshToken } from "../../lib/hooks";
import { useLayoutEffect, useState } from "react";

export const RequireAuth = () => {
  const { accessToken } = useAuthStore();
  const location = useLocation();

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { accessToken, trusted_device, isLoggedIn } = useAuthStore();
  const refresh = useRefreshToken();

  // To prevent screen flickering, `useLayoutEffect` is used instead of `useEffect`
  useLayoutEffect(() => {
    const refreshAccess = async () => {
      await refresh();
      setIsLoading(false);
    };

    !accessToken && isLoggedIn ? refreshAccess() : setIsLoading(false);
  }, [refresh, accessToken, isLoggedIn]);

  return (
    <>
      {!trusted_device ? (
        <Outlet />
      ) : isLoading ? (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-neutral-100">
          <Loader className="animate-spin w-8 h-8 text-orange-600" />
          <span className="text-sm text-red-400">Please wait...</span>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};
