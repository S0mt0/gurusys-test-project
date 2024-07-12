import { isEmail } from "validator";

import {
  deleteImageFromCloudinary,
  reject,
  uploadImageToCloudinary,
} from "../lib/utils";

import { sendError } from "../lib/errors";

import { Users } from "../models";
import { CustomRequest } from "@/interface";

/** User service class. */
export class UserService {
  public db = "users";

  /** Creates and returns a new user document */
  public async createAccount(data: any) {
    // step 1: check for duplicate account
    const emailExists = await Users.findByEmail(data.email);
    const usernameExists = await Users.findByUsername(data.username);

    if (emailExists)
      sendError.duplicateRequestError(
        "Email already in use. Please log in, or try again."
      );

    if (usernameExists)
      sendError.duplicateRequestError("Username taken. Try again.");

    // step 2: create a new user
    const user = await Users.create({
      personal_info: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }

  /**
   * @note Authentication is the process of *verifying* the **identity** of the client making a request to the server. This `function` therefore is for validating the provided `data` against the database.
   * @param data *{ login, password }*
   * @returns User Document
   */
  public async authenticate({
    password,
    login,
  }: {
    login: string;
    password: string;
    google_auth?: boolean;
  }) {
    let query: Record<string, any> = {};
    let message = "Invalid credentials";

    if (isEmail(login)) {
      query.personal_info.email = login;
      message = "Invalid email or password";
    } else {
      query.personal_info.username = login;
      message = "Invalid username or password";
    }

    const user = await Users.findOne(query);
    if (!user) reject(message);

    const passwordIsValid = await user.verifyPassword(password);

    if (!passwordIsValid) reject(message);

    return user;
  }

  /** Finds a user by their email address and returns a 404 error if user was not found */
  public async findByEmail(email: string) {
    const user = await Users.findByEmail(email);

    if (!user)
      sendError.notfoundError(
        "Sorry, we did not find this user in our records."
      );

    return user;
  }

  /** Finds a user by their username and returns a 404 error if user was not found */
  public async findByUsername(username: string) {
    const user = await Users.findByUsername(username);

    if (!user)
      sendError.notfoundError(
        "Sorry, we did not find this user in our records."
      );

    return user;
  }

  /** Finds a user by their refresh token */
  public async findBySession(refresh_token: string) {
    return await Users.findBySession(refresh_token);
  }

  /** Finds by Id and deletes a user document from the database*/
  public async deleteUser(_id: string) {
    return await Users.findOneAndDelete({ _id });
  }

  /** Updates user avatar */
  public async updateAvatar(req: CustomRequest) {
    const file = req.files;
    const user = req.session.user;

    const oldAvatarUrl = user.personal_info.avatarUrl;
    let avatarUrl = user.personal_info.avatarUrl;

    if (
      file &&
      file?.avatar &&
      Object.keys(file.avatar).length &&
      Object.values(file.avatar).length
    ) {
      avatarUrl = await uploadImageToCloudinary(file.avatar);

      // Delete user's old profile avatar after successful profile update and image upload to save cloud storage
      if (avatarUrl !== oldAvatarUrl)
        await deleteImageFromCloudinary(oldAvatarUrl);
    }

    return avatarUrl;
  }

  /** Verifies code for request to reset forgotten password
   * @returns access token
   */
  public async verifyPasswordResetCode(data: any) {
    const user = await this.findByEmail(data.email);

    if (data.password_reset_code !== data.code)
      sendError.badRequestError("Oops! That code was not a match, try again.");

    if (Date.now() > data.expiresAt)
      sendError.badRequestError("Sorry, that code expired. Try again.");

    return user.createAccessToken();
  }

  /** Updates user's forgotten password
   * @returns User Document */
  public resetPassword = async (data: any) => {
    const user = await Users.findById(data.userId);

    if (!user)
      sendError.notfoundError(
        "Sorry, we did not find this user in our records"
      );

    user.personal_info.password = data.new_password;
    await user.save();

    return user;
  };
}

/**
 * Instance of the UserService class used to handle user-related database queries
 * @instance {UserService} */
export const userService = new UserService();
