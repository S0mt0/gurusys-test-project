import mongoose, { Schema } from "mongoose";

import { isModelRegistered } from "../lib/utils";
import { IComment } from "@/interface";

const commentSchema = new mongoose.Schema<IComment>(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },

    blog_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },

    content: {
      type: String,
      required: true,
    },

    children: {
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

    likes: {
      ref: "users",
      type: [
        {
          type: Schema.Types.ObjectId,
        },
      ],
    },

    commented_by: {
      type: Schema.Types.ObjectId,
      require: true,
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
        default: function () {
          return this.children.length;
        },
      },
    },

    isReply: {
      type: Boolean,
      default: false,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: "comments",
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);

commentSchema.plugin(require("mongoose-autopopulate"));

export const Comments = mongoose.model<IComment>("comments", commentSchema);
