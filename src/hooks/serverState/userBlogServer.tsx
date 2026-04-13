import { request } from "@/config/axios_config";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { BlogType, CommentType } from "../clientState/useBlog";
import { type BlogQueryParams } from "@/pages/user/Blogs";

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
  data: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Paginated replies response
interface RepliesResponse {
  data: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

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

export const useUploadBlogImage = () => {
  return useMutation({ mutationFn: uploadImage });
};
