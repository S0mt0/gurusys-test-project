import { modelNames, isObjectIdOrHexString } from "mongoose";
import jwt from "jsonwebtoken";
import { Request } from "express";
import ShortUniqueId from "short-unique-id";

import { sendError } from "../../lib/errors";
import { cloudinary, envs } from "../../config";
import { UPLOAD_PRESET } from "../constants";
import {
  Avatar,
  CustomGenericDocument,
  Days,
  Hours,
  IUser,
  Minutes,
  TimeInMilliseconds,
} from "@/interface";

/**
 * Used to generate random positive integers of length, 6 by default, otherwise the passed in length
 * @param length */
export const getRandomNumbers = (length: number = 6) => {
  const { randomUUID } = new ShortUniqueId({
    length,
    dictionary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  });

  return randomUUID();
};

/**
 * Transforms the return mongodb document by removing specified schema properties
 * @param schemaProps - array of schema properties
 * @returns Transform function of a mongodb schema
 */
export const removeSchemaProps = (schemaProps?: string[]) => {
  return (doc: any, ret: Record<string, any>) => {
    if (schemaProps && schemaProps.length) {
      schemaProps.forEach((prop) => {
        if (prop.includes(".")) {
          const [parent, child] = prop.split(".");
          if (ret[parent]) delete ret[parent][child];
        }

        delete ret[prop];
      });
    }

    delete ret.id;
    delete ret.__v;

    return ret;
  };
};

/**
 * @param schemaProps - array of optional schema properties that should be removed when converting a mongo document to plain javascript object or when toJSON is called
 * @returns toObject/toJSON document options
 */
export const transformSchema = (schemaProps?: string[]) => {
  return {
    virtuals: true,
    versionKey: false,
    transform: removeSchemaProps(schemaProps),
  };
};

/**
 * Verifies a jwt token and returns the decoded data if verified, or an error message if token fails verification
 * @param token
 * @param secret
 * @returns decoded `data` OR `error message`
 */
export const verifyJwtToken = (
  token: string,
  options?: { message?: string },
  secret: string = envs.jwtSecret
) => {
  try {
    const data = jwt.verify(token, secret);
    if (data && typeof data !== "string") return { data };
  } catch (err: any) {
    let message = "Invalid Token.";

    if (err?.message?.toLowerCase()?.includes("expired")) {
      message =
        options?.message ||
        "Hey champ! Your session expired, please login again.";
    }

    return {
      error: message,
    };
  }
};

/**
 * Function obscures an email address
 * @param email string
 * @example 's******@gmail.com'
 * @returns Obscured email
 */
export const obscureEmail = (email: string) => {
  if (email) {
    const [name, domain] = email.split("@");
    const l = name.length;
    if (l > 2) {
      return `${name[0]}${new Array(l - 1).join("*")}${name[l - 1]}@${domain}`;
    } else {
      return `${name[0]}${new Array(l).join("*")}@${domain}`;
    }
  }
};

function getAuthorizationHeader(req: Request): string | undefined {
  return (req.headers["authorization"] ||
    req.headers["Authorization"]) as string;
}

/**
 * Checks for an `Authorization` header in the provided `request` and verifies the token
 * @param req
 * @param errorMessage optional error message
 * @returns decoded `data` OR `error` message
 */
export const verifyAuthorization = (req: Request, message?: string) => {
  const authorization = getAuthorizationHeader(req);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    sendError.unauthenticatedError("Missing valid authorization headers");
  }

  const authToken = authorization.split(" ")[1];
  return verifyJwtToken(authToken, { message });
};

/**
 * Removes a property or properties contained in an array of properties from a provided object
 * @param obj
 * @param props
 */
export const removeObjectProps = (
  obj: Record<string, any>,
  props: string | string[]
) => {
  if (Array.isArray(props)) {
    props.forEach((prop) => {
      if (prop.includes(".")) {
        const [parent, child] = prop.split(".");
        if (obj[child]) delete obj[parent][child];
      }

      delete obj[prop];
    });
  } else delete obj[props];

  return obj;
};

/** Generates and returns an object whose keys in number represent ***time*** in `hour` and values expressed in `milliseconds`
 * @description Ranges from 1 to 24 ***hours***
 */
