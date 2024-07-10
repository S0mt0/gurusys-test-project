import { USER_ENDPOINTS } from "../../constants";
import { axiosPrivate } from "../axios";

// User Queries
export const logout = async () => {
  return await axiosPrivate.post(USER_ENDPOINTS.logout);
};

export const getProfile = async () => {
  return (
    await axiosPrivate.get<ApiResponse<ProfileData>>(USER_ENDPOINTS.profile)
  ).data;
};

export const refreshToken = async () => {
  return await axiosPrivate.get<ApiResponse<ProfileData> | undefined>(
    USER_ENDPOINTS.refresh
  );
};
