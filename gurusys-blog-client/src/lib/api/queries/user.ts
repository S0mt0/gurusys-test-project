import { axiosPrivate, userEndPoints } from "../axios";

// User Queries
export const logout = async () => {
  return await axiosPrivate.post(userEndPoints.logout);
};

export const getProfile = async () => {
  return (
    await axiosPrivate.get<ApiResponse<ProfileData>>(userEndPoints.profile)
  ).data;
};

export const refreshToken = async () => {
  return await axiosPrivate.get<ApiResponse<ProfileData> | undefined>(
    userEndPoints.refresh
  );
};
