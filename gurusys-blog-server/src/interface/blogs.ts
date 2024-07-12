import { Document, Types } from "mongoose";
import { CommentDoc } from "./comments";

export interface IBlog {
  blog_id: string;
  title: string;
  banner: string;
  description: string;
  content: { [key: string]: any }[];
  tags: string[];
  likes: Types.ObjectId[];
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

export interface BlogDoc extends Document<IBlog> {}
