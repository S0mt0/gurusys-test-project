import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  transformSchema,
  getRandomNumbers,
  isModelRegistered,
} from "../lib/utils";

import {
  TIME_IN,
  PROFILE_IMGS_COLLECTIONS_LIST,
  PROFILE_IMGS_NAME_LIST,
} from "../lib/constants";

import { envs } from "../config";

import { Blogs } from "./blogs";
import { Comments } from "./comments";

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        minlength: [3, "fullname must be 3 letters long"],
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      password: String,
      username: {
        type: String,
        minlength: [3, "Username must be 3 letters long"],
        unique: true,
        lowercase: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200"],
        default: "",
      },
      avatarUrl: {
        type: String,
        default: () => {
          return `https://api.dicebear.com/6.x/${PROFILE_IMGS_COLLECTIONS_LIST[Math.floor(Math.random() * PROFILE_IMGS_COLLECTIONS_LIST.length)]}/svg?seed=${PROFILE_IMGS_NAME_LIST[Math.floor(Math.random() * PROFILE_IMGS_NAME_LIST.length)]}`;
        },
      },
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },

    google_auth: {
      type: Boolean,
      default: false,
    },

    refresh_token: {
      type: String,
      default: "",
    },

    blogs: {
      type: [
        {
          type: Schema.Types.ObjectId,
          autopopulate: function () {
            if (isModelRegistered("blogs")) {
              return true;
            } else {
              return false;
            }
          },
        },
      ],
      ref: "blogs",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
    toObject: transformSchema([
      "google_auth",
      "refresh_token",
      "personal_info.password",
    ]),
    toJSON: transformSchema([
      "google_auth",
      "refresh_token",
      "personal_info.password",
    ]),
  }
);

// Indexing the doc for quick fetch
userSchema.index({ "personal_info.email": 1 }, { unique: true });

// Schema pre-save middlewares
userSchema.pre("save", async function (next) {
  if (!this.isModified("personal_info.password")) return next();

  this.personal_info.password = await bcrypt.hash(
    this.personal_info.password,
    10
  );
});

userSchema.post("findOneAndDelete", async function (doc, next) {
  const userId = doc._id;

  try {
    // Delete associated documents
    await Promise.all([
      Blogs.deleteMany({ author: userId }),
      Comments.deleteMany({ commented_by: userId }),
    ]);

    next();
  } catch (err) {
    next(err);
  }
});

// Schema statics
userSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ "personal_info.email": email });
};

userSchema.statics.findByUsername = async function (username) {
  return await this.findOne({ "personal_info.username": username });
};

userSchema.statics.findBySession = async function (refresh_token) {
  return await this.findOne({ refresh_token: refresh_token });
};

// Schema methods
userSchema.methods.verifyPassword = async function (password: string) {
  return await bcrypt.compare(password, this.personal_info.password);
};

userSchema.methods.createAccessToken = function (
  expiresAt?: number | undefined
) {
  return jwt.sign(
    { userId: this._id, google_auth: this.google_auth },
    envs.jwtSecret,
    {
      expiresIn: `${expiresAt || TIME_IN.hours[1]}`,
    }
  );
};

userSchema.methods.createResetPasswordToken = function (
  maxLength?: number,
  expiresAt?: number
) {
  const code = getRandomNumbers(maxLength);

  const data = {
    code,
    email: this.email,
    account_type: this.account_type,
  };

  const exp = expiresAt || TIME_IN.minutes[15];

  const token = jwt.sign(data, envs.jwtSecret, {
    expiresIn: exp.toString(),
  });

  return { ...data, token, expiresAt: exp };
};

export const Users = mongoose.model<IUser, IUserModel>("users", userSchema);
