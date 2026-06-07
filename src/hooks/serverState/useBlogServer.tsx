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
  totalViews: number;
  blogsPerCategory: { category: string; count: number }[];
  viewsPerCategory: { category: string; views: number }[];
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
  // If image is present, use FormData for multipart upload
  if (blog.image && blog.image instanceof File) {
    const formData = new FormData();

    // Append all non-file fields
    Object.entries(blog).forEach(([key, value]) => {
      if (value !== undefined && value !== null && !(value instanceof File)) {
        if (
          key === "content" ||
          key === "title" ||
          key === "category" ||
          typeof value === "boolean"
        ) {
          formData.append(key, value as string);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }
    });

    formData.append("image", blog.image);

    return await request<{ blog: BlogType }>({
      url: "/blogs",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // No image, send as JSON
  return await request<{ blog: BlogType }>({
    url: "/blogs",
    method: "POST",
    data: blog,
  });
};

// Update blog
const updateBlog = async (
  id: string,
  blog: Partial<CreateBlogType>,
): Promise<BlogType> => {
  // If image is present, use FormData for multipart upload
  if (blog.image && blog.image instanceof File) {
    const formData = new FormData();

    // Append all non-file fields
    Object.entries(blog).forEach(([key, value]) => {
      if (value !== undefined && value !== null && !(value instanceof File)) {
        if (
          key === "content" ||
          key === "title" ||
          key === "category" ||
          typeof value === "boolean"
        ) {
          formData.append(key, value as string);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }
    });

    formData.append("image", blog.image);

    return await request<BlogType>({
      url: `/blogs/${id}`,
      method: "PATCH",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // No image, send as JSON
  return await request<BlogType>({
    url: `/blogs/${id}`,
    method: "PATCH",
    data: blog,
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

export const addView = async (id: string): Promise<{ views: number }> => {
  return await request<{ views: number }>({
    url: `/blogs/${id}/view`,
    method: "GET",
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

const fetchAllReplies = async (blogId: string): Promise<CommentType[]> => {
  return await request<CommentType[]>({
    url: `/blogs/comments/all-replies/${blogId}`,
    method: "GET",
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
): Promise<CommentType> => {
  return await request<CommentType>({
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
    },
  });
};

// Use mutation for updating blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blog }: { id: string; blog: Partial<CreateBlogType> }) =>
      updateBlog(id, blog),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blog", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
    },
  });
};

export const useBlogAnalytics = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["blog-analytics"],
    queryFn: fetchBlogAnalytics,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    enabled,
  });
};

// Use mutation for deleting blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
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
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
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
    enabled: !!commentId && !!blogId,
  });
};

export const useAllReplies = (blogId: string) => {
  return useQuery({
    queryKey: ["all-replies", blogId],
    queryFn: () => fetchAllReplies(blogId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    enabled: !!blogId,
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
      queryClient.invalidateQueries({ queryKey: ["all-replies"] });
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
      const updatedComment = data;
      if (!updatedComment) return;

      const updateCache = (oldData: unknown): unknown => {
        if (!oldData || typeof oldData !== "object") return undefined;

        const obj = oldData as Record<string, unknown>;

        // Handle infinite query structure (has pages)
        if (obj.pages && Array.isArray(obj.pages)) {
          return {
            ...obj,
            pages: (obj.pages as Array<{ data: CommentType[] }>).map(
              (page) => ({
                ...page,
                data: page.data.map((c) =>
                  c.id === variables.commentId
                    ? { ...c, content: updatedComment.content }
                    : c,
                ),
              }),
            ),
          };
        }

        // Handle regular query structure (has data)
        if (obj.data && Array.isArray(obj.data)) {
          return {
            ...obj,
            data: (obj.data as CommentType[]).map((c) =>
              c.id === variables.commentId
                ? { ...c, content: updatedComment.content }
                : c,
            ),
          };
        }

        return undefined;
      };

      // Update comments cache
      queryClient.setQueriesData(
        { queryKey: ["comments", variables.blogId], exact: false },
        updateCache,
      );

      // Update replies cache
      queryClient.setQueriesData(
        { queryKey: ["replies", variables.blogId], exact: false },
        updateCache,
      );

      // Also invalidate to trigger background refetch
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.blogId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.blogId],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["all-replies"] });

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
      // Invalidate all comments and replies for the blog
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.blogId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.blogId],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["all-replies"] });
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

      queryClient.invalidateQueries({ queryKey: ["all-replies"] });
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
      queryClient.invalidateQueries({ queryKey: ["all-replies"] });
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
      queryClient.invalidateQueries({ queryKey: ["all-replies"] });
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
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["blog-analytics"] });
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
      queryClient.invalidateQueries({ queryKey: ["all-replies"] });
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
      queryClient.invalidateQueries({ queryKey: ["all-replies"] });
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

const deleteImage = async (imageUrl: string): Promise<{ deleted: boolean }> => {
  return await request<{ deleted: boolean }>({
    url: "/blogs/upload",
    method: "DELETE",
    data: { imageUrl },
  });
};

export const useDeleteBlogImage = () => {
  return useMutation({ mutationFn: deleteImage });
};
