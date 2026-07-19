export const API_BASE_URL =
  import.meta.env.PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  (import.meta.env.DEV
    ? "http://localhost:3000/api/v1"
    : "https://mysite-backend-rtck.onrender.com/api/v1");

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export interface Author {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface BlogType {
  id?: string;
  title: string;
  content: string;
  description?: string;
  published: boolean;
  author: Author;
  tags: string[];
  category: string;
  slug: string;
  thumbnail: string;
  readTime: number;
  views?: number;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface BlogsResponse {
  data: BlogType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TopTagsResponse {
  tags: string[];
}

export const fetchBlogs = async (
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<BlogsResponse> => {
  const url = new URL(buildApiUrl("/blogs"));
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Failed to fetch blogs: ${res.status}`);
  }
  return (await res.json()) as BlogsResponse;
};

export const fetchBlog = async (slug: string): Promise<BlogType> => {
  const res = await fetch(buildApiUrl(`/blogs/${slug}`), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch blog: ${res.status}`);
  }
  return (await res.json()) as BlogType;
};

export const fetchTopTags = async (): Promise<TopTagsResponse> => {
  const res = await fetch(buildApiUrl("/blogs/top-tags"), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch top tags: ${res.status}`);
  }
  return (await res.json()) as TopTagsResponse;
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]+>/g, "");
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
