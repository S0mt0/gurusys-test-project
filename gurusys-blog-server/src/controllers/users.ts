import { Response } from "express";
import { StatusCodes as status } from "http-status-codes";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

import { userService } from "../services";
import {
  formatUserToSend,
  obscureEmail,
  selectivelyUpdateUserProfile,
  verifyAuthorization,
} from "../lib/utils";

import { TIME_IN } from "../lib/constants";
import { sendError } from "../lib/errors";
import { CustomRequest, OAuthProviders } from "@/interface";

import serviceAccount from "../../fpk.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const signUp = async (req: CustomRequest, res: Response) => {
  const user = await userService.createAccount(req.body);

  const accessToken = user.createAccessToken();

  const refreshTokenExpiresIn = TIME_IN.days[3];
  const refresh_token = user.createAccessToken(refreshTokenExpiresIn);

  user.refresh_token = refresh_token;
  await user.save();

  res.cookie("refresh_token", refresh_token, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenExpiresIn,
  });

  res.setHeader("Authorization", accessToken);
  return res
    .status(status.CREATED)
    .json({ success: true, message: "Welcome onboard!👋", data: { user } });
};
export const authenticateWithOAuth = async (
  req: CustomRequest,
  res: Response
) => {
  const { access_token } = req.body;

  const {
    email,
    firebase: { sign_in_provider },
  } = await getAuth().verifyIdToken(access_token);

  const user = await userService.authenticateWithOAuth(
    email,
    sign_in_provider as OAuthProviders
  );

  const accessToken = user.createAccessToken();
  const refreshTokenExpiresIn = TIME_IN.days[3];
  const refresh_token = user.createAccessToken(refreshTokenExpiresIn);

  user.refresh_token = refresh_token;
  await user.save();

  res.cookie("refresh_token", refresh_token, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenExpiresIn,
  });

  res.setHeader("Authorization", accessToken);
  return res.status(status.CREATED).json({
    success: true,
    message: "Welcome onboard!👋",
    data: { user: formatUserToSend(user) },
  });
};

export const logIn = async (req: CustomRequest, res: Response) => {
  const user = await userService.authenticate(req.body);
  const accessToken = user.createAccessToken();

  const refreshTokenExpiresIn = TIME_IN.days[3];
  const refresh_token = user.createAccessToken(refreshTokenExpiresIn);

  user.refresh_token = refresh_token;
  await user.save();

  res.cookie("refresh_token", refresh_token, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenExpiresIn,
  });

  res.setHeader("Authorization", accessToken);
  return res
    .status(status.CREATED)
    .json({ success: true, message: "Login successful", data: { user } });
};

export const logout = async (req: CustomRequest, res: Response) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return res.sendStatus(status.NO_CONTENT);
  }

  // Is refresh_token in db?
  const session = await userService.findBySession(refresh_token);

  if (!session) {
    // If no valid session was found, clear cookies for whatever session is active
    res.clearCookie("refresh_token");
    return res.sendStatus(status.NO_CONTENT);
  }

  session.refresh_token = "";
  await session.save();

  res.clearCookie("refresh_token", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  return res.sendStatus(status.NO_CONTENT);
};

export const refreshToken = async (req: CustomRequest, res: Response) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token)
    sendError.unauthorizationError(
      "Hey champ! Your session expired, please login again."
    );

  const session = await userService.findBySession(refresh_token);

  if (!session)
    sendError.unauthorizationError(
      "Hey champ! Your session expired, please login again."
    );

  const accessToken = session.createAccessToken();

  res.setHeader("Authorization", accessToken);
  return res.status(status.OK).json({ success: true, data: { user: session } });
};

export const updatePassword = async (req: CustomRequest, res: Response) => {
  const data = req.body;
  const user = req.session.user;

  const oldPasswordIsValid = await user.verifyPassword(data.old_password);

  if (!oldPasswordIsValid)
    sendError.badRequestError("Current password is incorrect");

  user.personal_info.password = data.new_password;
  await user.save();

  return res
    .status(status.OK)
    .json({ success: true, message: "Password updated successfully" });
};

export const updateProfilePicture = async (
  req: CustomRequest,
  res: Response
) => {
  const url = await userService.updateAvatar(req);

  return res
    .status(status.OK)
    .json({ success: true, message: "Uploaded🎊", data: { url } });
};

export const getProfile = async (req: CustomRequest, res: Response) => {
  return res
    .status(status.OK)
    .json({ success: true, data: { user: req.session.user } });
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
  const user = req.session.user;
  const updated_profile = await selectivelyUpdateUserProfile(user, req.body);

  return res.status(status.OK).json({
    success: true,
    message: "Profile updated successfully",
    data: { user: updated_profile },
  });
};

export const deleteAccount = async (req: CustomRequest, res: Response) => {
  const deletedUser = await userService.deleteUser(
    req.session.id as unknown as string
  );

  if (!deletedUser)
    sendError.notfoundError("Unable to delete account, try again later.");

  return res.status(status.OK).json({
    success: true,
    message: "We hate to see you go👋😔",
  });
};

export const forgotPassword = async (req: CustomRequest, res: Response) => {
  const { email } = req.body;
  const user = await userService.findByEmail(email);

  const { token, code, expiresAt } = user.createResetPasswordToken();
  // todo: notify user via mail

  res.setHeader("Authorization", token);
  return res.status(status.OK).json({
    success: true,
    message: `A code has been sent to ${obscureEmail(user.personal_info.email)}`,
  });
};

export const resendPasswordResetCode = async (
  req: CustomRequest,
  res: Response
) => {
  const { data, error } = verifyAuthorization(req);
  if (error) sendError.unauthorizationError(error);

  if (!data.email) sendError.unauthorizationError();
  const user = await userService.findByEmail(data.email);

  const { token, code, expiresAt } = user.createResetPasswordToken();
  // todo: notify user via mail

  res.setHeader("Authorization", token);
  return res.status(status.OK).json({
    success: true,
    message: `A code has been sent to ${obscureEmail(user.personal_info.email)}`,
  });
};

export const verifyPasswordResetCode = async (
  req: CustomRequest,
  res: Response
) => {
  const { data, error } = verifyAuthorization(req);
  if (error) sendError.unauthorizationError(error);

  const token = await userService.verifyPasswordResetCode({
    ...data,
    ...req.body,
  });

  res.setHeader("Authorization", token);
  return res.status(status.OK).json({
    success: true,
    message: "You rock! Now, let's create you a new password💪",
  });
};

export const resetForgottenPassword = async (
  req: CustomRequest,
  res: Response
) => {
  const { data, error } = verifyAuthorization(req);
  if (error) sendError.unauthorizationError(error);

  if (!data.userId) sendError.unauthorizationError();

  const user = await userService.resetPassword({ ...data, ...req.body });
  const accessToken = user.createAccessToken();

  const refreshTokenExpiresIn = TIME_IN.days[3];
  const refresh_token = user.createAccessToken(refreshTokenExpiresIn);

  user.refresh_token = refresh_token;
  await user.save();

  res.cookie("refresh_token", refresh_token, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenExpiresIn,
  });

  // todo: notify user via mail about their password reset
  res.setHeader("Authorization", accessToken);
  return res.status(status.OK).json({
    success: true,
    message: "Let's go🚀",
  });
};
