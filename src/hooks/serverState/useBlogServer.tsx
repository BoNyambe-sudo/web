import { request } from "@/config/axios_config";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import type { BlogType, CommentType } from "../clientState/useBlog";
import { type BlogQueryParams } from "@/pages/user/Blogs";
import toast from "react-hot-toast";

export interface CreateBlogType {
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  image?: File;
  readTime: number;
}

interface BlogsResponse {
  data: BlogType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface CommentsResponse {
  data: CommentType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

type BlogAnalytics = {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  deletedBlogs: number;
  blogsPerCategory: { category: string; count: number }[];
};

const uploadImage = async (image: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("image", image);

  return await request<{ url: string }>({
    url: "/blogs/upload",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const fetchBlog = async (id: string): Promise<BlogType> => {
  return await request<BlogType>({
    url: `/blogs/${id}`,
    method: "GET",
  });
};

// Fetch blogs with filters
const fetchBlogs = async (
  params: BlogQueryParams = {},
): Promise<BlogsResponse> => {
  return await request<BlogsResponse>({
    url: "/blogs",
    method: "GET",
    params,
  });
};

// Create blog
const createBlog = async (
  blog: CreateBlogType,
): Promise<{ blog: BlogType }> => {
  // Create FormData to handle file uploads
  const formData = new FormData();

  // Append all non-file fields
  Object.entries(blog).forEach(([key, value]) => {
    if (value !== undefined && value !== null && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    }
  });

  // Append file separately if thumbnail is a File
  if (blog.image && blog.image instanceof File) {
    formData.append("image", blog.image as File);
  }

  return await request<{ blog: BlogType }>({
    url: "/blogs",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update blog
const updateBlog = async (
  id: string,
  blog: Partial<CreateBlogType>,
): Promise<BlogType> => {
  // Create FormData to handle file uploads
  const formData = new FormData();

  // Append all non-file fields
  Object.entries(blog).forEach(([key, value]) => {
    if (value !== undefined && value !== null && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    }
  });

  // Append file separately if thumbnail is a File
  if (blog.image && blog.image instanceof File) {
    formData.append("imamge", blog.image as File);
  }

  return await request<BlogType>({
    url: `/blogs/${id}`,
    method: "PATCH",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete blog
const deleteBlog = async (
  id: string,
): Promise<{ deleted: boolean; id: string }> => {
  return await request<{ deleted: boolean; id: string }>({
    url: `/blogs/${id}`,
    method: "DELETE",
  });
};

const hardDeleteBlog = async (
  id: string,
): Promise<{ deleted: boolean; id: string }> => {
  return await request<{ deleted: boolean; id: string }>({
    url: `/blogs/${id}/permanently`,
    method: "DELETE",
  });
};

const fetchBlogAnalytics = async (): Promise<BlogAnalytics> => {
  return await request<BlogAnalytics>({
    url: `/blogs/analytics`,
    method: "GET",
  });
};

const topTags = async (): Promise<{ tags: string[] }> => {
  return await request<{ tags: string[] }>({
    url: `/blogs/top-tags`,
    method: "GET",
  });
};

const restoreBlog = async (id: string): Promise<BlogType> => {
  return await request<BlogType>({
    url: `/blogs/restore/${id}`,
    method: "PATCH",
  });
};

const fetchComments = async (
  blogId: string,
  params: { page?: number; limit?: number } = {},
): Promise<CommentsResponse> => {
  return await request<CommentsResponse>({
    url: `/blogs/${blogId}/comments`,
    method: "GET",
    params,
  });
};

// Fetch replies for a comment
const fetchReplies = async (
  blogId: string,
  commentId: string,
  params: { page?: number; limit?: number } = {},
): Promise<CommentsResponse> => {
  return await request<CommentsResponse>({
    url: `/blogs/${blogId}/comments/${commentId}`,
    method: "GET",
    params,
  });
};

// Create comment
const createComment = async (
  blogId: string,
  comment: { content: string },
): Promise<{ comment: CommentType }> => {
  return await request<{ comment: CommentType }>({
    url: `/blogs/${blogId}/comments`,
    method: "POST",
    data: comment,
  });
};

const createReply = async (
  blogId: string,
  commentId: string,
  reply: { content: string },
): Promise<{ comment: CommentType }> => {
  return await request<{ comment: CommentType }>({
    url: `/blogs/${blogId}/comments/${commentId}`,
    method: "POST",
    data: reply,
  });
};

// Update comment
const updateComment = async (
  blogId: string,
  commentId: string,
  comment: { content: string },
): Promise<{ comment: CommentType }> => {
  return await request<{ comment: CommentType }>({
    url: `/blogs/${blogId}/comments/${commentId}`,
    method: "PATCH",
    data: comment,
  });
};

// Delete comment
const deleteComment = async (
  blogId: string,
  commentId: string,
): Promise<{ deleted: boolean; id: string }> => {
  return await request<{ deleted: boolean; id: string }>({
    url: `/blogs/${blogId}/comments/${commentId}`,
    method: "DELETE",
  });
};

const commentHardDelete = async (
  blogId: string,
  commentId: string,
): Promise<{ deleted: boolean; id: string }> => {
  return await request<{ deleted: boolean; id: string }>({
    url: `/blogs/${blogId}/comments/${commentId}/permanently`,
    method: "DELETE",
  });
};

const commentRestore = async (
  blogId: string,
  commentId: string,
): Promise<CommentType> => {
  return await request<CommentType>({
    url: `/blogs/${blogId}/comments/${commentId}/restore`,
    method: "PATCH",
  });
};

const likeComment = async (
  blogId: string,
  commentId: string,
): Promise<CommentType> => {
  return await request<CommentType>({
    url: `/blogs/${blogId}/comments/${commentId}/like`,
    method: "PATCH",
  });
};

const dislikeComment = async (
  blogId: string,
  commentId: string,
): Promise<CommentType> => {
  return await request<CommentType>({
    url: `/blogs/${blogId}/comments/${commentId}/dislike`,
    method: "PATCH",
  });
};

const flagComment = async (
  blogId: string,
  commentId: string,
): Promise<CommentType> => {
  return await request<CommentType>({
    url: `/blogs/${blogId}/comments/${commentId}/flag`,
    method: "PATCH",
  });
};

// Use query for blog by ID
export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlog(id),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    enabled: !!id,
  });
};

// Use infinite query for blogs with filters
export const useInfiniteBlogs = (params: BlogQueryParams = {}) => {
  return useInfiniteQuery<BlogsResponse>({
    queryKey: ["blogs", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchBlogs({
        ...params,
        page: Number(pageParam),
        limit: params.limit || 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.pagination.pages ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

// Use query for blogs with filters (single page)
export const useBlogs = (params: BlogQueryParams = {}) => {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: () => fetchBlogs(params),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

// Use mutation for creating blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,

    onSuccess: (data) => {
      // Update blogs list queries
      queryClient.setQueryData<BlogsResponse>(["blogs"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: [...oldData.data, data.blog],
          pagination: {
            ...oldData.pagination,
            total: oldData.pagination.total + 1,
            pages: Math.ceil(
              (oldData.pagination.total + 1) / oldData.pagination.limit,
            ),
          },
        };
      });

      // Also update infinite queries
      queryClient.setQueryData<BlogsResponse>(
        ["blogs", undefined],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [...oldData.data, data.blog],
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total + 1,
              pages: Math.ceil(
                (oldData.pagination.total + 1) / oldData.pagination.limit,
              ),
            },
          };
        },
      );

      toast.success("Blog created successfully");
    },
  });
};

// Use mutation for updating blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blog }: { id: string; blog: Partial<CreateBlogType> }) =>
      updateBlog(id, blog),
    onSuccess: (data, variables) => {
      // Update specific blog query
      queryClient.setQueryData<BlogType>(["blog", variables.id], data);

      // Update blogs list queries
      queryClient.setQueryData<BlogsResponse>(["blogs"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((blogItem) =>
            blogItem.id === data.id ? data : blogItem,
          ),
        };
      });

      // Also update infinite queries
      queryClient.setQueryData<BlogsResponse>(
        ["blogs", undefined],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((blogItem) =>
              blogItem.id === data.id ? data : blogItem,
            ),
          };
        },
      );

      toast.success("Blog updated successfully");
    },
  });
};

export const useBlogAnalytics = () => {
  return useQuery({
    queryKey: ["blog-analytics"],
    queryFn: fetchBlogAnalytics,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });
};

// Use mutation for deleting blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-analytics"] });

      toast.success("Blog deleted successfully");
    },
  });
};

