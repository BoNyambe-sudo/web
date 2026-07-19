import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BlogCard from "@/components/BlogCard";
import {
  X,
  Search,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import type { BlogType } from "@/lib/api";

export interface BlogFiltersState {
  category: string;
  sortBy: string;
  tags: string[];
  latest: boolean;
}

const API = "/api/v1";

interface Props {
  initialBlogs: BlogType[];
  availableCategories: string[];
  availableTags: string[];
}

const BlogFilters = ({
  initialBlogs,
  availableCategories,
  availableTags,
}: Props) => {
  const [selectedFilters, setSelectedFilters] =
    React.useState<BlogFiltersState>({
      category: "",
      tags: [],
      latest: false,
      sortBy: "-views",
    });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [blogs, setBlogs] = React.useState<BlogType[]>(initialBlogs);
  const [page, setPage] = React.useState(1);
  const [hasNext, setHasNext] = React.useState(initialBlogs.length >= 10);
  const [loading, setLoading] = React.useState(false);
  const [total, setTotal] = React.useState(initialBlogs.length);

  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  
  const isFirstRun = React.useRef(true);

  const SORT_OPTIONS = [
    { value: "-views", label: "Popular" },
    { value: "title", label: "Title: A to Z" },
    { value: "-title", label: "Title: Z to A" },
    { value: "readTime", label: "Read Time: Short to Long" },
    { value: "-readTime", label: "Read Time: Long to Short" },
    { value: "-createdAt", label: "Date Created: New to Old" },
    { value: "createdAt", label: "Date Created: Old to New" },
    { value: "-updatedAt", label: "Date Updated: New to Old" },
    { value: "updatedAt", label: "Date Updated: Old to New" },
  ];

  const scrollToResults = React.useCallback(() => {
    const el = resultsRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const runQuery = React.useCallback(
    async (
      filters: BlogFiltersState,
      q: string,
      pg: number,
      append: boolean,
    ) => {
      setLoading(true);
      
      try {
        const url = new URL(`${API}/blogs`);
        url.searchParams.set("published", "true");
        url.searchParams.set("deleted", "false");
        url.searchParams.set("sortBy", filters.sortBy);
        url.searchParams.set("limit", "10");
        url.searchParams.set("page", String(pg));
        if (q) url.searchParams.set("q", q);
        if (filters.tags.length)
          url.searchParams.set("tags", filters.tags.join(","));
        if (filters.category)
          url.searchParams.set("category", filters.category);
        if (filters.latest) url.searchParams.set("latest", "true");
        const res = await fetch(url.toString());
        const data = await res.json();
        const items: BlogType[] = data?.data || [];
        setBlogs((prev) => (append ? [...prev, ...items] : items));
        setTotal(data?.pagination?.total ?? items.length);
        setHasNext(pg < (data?.pagination?.pages ?? 1));
      } catch {
        setBlogs([]);
        setHasNext(false);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    if(isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setPage(1);
    runQuery(selectedFilters, debouncedSearch, 1, false);
  }, [selectedFilters, debouncedSearch, runQuery]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedFilters((s) => ({ ...s, category: checked ? category : "" }));
    scrollToResults();
  };
  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedFilters((s) => ({
      ...s,
      tags: checked ? [...s.tags, tag] : s.tags.filter((t) => t !== tag),
    }));
    scrollToResults();
  };
  const handleLatestChange = (checked: boolean) => {
    setSelectedFilters((s) => ({ ...s, latest: checked }));
    scrollToResults();
  };
  const handleSortChange = (value: string | null) => {
    if (value === null) return;
    setSelectedFilters((s) => ({ ...s, sortBy: value }));
    scrollToResults();
  };
  const handleReset = () => {
    setSelectedFilters({
      category: "",
      tags: [],
      latest: false,
      sortBy: "-views",
    });
    setSearchQuery("");
    scrollToResults();
  };
  const handleFilterRemove = (type: keyof BlogFiltersState, value: string) => {
    if (type === "category")
      setSelectedFilters((s) => ({ ...s, category: "" }));
    else if (type === "tags")
      setSelectedFilters((s) => ({
        ...s,
        tags: s.tags.filter((t) => t !== value),
      }));
    else if (type === "latest")
      setSelectedFilters((s) => ({ ...s, latest: false }));
    scrollToResults();
  };

  const hasSelected =
    selectedFilters.category ||
    selectedFilters.tags.length > 0 ||
    selectedFilters.latest;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="lg:w-64 shrink-0">
        <div
          className={`lg:sticky lg:top-20 ${filtersOpen ? "space-y-6" : ""} rounded-xl border border-border bg-card p-4`}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="blog-filter-panel"
            >
              <SlidersHorizontal size={16} />
              {filtersOpen ? "Hide" : "Show"}
              <ChevronDown
                size={16}
                className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
          <div
            id="blog-filter-panel"
            className={`${filtersOpen ? "block" : "hidden"} lg:block`}
          >
            <h3 className="sr-only">Filter options</h3>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedFilters.category === category}
                      onCheckedChange={(c) =>
                        handleCategoryChange(category, c === true)
                      }
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="my-3" />
            <div className="space-y-3 mb-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Tags
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedFilters.tags.includes(tag)}
                      onCheckedChange={(c) => handleTagChange(tag, c === true)}
                    />
                    <Label
                      htmlFor={`tag-${tag}`}
                      className="text-sm cursor-pointer"
                    >
                      {tag.replace("-", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="my-3" />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="latest"
                  checked={selectedFilters.latest}
                  onCheckedChange={(c) => handleLatestChange(c === true)}
                />
                <Label htmlFor="latest" className="text-sm cursor-pointer">
                  Latest Blog Posts
                </Label>
              </div>
            </div>
            <Separator className="my-3" />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </aside>

      <div ref={resultsRef} className="flex-1 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 items-center">
            <p className="hidden md:block text-sm text-muted-foreground">
              Sort By:
            </p>
            <Select
              value={selectedFilters.sortBy}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="max-w-45">
                {(() => {
                  const selected = SORT_OPTIONS.find(o => o.value === selectedFilters.sortBy);
                  return selected ? <span>{selected.label}</span> : <SelectValue placeholder="Sort" />;
                })()}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-views">Popular</SelectItem>
                <SelectItem value="title">Title: A to Z</SelectItem>
                <SelectItem value="-title">Title: Z to A</SelectItem>
                <SelectItem value="readTime">
                  Read Time: Short to Long
                </SelectItem>
                <SelectItem value="-readTime">
                  Read Time: Long to Short
                </SelectItem>
                <SelectItem value="-createdAt">
                  Date Created: New to Old
                </SelectItem>
                <SelectItem value="createdAt">
                  Date Created: Old to New
                </SelectItem>
                <SelectItem value="-updatedAt">
                  Date Updated: New to Old
                </SelectItem>
                <SelectItem value="updatedAt">
                  Date Updated: Old to New
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasSelected && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">Selected Filters:</span>
            {selectedFilters.category && (
              <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border">
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
            {selectedFilters.tags.map((tag) => (
              <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border">
                {tag}
                <button
                  onClick={() => handleFilterRemove("tags", tag)}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {selectedFilters.latest && (
              <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-full text-xs border">
                Latest Blog Posts
                <button
                  onClick={() => handleFilterRemove("latest", "latest")}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <Button variant="destructive" size="sm" onClick={handleReset}>
              Reset All
            </Button>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Found {total} {total === 1 ? "blog post" : "blog posts"}
        </p>

        {loading && blogs.length === 0 ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={handleReset}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        )}

        {hasNext && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => {
                const next = page + 1;
                setPage(next);
                runQuery(selectedFilters, debouncedSearch, next, true);
                scrollToResults();
              }}
              disabled={loading}
              className="h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogFilters;
