import { create } from "zustand";

type Author = {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
};
export interface BlogType {
  id?: string;
  title: string;
  content: string;
  published: boolean;
  author: Author;
  tags: string[];
  category: string;
  thumbnail: string;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
}

export interface CommentType {
  id?: string;
  content: string;
  blogId: string;
  author: Author;
  parentComment: string | null;
  likedBy: string[];
  dislikedBy: string[];
  flagged?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type BlogStore = {
  blog: BlogType | null;
  blogs: BlogType[];
  comment: CommentType | null;
  comments: CommentType[];
  setComment: (newComment: CommentType) => void;
  setComments: (newComments: CommentType[]) => void;
  setBlogs: (newBlogs: BlogType[]) => void;
  setBlog: (newBlog: BlogType) => void;
  clearBlog: () => void;
};

export const useBlog = create<BlogStore>((set) => ({
  blog: null,
  blogs: [],
  comment: null,
  comments: [],
  setComment: (newComment: CommentType) => set({ comment: newComment }),
  setComments: (newComments: CommentType[]) => set({ comments: newComments }),
  setBlogs: (newBlogs: BlogType[]) => set({ blogs: newBlogs }),
  setBlog: (newBlog: BlogType) => set({ blog: newBlog }),
  clearBlog: () => set({ blog: null }),
}));
