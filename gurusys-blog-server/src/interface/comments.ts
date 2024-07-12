import { Document, Types } from "mongoose";

export interface IComment {
  blog_id: Types.ObjectId;
  blog_author: Types.ObjectId;
  likes: Types.ObjectId[];
  content: string;
  children: CommentDoc[];
  commented_by: Types.ObjectId;
  parent: Types.ObjectId;
  isReply: boolean;
  activity: {
    total_comments: number;
    total_likes: number;
  };
}

export interface CommentDoc extends Document<IComment> {}
