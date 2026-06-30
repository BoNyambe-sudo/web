import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Filter options interface
export interface BlogFilters {
  category: string;
  sortBy: string;
  tags: string[];
  latest: boolean;
}

// Props interface
interface BlogSidebarProps {
  onFiltersChange: (filters: BlogFilters) => void;
  selectedFilters: BlogFilters;
  availableCategories: string[];
  availableTags: string[];
}

export function BlogSidebar({
  onFiltersChange,
  selectedFilters,
  availableCategories,
  availableTags,
}: BlogSidebarProps) {
  // Handle category filter change
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategory = checked ? category : "";
    onFiltersChange({
      ...selectedFilters,
      category: newCategory,
    });
  };

  // Handle tag filter change
  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...selectedFilters.tags, tag]
      : selectedFilters.tags.filter((t) => t !== tag);
    onFiltersChange({
      ...selectedFilters,
      tags: newTags,
    });
  };

  // Handle latest blogs filter
  const handleLatestChange = (checked: boolean) => {
    onFiltersChange({
      ...selectedFilters,
      latest: checked,
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    onFiltersChange({
      category: "",
      tags: [],
      latest: false,
      sortBy: "-views",
    });
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">Filters</h2>
      </SidebarHeader>
      <SidebarContent className="p-4 space-y-6">
        {/* Categories */}
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
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category, checked as boolean)
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

        <Separator />

        {/* Tags */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Tags
          </h3>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={selectedFilters.tags.includes(tag)}
                  onCheckedChange={(checked) =>
                    handleTagChange(tag, checked as boolean)
                  }
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

        <Separator />

        {/* Latest Blogs */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Date
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="latest"
              checked={selectedFilters.latest}
              onCheckedChange={(checked) =>
                handleLatestChange(checked as boolean)
              }
            />
            <Label htmlFor="latest" className="text-sm cursor-pointer">
              Latest Blog Posts
            </Label>
          </div>
        </div>

        <Separator />

        {/* Reset Button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleResetFilters}
          className="w-full"
        >
          Reset Filters
        </Button>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground">
          Scroll for more filters
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default BlogSidebar;
