import { Request as ExpressRequest } from "express";
import { Document, Types } from "mongoose";
import { IUser, IUserMethods } from "./users";

export interface CustomRequest extends ExpressRequest {
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

export interface Avatar {
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

export type ErrorData = Record<string, any>;

export type Minutes =
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

export type Hours =
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

export type Days = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TimeInMilliseconds<T extends string | number | symbol> = {
  [key in T]: number;
};

export type CustomGenericDocument<T> = Document<unknown, {}, T> &
  T & {
    _id: Types.ObjectId;
  };

export type MailContext = {
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

export interface MailOptions {
  to: string;
  subject: string;
  template: string;
  context: MailContext;
  from?: string;
  text?: string;
  attachments?: any;
}

export type OAuthProviders =
  | "github.com"
  | "google.com"
  | "twitter.com"
  | "email";
