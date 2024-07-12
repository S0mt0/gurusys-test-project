import { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";

import { isModelRegistered } from "../lib/utils";

const blogSchema = new Schema<IBlog>(
  {
    blog_id: {
      type: String,
      required: true,
      unique: true,
      default: uuid(),
    },

    title: {
      type: String,
      required: true,
    },

    banner: {
      type: String,
      // required: true,
    },

    likes: {
      ref: "users",
      type: [
        {
          type: Schema.Types.ObjectId,
        },
      ],
    },

    description: {
      type: String,
      maxlength: 200,
      // required: true
    },

    content: {
      type: [],
      // required: true
    },

    tags: {
      type: [String],
      // required: true
    },

    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
      autopopulate: function () {
        if (isModelRegistered("users")) {
          return {
            select:
              "personal_info.username personal_info.avatarUrl personal_info.bio",
          };
        } else {
          return false;
        }
      },
    },

    activity: {
      total_likes: {
        type: Number,
        default: function () {
          return this.likes.length;
        },
      },

      total_comments: {
        type: Number,
        default: 0,
      },

      total_reads: {
        type: Number,
        default: 0,
      },

      total_parent_comments: {
        type: Number,
        default: function () {
          return this.comments.length;
        },
      },
    },

    comments: {
      ref: "comments",
      type: [
        {
          type: Schema.Types.ObjectId,
        },
      ],
      default: [],
    },

    draft: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

blogSchema.plugin(require("mongoose-autopopulate"));

export const Blogs = model<IBlog>("blogs", blogSchema);
