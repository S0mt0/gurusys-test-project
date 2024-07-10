/** Server endpoints for authenticaion requests */
export const AUTH_ENDPOINTS = {
  /** `POST` : Sign up route
   * @payload: `SignUp` */
  signup: "/auth/sign-up",

  /** `POST` : Login route
   * @payload: `Login` */
  login: "/auth/login",

  /** `POST` : Forgot password route
   * @payload: `EmailPayload` */
  forgot_password: "/auth/forgot-password",

  /** `PUT` : Reset password route
   * @payload: `ResetPasswordPayload`*/
  reset_password: "/auth/reset-password",

  /** `POST` : Verify reset passwor code route
   * @payload: `VerifyResetPayload` */
  verify_password_reset_code: "/auth/verify-password-reset-code",

  /** `GET` : Resend reset password code route*/
  resend_password_reset_code: "/auth/password/resend-code",
};

export const USER_ENDPOINTS = {
  /** `GET` : Profile lookup route */
  profile: "/u/profile",

  /** `PATCH` : Update profile route
   * @payload: `Partial<UserProfile>` */
  update_profile: "/u/profile",

  /** `DELETE` : Update profile route */
  delete_account: "/u/profile",

  /** `PATCH` : Update avatar
   * @payload: `formData` */
  update_avatar: "/u/avatar",

  /** `POST` : Logout route */
  logout: "/u/sign-out",

  /** `GET` : Refresh token route */
  refresh: "/u/refresh-token",

  /** `PATCH` : Update password route
   * @payload: `NewPasswordPayload` */
  update_password: "/u/update-password",
};
