import { Document, HydratedDocument, Model } from "mongoose";
import { BlogDoc } from "./blogs";

export interface IUser {
  personal_info: {
    avatarUrl: string;
    email: string;
    username: string;
    bio: string;
    password?: string;
    fullname?: string;
  };

  social_links: {
    youtube: string;
    instagram: string;
    facebook: string;
    twitter: string;
    github: string;
    website: string;
  };

  account_info: {
    total_posts: number;
    total_reads: number;
  };

  google_auth: boolean;

  blogs: BlogDoc[];
  refresh_token: string;
}

/** Interface describing custom methods associated with the `User` model */
export interface IUserMethods {
  /** Verifies the provided password by comparing it with the password of the user. */
  verifyPassword: (candidatePassword: string) => Promise<boolean>;

  /** Creates and returns a `jwt` access token */
  createAccessToken: (expiresAt?: number | undefined) => string;

  /** Creates and returns a `jwt` token encoded with the `email`, `code`, and `expiresAt` properties that will be sent when there's a request to reset a forgotten password.
   * @param maxLength The maximum length of the code generated. Defaults to 6
   * @param expiresAt The lifespan of the code generated in milliseconds. Defaults to  15 minutes. */
  createResetPasswordToken: (
    maxLength?: number,
    expiresAt?: number
  ) => {
    code: string;
    expiresAt: number;
    token: string;
    email: string;
  };
}

/** Interface describing the `User` model
 * @description Defines custom `static` methods on `User` model
 */
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  /** Finds a user by their email */
  findByEmail(email: string): Promise<HydratedDocument<IUser, IUserMethods>>;

  /** Finds a user by username */
  findByUsername(
    username: string
  ): Promise<HydratedDocument<IUser, IUserMethods>>;

  /** Finds a user using the `refresh_token` */
  findBySession(
    refresh_token: string
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}

export interface UserDoc extends Document<{}, {}, IUser> {}
