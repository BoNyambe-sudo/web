import BlogCard from "@/components/BlogCard";
import { BlogSidebar, type BlogFilters } from "@/components/BlogSiderBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  useInfiniteBlogs,
  useTopTags,
} from "@/hooks/serverState/useBlogServer";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import SEOHelmet from "@/components/SEOHelmet";
import {
  BLOG_CATEGORIES,
  SITE_URL,
  getBlogListSchema,
  getDescriptionForCategory,
  getKeywordsForCategory,
} from "@/lib/seoConfig";
import Header from "@/components/Header";

export type BlogQueryParams = {
  category?: string;
  tags?: string;
  latest?: boolean;
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  author?: string;
  published?: boolean;
  deleted?: boolean;
};
const Blogs = () => {
  const [selectedFilters, setSelectedFilters] = useState<BlogFilters>({
    category: "",
    tags: [],
    latest: false,
    sortBy: "-views",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const { data: tagsResult } = useTopTags();
  const availableTags = tagsResult?.tags || [];

  const queryParams: BlogQueryParams = {
    sortBy: selectedFilters.sortBy,
    deleted: false,
    published: true,
  };
  if (debouncedSearchQuery) {
    queryParams.q = debouncedSearchQuery;
  }
  if (selectedFilters.tags) {
    queryParams.tags = selectedFilters.tags.join(",");
  }
  if (selectedFilters.category) {
    queryParams.category = selectedFilters.category;
  }
  if (selectedFilters.latest) {
    queryParams.latest = selectedFilters.latest;
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteBlogs(queryParams);
  const blogs = data?.pages.flatMap((page) => page.data) || [];

  // Generate SEO metadata based on selected category
  const pageTitle = selectedFilters.category
    ? `${selectedFilters.category} Blogs`
    : "Explore Blogs";

  const pageDescription = selectedFilters.category
    ? getDescriptionForCategory(selectedFilters.category)
    : "Explore insightful articles on Technology, Lifestyle, Health, Photography, Sports, Business, and more. Read latest blog posts and expert insights.";

  const pageKeywords = selectedFilters.category
    ? getKeywordsForCategory(selectedFilters.category)
    : [
        ...BLOG_CATEGORIES,
        "blog",
        "articles",
        "latest posts",
        "expert insights",
      ].join(", ");

  const blogListSchema = getBlogListSchema(
    selectedFilters.category,
    blogs.length,
  );

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
      <SEOHelmet
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        url={`${SITE_URL}/blogs`}
        canonicalUrl={`${SITE_URL}/blogs`}
      >
        <script type="application/ld+json">
          {JSON.stringify(blogListSchema)}
        </script>
      </SEOHelmet>
      <BlogSidebar
        onFiltersChange={handleFiltersChange}
        selectedFilters={selectedFilters}
        availableCategories={BLOG_CATEGORIES}
        availableTags={availableTags}
      />
      <SidebarInset>
        <Header />
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <span className="text-muted-foreground">|</span>

            {/* Filter Summary */}
            {hasSelectedFilters ? (
              <div className="flex-1 min-w-0 overflow-x-auto">
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className="text-sm font-medium whitespace-nowrap shrink-0">
                    Selected Filters:
                  </span>

                  {/* Categories */}

                  {selectedFilters.category && (
                    <span
                      key={`category-${selectedFilters.category}`}
                      className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border shrink-0"
                    >
                      {selectedFilters.category}
                      <button
                        onClick={() =>
                          handleFilterRemove(
                            "category",
                            selectedFilters.category,
                          )
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
                      className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border shrink-0"
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
                    <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border shrink-0">
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
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedFilters({
                        category: "",
                        tags: [],
                        latest: false,
                        sortBy: "-views",
                      });
                      setSearchQuery("");
                    }}
                    className="text-xs"
                  >
                    Reset All
                  </Button>
                </div>
              </div>
            ) : (
              <h1 className="text-sm text-muted-foreground">Blogs</h1>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <p className="hidden md:block">Sort By:</p>

              <Select
                value={selectedFilters.sortBy}
                onValueChange={(value) =>
                  setSelectedFilters({ ...selectedFilters, sortBy: value })
                }
              >
                <SelectTrigger className="max-w-45">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-views">Most Viewed</SelectItem>
                  <SelectItem value="title">Title: A to Z</SelectItem>
                  <SelectItem value="-title">Title: Z to A</SelectItem>
                  <SelectItem value="createdAt">
                    Date Created: New to Old
                  </SelectItem>
                  <SelectItem value="-createdAt">
                    Date Created: Old to New
                  </SelectItem>
                  <SelectItem value="updatedAt">
                    Date Updated: New to Old
                  </SelectItem>
                  <SelectItem value="-updatedAt">
                    Date Updated: Old to New
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            Found {blogs.length} {blogs.length === 1 ? "blog" : "blogs"}
          </div>
          {isLoading ? (
            <div className=" flex items-center justify-center text-center h-full my-auto">
              <Loader2 className="size-4 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs?.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
          {hasNextPage && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="h-10"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More Blogs"
                )}
              </Button>
            </div>
          )}

          {blogs.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFilters({
                    category: "",
                    tags: [],
                    latest: false,
                    sortBy: "-views",
                  });
                  setSearchQuery("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Blogs;
