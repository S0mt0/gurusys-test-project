import { AUTH_END_POINTS } from "../../constants";
import { axiosPrivate, axiosWithToken } from "../axios";

// Authentication Queries
export const signup = async (data: SignUp) => {
  return await axiosPrivate.post<ApiResponse<null>>(
    AUTH_END_POINTS.signup,
    data
  );
};

export const login = async (data: Login) => {
  return await axiosPrivate.post<ApiResponse<ProfileData>>(
    AUTH_END_POINTS.login,
    data
  );
};

export const forgotPassword = async (data: EmailPayload) => {
  return await axiosWithToken.post<ApiResponse<null>>(
    AUTH_END_POINTS.forgot_password,
    data
  );
};

export const resendPasswordResetToken = async () => {
  return await axiosWithToken.get<ApiResponse<null>>(
    AUTH_END_POINTS.resend_password_reset_code
  );
};

export const verifyPasswordResetToken = async (data: VerifyResetPayload) => {
  return await axiosWithToken.post<ApiResponse<null>>(
    AUTH_END_POINTS.verify_password_reset_code,
    data
  );
};

export const resetPassword = async (data: ResetPasswordPayload) => {
  return await axiosWithToken.post<ApiResponse<null>>(
    AUTH_END_POINTS.reset_password,
    data
  );
};
