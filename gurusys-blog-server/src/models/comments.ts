import mongoose, { Schema } from "mongoose";

import { isModelRegistered } from "../lib";

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

    comment: {
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

    commented_by: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "users",
    },

    isReply: {
      type: Boolean,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: "comments",
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
