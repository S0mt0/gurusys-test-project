import { useEffect } from "react";

import { axiosPrivate } from "../api";
import { useAuthStore, useRefreshToken } from ".";

export const useAxiosPrivate = () => {
  const { accessToken } = useAuthStore();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const token = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${token}`;

          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      /** Remove interceptors to avoid memory leaks and unwanted app behaviours*/
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refresh]);

  return axiosPrivate;
};
