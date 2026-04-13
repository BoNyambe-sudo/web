import BlogCard from "@/components/BlogCard";
import { BlogSidebar, type BlogFilters } from "@/components/BlogSiderBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useBlog } from "@/hooks/clientState/useBlog";
import { sampleBlogs } from "@/temporalData";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export type BlogQueryParams = {
  categories?: string;
  tags?: string;
  latest?: boolean;
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  author?: string;
  published?: boolean;
  deleted?: boolean;
};
const Blogs = () => {
  const [selectedFilters, setSelectedFilters] = useState<BlogFilters>({
    category: "",
      tags: [],
      latest: false,
      sortBy: "createAt", // Default sort by date
      sortOrder: "desc", // Default sort order
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const blogs = useBlog((state) => state.blogs);
  const setBlogs = useBlog((state) => state.setBlogs);

  

  useEffect(() => {
    setBlogs(sampleBlogs);
  }, [setBlogs]);

  const availableCategories = [
    "Technology",
    "Lifestyle",
    "Health",
    "Photography",
    "Sports",
    "Business",
    "Religious",
    "Politics",
    "Science",
    "Art",
    "Music",
    "Film & TV",
    "Fashion",
    "Food",
    "Travel",
    "Finance",
    "Education",
    "Entertainment",
  ];

  const availableTags = [
    "fitness",
    "mental-health",
    "nutrition",
    "yoga",
    "personal-finance",
    "entrepreneurship",
    "economics",
    "online-courses",
    "productivity",
    "productivity-tips",
    "career-development",
    "gaming",
    "movies&TV",
    "music",
  ];

  // Handle filter changes
  const handleFiltersChange = (filters: BlogFilters) => {
    setSelectedFilters(filters);
  };

  // Handle removing individual filters
  const handleFilterRemove = (filterType: keyof BlogFilters, value: string) => {
    if (filterType === "category") {
      setSelectedFilters((prev) => ({
        ...prev,
        category: "",
      }));
    } else if (filterType === "tags") {
      setSelectedFilters((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== value),
      }));
    } else if (filterType === "latest") {
      setSelectedFilters((prev) => ({
        ...prev,
        latest: false,
      }));
    }
  };

  // Check if there are any selected filters
  const hasSelectedFilters =
    selectedFilters.category ||
    selectedFilters.tags.length > 0 ||
    selectedFilters.latest;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  });

  return (
    <SidebarProvider>
      <BlogSidebar
        onFiltersChange={handleFiltersChange}
        selectedFilters={selectedFilters}
        availableCategories={availableCategories}
        availableTags={availableTags}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <span className="text-muted-foreground">|</span>

            {/* Filter Summary */}
            {hasSelectedFilters ? (
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
                <span className="text-sm font-medium whitespace-nowrap">
                  Selected Filters:
                </span>

                {/* Categories */}

                {selectedFilters.category && (
                  <span
                    key={`category-${selectedFilters.category}`}
                    className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border"
                  >
                    {selectedFilters.category}
                    <button
                      onClick={() =>
                        handleFilterRemove("category", selectedFilters.category)
                      }
                      className="hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* Tags */}
                {selectedFilters.tags.map((tag) => (
                  <span
                    key={`tag-${tag}`}
                    className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border"
                  >
                    {tag}
                    <button
                      onClick={() => handleFilterRemove("tags", tag)}
                      className="hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {/* Latest */}
                {selectedFilters.latest && (
                  <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border">
                    Latest Blogs
                    <button
                      onClick={() => handleFilterRemove("latest", "latest")}
                      className="hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* Reset All Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedFilters({
                      category: "",
                      tags: [],
                      latest: false,
                      sortBy: "createAt", // Default sort by date
                      sortOrder: "desc", // Default sort order
                    })
                  }
                  className="text-xs"
                >
                  Reset All
                </Button>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Blogs</span>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search Blogs"
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground"
            />
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            Found {blogs.length} {blogs.length === 1 ? "blog" : "blogs"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs?.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Blogs;
