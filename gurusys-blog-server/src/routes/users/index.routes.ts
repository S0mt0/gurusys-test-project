import { Router } from "express";

import { authenticate, validatePayload } from "../../lib/middlewares";
import * as _ from "./validation-schema";
import * as controller from "../../controllers/users";

export default (router: Router) => {
  //==========================/ START OF AUTHENTICATION ROUTES /==========================/
  // sign-up
  router.post(
    "/auth/sign-up",
    validatePayload(_.SignUpDataSchema),
    controller.signUp
  );

  // login
  router.post("/auth/login", validatePayload(_.LoginSchema), controller.logIn);

  // forgot password
  router.post(
    "/auth/forgot-password",
    validatePayload(_.EmailSchema),
    controller.forgotPassword
  );

  // verify password-reset code
  router.post(
    "/auth/verify-password-reset-code",
    validatePayload(_.PasswordResetCodeSchema),
    controller.verifyPasswordResetCode
  );

  // resend password-reset code
  router.get("/auth/password/resend-code", controller.resendPasswordResetCode);

  // password-reset
  router.put(
    "/auth/reset-password",
    validatePayload(_.CreateNewPasswordSchema),
    controller.resetForgottenPassword
  );

  //==========================/ END OF AUTHENTICATION ROUTES AND START OF USER ROUTES /==========================/
  // Log out route
  router.post("/u/sign-out", controller.logout);

  // refresh token route
  router.get("/u/refresh-token", controller.refreshToken);

  // profile
  router
    .route("/u/profile")
    .get(authenticate, controller.getProfile)
    .patch(
      authenticate,
      validatePayload(_.ProfileUpdateDataSchema),
      controller.updateProfile
    )
    .delete(authenticate, controller.deleteAccount);

  // Update Password
  router.patch(
    "/u/update-password",
    authenticate,
    validatePayload(_.UpdatePasswordSchema),
    controller.updatePassword
  );

  router.patch(
    "/u/avatar",
    authenticate,
    validatePayload(null, _.ProfileAvatarSchema),
    controller.updateProfilePicture
  );
};