export const useHardDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hardDeleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-analytics"] });
      toast.success("Blog deleted successfully");
    },
  });
};

// Use infinite query for comments
export const useInfiniteComments = (
  blogId: string,
  params: { limit?: number } = {},
) => {
  return useInfiniteQuery<CommentsResponse>({
    queryKey: ["comments", blogId, params],
    queryFn: ({ pageParam = 1 }) =>
      fetchComments(blogId, { ...params, page: Number(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.pagination.pages ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60, // 1 hour
    enabled: !!blogId,
  });
};

export const useReplies = (
  blogId: string,
  commentId: string,
  params: { limit?: number },
) => {
  return useQuery({
    queryKey: ["replies", blogId, commentId, params],
    queryFn: () => fetchReplies(blogId, commentId, params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    enabled: !!commentId,
  });
};

// Use infinite query for replies
export const useInfiniteReplies = (
  blogId: string,
  commentId: string,
  params: { limit?: number } = {},
) => {
  return useInfiniteQuery<CommentsResponse>({
    queryKey: ["replies", blogId, commentId, params],
    queryFn: ({ pageParam = 1 }) =>
      fetchReplies(blogId, commentId, { ...params, page: Number(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.pagination.pages ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    enabled: !!commentId,
  });
};

// Use query for comments (single page)
export const useComments = (
  blogId: string,
  params: { page?: number; limit?: number } = {},
) => {
  return useQuery({
    queryKey: ["comments", blogId, params],
    queryFn: () => fetchComments(blogId, params),
    staleTime: 1000 * 60 * 5, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    enabled: !!blogId,
  });
};

// Use mutation for creating comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      comment,
      parentId,
    }: {
      blogId: string;
      comment: { content: string };
      parentId?: string;
    }) => {
      if (parentId) {
        return createReply(blogId, parentId, comment);
      }
      return createComment(blogId, comment);
    },
    onSuccess: (_data, variables) => {
      // Invalidate main comments list
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.blogId],
      });
      // If it's a reply, also invalidate the parent's replies list
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", variables.blogId, variables.parentId],
        });
      }
    },
  });
};