export const generateHours = (): TimeInMilliseconds<Hours> => {
  const hours = {} as TimeInMilliseconds<Hours>;
  for (let i = 1; i <= 24; i++) {
    hours[i as keyof typeof hours] = i * 60 * 60 * 1000; // Convert hours to milliseconds
  }
  return hours;
};

/** Generates and returns an object whose keys in number represent ***time*** in `day` and values expressed in `milliseconds`
 * @description Ranges from 1 to 7 ***days***
 */
export const generateDays = (): TimeInMilliseconds<Days> => {
  const days = {} as TimeInMilliseconds<Days>;
  for (let i = 1; i <= 7; i++) {
    days[i as keyof typeof days] = i * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  }
  return days;
};

/** Generates and returns an object whose keys in number represent ***time*** in `minute` and values expressed in `milliseconds`
 * @description Ranges from 1 to 59 ***minutes***
 */
export const generateMinutes = (): TimeInMilliseconds<Minutes> => {
  const minutes = {} as TimeInMilliseconds<Minutes>;
  for (let i = 1; i <= 59; i++) {
    minutes[i as keyof typeof minutes] = i * 60 * 1000; // Convert minutes to milliseconds
  }
  return minutes;
};

export const uploadImageToCloudinary = async (
  file: Avatar,
  u_preset: string = UPLOAD_PRESET
) => {
  const public_id = `IMG_${Date.now()}`;

  try {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
      upload_preset: u_preset,
      resource_type: "image",
      public_id,
    });

    const avatar_url = uploadResponse.secure_url;

    return avatar_url;
  } catch (error) {
    console.log("Error uploading image to cloudinary :>> ", error);

    sendError.badGatewayError(
      "Failed to upload image. Please try again later."
    );
  }
};

export const deleteImageFromCloudinary = async (
  imgUrl: string,
  u_preset: string = UPLOAD_PRESET
) => {
  const parts = imgUrl?.split("/");
  let fileName = "";

  if (parts) fileName = parts[parts?.length - 1].split(".")[0];

  const old_public_id = `${u_preset}/${fileName}`;

  try {
    await cloudinary.uploader.destroy(old_public_id, {
      invalidate: true,
      resource_type: "image",
    });
  } catch (error) {
    console.log("Error deleting image from cloudinary :>> ", error);
  }
};

/** Checks if a mongoose model is registered. This is especially useful before `populate` is used for a path on a model */
export const isModelRegistered = (model: string) =>
  modelNames().includes(model);

/** Checks the validity of mongoose Id passed in from request params or body */
export function validateObjectId(objectId: string) {
  if (!isObjectIdOrHexString(objectId))
    sendError.badRequestError("Invalid ID!");
}

/** Throw an unauthorizationError when user is not found */
export function reject(message?: string) {
  sendError.unauthorizationError(
    message || "Sorry, we could not find that user in our records."
  );
}

/**
 * Selectively updates properties that are allowed to be updated by the end user E.g `username`.
 * @param user
 * @param data
 * @returns updated user document
 */
export const selectivelyUpdateUserProfile = async (
  user: CustomGenericDocument<IUser>,
  data: Partial<IUser>
) => {
  if (data.personal_info) {
    if (user.personal_info.avatarUrl) {
      user.personal_info.avatarUrl = data.personal_info.avatarUrl;
    }

    if (user.personal_info.bio) {
      user.personal_info.bio = data.personal_info.bio;
    }

    if (user.personal_info.email) {
      user.personal_info.email = data.personal_info.email;
    }

    if (user.personal_info.fullname) {
      user.personal_info.fullname = data.personal_info.fullname;
    }

    if (user.personal_info.username) {
      user.personal_info.username = data.personal_info.username;
    }
  }

  if (data.social_links) {
    if (user.social_links.facebook) {
      user.social_links.facebook = data.social_links.facebook;
    }

    if (user.social_links.github) {
      user.social_links.github = data.social_links.github;
    }

    if (user.social_links.instagram) {
      user.social_links.instagram = data.social_links.instagram;
    }

    if (user.social_links.twitter) {
      user.social_links.twitter = data.social_links.twitter;
    }

    if (user.social_links.website) {
      user.social_links.website = data.social_links.website;
    }

    if (user.social_links.youtube) {
      user.social_links.youtube = data.social_links.youtube;
    }
  }

  // update user profile
  await user.save({ validateBeforeSave: true });

  return user;
};
