import { Request as ExpressRequest } from "express";
import { Document, HydratedDocument, Model, Types } from "mongoose";

declare global {
  interface CustomRequest extends ExpressRequest {
    session: {
      id: Types.ObjectId;
      user: Document<unknown, {}, IUser> &
        Omit<
          IUser & {
            _id: Types.ObjectId;
          },
          keyof IUserMethods
        > &
        IUserMethods;
    };

    files: { avatar?: Avatar; [key: string]: any };
  }

  interface Avatar {
    filename?: string;
    fieldName?: string;
    originalFilename?: string;
    path: string;
    headers?: {
      "content-disposition": string;
      "content-type": "image/jpeg" | "image/jpg" | "image/gif" | "image/png";
    };
    size?: number;
    name?: string;
    type: "image/jpeg" | "image/jpg" | "image/gif" | "image/png";
    bytes?: number;

    [key: string]: any;
  }

  type ErrorData = Record<string, any>;

  type Minutes =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48
    | 49
    | 50
    | 51
    | 52
    | 53
    | 54
    | 55
    | 56
    | 57
    | 58
    | 59;

  type Hours =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24;

  type Days = 1 | 2 | 3 | 4 | 5 | 6 | 7;

  type TimeInMilliseconds<T extends string | number | symbol> = {
    [key in T]: number;
  };

  type CustomGenericDocument<T> = Document<unknown, {}, T> &
    T & {
      _id: Types.ObjectId;
    };

  type MailContext = {
    fullname?: string;
    username?: string;
    email?: string;
    code?: string;
    expiresIn?: number | string;
    extLink?: string;
    otherLinks?: string;
    date?: string;
    baseUrl?: string;

    [key: string]: any;
  };

  interface MailOptionsV2 {
    to: string;
    subject: string;
    template: string;
    context: MailContext;
    from?: string;
    text?: string;
    attachments?: any;
  }

  interface IUser {
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
  interface IUserMethods {
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
  interface IUserModel extends Model<IUser, {}, IUserMethods> {
    /** Finds a user by their email */
    findByEmail(email: string): Promise<HydratedDocument<IUser, IUserMethods>>;

    /** Finds a user by their email */
    findBySession(
      refresh_token: string
    ): Promise<HydratedDocument<IUser, IUserMethods>>;
  }

  interface UserDoc extends Document<{}, {}, IUser> {}

  // blog schema
  interface IBlog {
    blog_id: string;
    title: string;
    banner: string;
    description: string;
    content: any[];
    tags: string[];
    author: Types.ObjectId;

    activity: {
      total_comments: number;
      total_likes: number;
      total_reads: number;
      total_parent_comments: number;
    };

    comments: CommentDoc[];

    draft: boolean;
    published: boolean;
  }

  interface BlogDoc extends Document<IBlog> {}

  // comments schema
  interface IComment {
    blog_id: Types.ObjectId;
    blog_author: Types.ObjectId;
    comment: string;
    children: CommentDoc[];
    commented_by: Types.ObjectId;
    parent: Types.ObjectId;
    isReply: boolean;
  }

  interface CommentDoc extends Document<IComment> {}
}

export {};
