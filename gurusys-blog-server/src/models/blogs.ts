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
    },

    activity: {
      total_likes: {
        type: Number,
        default: 0,
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
        default: 0,
      },
    },

    comments: {
      ref: "comments",
      type: [
        {
          type: Schema.Types.ObjectId,
          autopopulate: function () {
            if (isModelRegistered("comments")) {
              return true;
            } else {
              return false;
            }
          },
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