// Use mutation for updating comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      commentId,
      comment,
    }: {
      blogId: string;
      commentId: string;
      comment: { content: string };
    }) => updateComment(blogId, commentId, comment),
    onSuccess: (data, variables) => {
      // Invalidate main comments list (covers top-level updates)
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.blogId],
      });
      // If comment is a reply, also invalidate its parent's replies list to update the comment there
      if (data.comment.parentComment) {
        queryClient.invalidateQueries({
          queryKey: ["replies", variables.blogId, data.comment.parentComment],
        });
      }
      toast.success("Comment updated successfully");
    },
  });
};

// Use mutation for deleting comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      commentId,
    }: {
      blogId: string;
      commentId: string;
    }) => deleteComment(blogId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.blogId],
      });
      // Invalidate all replies for the blog to clear any cached threads
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.blogId],
      });
      toast.success("Comment deleted successfully");
    },
  });
};

// Use mutation for liking comment
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      commentId,
    }: {
      blogId: string;
      commentId: string;
      parentId?: string;
    }) => likeComment(blogId, commentId),
    onSuccess: (_, variables) => {
      const { blogId, parentId } = variables;
      queryClient.invalidateQueries({
        queryKey: ["comments", blogId],
      });
      // If comment is a reply, invalidate its parent's replies list
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", blogId, parentId],
        });
      }
    },
  });
};

// Use mutation for disliking comment
export const useDislikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      commentId,
    }: {
      blogId: string;
      commentId: string;
      parentId?: string;
    }) => dislikeComment(blogId, commentId),
    onSuccess: (_, variables) => {
      const { blogId, parentId } = variables;
      queryClient.invalidateQueries({
        queryKey: ["comments", blogId],
      });
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", blogId, parentId],
        });
      }
    },
  });
};

export const useFlagComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      commentId,
    }: {
      blogId: string;
      commentId: string;
      parentId?: string;
    }) => flagComment(blogId, commentId),
    onSuccess: (_, variables) => {
      const { blogId, parentId } = variables;
      queryClient.invalidateQueries({
        queryKey: ["comments", blogId],
      });
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies", blogId, parentId],
        });
      }
    },
  });
};

export const useBlogRestore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId }: { blogId: string }) => restoreBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
      toast.success("Blog restored successfully");
    },
  });
};

export const useCommetRestore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      commentId,
    }: {
      blogId: string;
      commentId: string;
    }) => commentRestore(blogId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.blogId],
      });
      // Invalidate all replies for the blog to reflect restored comment
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.blogId],
      });
      toast.success("Comment restored successfully");
    },
  });
};

export const useCommentHardDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      commentId,
    }: {
      blogId: string;
      commentId: string;
    }) => commentHardDelete(blogId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.blogId],
      });
      // Invalidate all replies for the blog to clear any cached threads
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.blogId],
      });
      toast.success("Comment deleted successfully");
    },
  });
};

export const useTopTags = () => {
  return useQuery({
    queryKey: ["topTags"],
    queryFn: topTags,
    staleTime: 1000 * 60 * 24,
    gcTime: 1000 * 60 * 30,
  });
};

export const useUploadBlogImage = () => {
  return useMutation({ mutationFn: uploadImage });
};
