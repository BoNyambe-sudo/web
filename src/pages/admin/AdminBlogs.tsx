import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Save,
  MessageSquare,
  MessageCircle,
  ExternalLink,
  BookOpen,
  Search,
  Send,
  X,
  Edit,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";

//import { Check, ChevronsUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BlogEditor from "@/components/BlogEditor";
import { calculateReadTime } from "@/lib/readTime";
import { formatDate } from "@/lib/formattedDate";
import { type BlogType } from "@/hooks/clientState/useBlog";

import { Loader2 } from "lucide-react";
import BlogRenderer from "@/components/BlogRenderer";
import BlogsPerCategory from "@/components/BlogsPerCategory";
import type { BlogFilters } from "@/components/BlogSiderBar";
import {
  useBlogAnalytics,
  useBlogRestore,
  useCommentHardDelete,
  useCreateBlog,
  useCreateComment,
  useDeleteBlog,
  useInfiniteBlogs,
  useInfiniteComments,
  useInfiniteReplies,
  useUpdateBlog,
  type CreateBlogType,
} from "@/hooks/serverState/useBlogServer";
import { AdminCommentCard } from "@/components/AdminCommentCard";
import type { BlogQueryParams } from "../user/Blogs";
import toast from "react-hot-toast";
import { useUserData } from "@/hooks/serverState/useUserServer";
import warn from "@/lib/warnToaster";
import { useCommentReplyStore } from "@/hooks/clientState/useComments";

type BlogFormData = {
  title: string;
  content: string;
  category: string;
  tags: string;
  published: boolean;
  image?: File;
};

const AdminBlogs = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [blogToRestore, setBlogToRestore] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [createFormData, setCreateFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    category: "Technology",
    tags: "",
    published: false,
  });
  const [selectedFilters, setSelectedFilters] = useState<BlogFilters>({
    category: "",
    tags: [],
    latest: false,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [updateFormData, setUpdateFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    category: "Technology",
    tags: "",
    published: false,
  });
  const [selectedCommentsBlog, setSelectedCommentsBlog] = useState<
    string | null
  >(null);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const showReplies = useCommentReplyStore((state) => state.showReplies);
  const setShowReplies = useCommentReplyStore((state) => state.setShowReplies);
  const selectedComment = useCommentReplyStore(
    (state) => state.selectedComment,
  );
  const setSelectedComment = useCommentReplyStore(
    (state) => state.setSelectedComment,
  );

  const queryParams: BlogQueryParams = {
    sortBy: selectedFilters.sortBy,
    sortOrder: selectedFilters.sortOrder,
    deleted: showDeleted,
  };
  if (debouncedSearchQuery) {
    queryParams.q = debouncedSearchQuery;
  }
  if (selectedFilters.tags) {
    queryParams.tags = selectedFilters.tags.join(",");
  }
  if (selectedFilters.category && selectedFilters.category !== "all") {
    queryParams.category = selectedFilters.category;
  }
  if (selectedFilters.latest) {
    queryParams.latest = selectedFilters.latest;
  }

  const { data: user } = useUserData();
  const {
    data,
    isLoading: blogsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteBlogs(queryParams);
  const blogs = data?.pages.flatMap((page) => page.data) || [];
  const { mutate: createBlog, isPending: creatingBlog } = useCreateBlog();
  const { mutate: updateBlog, isPending: updatingBlog } = useUpdateBlog();
  const { mutate: deleteBlog } = useDeleteBlog();
  const { mutate: restoreBlog } = useBlogRestore();
  const { data: blogsMetrics } = useBlogAnalytics();
  const { mutate: deleteComment } = useCommentHardDelete();
  const { mutate: createComment, isPending: creatingComment } =
    useCreateComment();

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isFetchingNextPage: isFetchingCommentsNextPage,
    hasNextPage: hasCommentsNextPage,
    fetchNextPage: fetchCommentsNextPage,
  } = useInfiniteComments(selectedCommentsBlog || "");
  const comments = commentsData?.pages.flatMap((page) => page.data) || [];

  const {
    data: repliesData,
    isFetchingNextPage: isFetchingRepliesNextPage,
    hasNextPage: hasRepliesNextPage,
    fetchNextPage: fetchNextReplies,
    isLoading: loadingReplies,
  } = useInfiniteReplies(
    selectedCommentsBlog as string,
    selectedComment?.id as string,
  );
  const replies = repliesData?.pages.flatMap((page) => page.data) || [];

  const categories = [
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
    "Productivity",
  ];

  const canDelete = user && user.role === "ADMIN";

  const canEdit = (blog: BlogType) =>
    user &&
    (user.role === "ADMIN" ||
      (user.role === "CONTRIBUTOR" && blog.author.email === user.email));
  const canToggle = (blog: BlogType) =>
    user &&
    (user.role === "ADMIN" ||
      (user.role === "CONTRIBUTOR" && blog.author.email === user.email));

  const handleCreateBlog = () => {
    if (!user) {
      toast.error("You must login first.");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    if (!createFormData.title || !createFormData.content) {
      toast.error("Title and content must be provided.");
      return;
    }

    const newBlog = {
      title: createFormData.title,
      content: createFormData.content,
      category: createFormData.category,
      tags: createFormData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      published: createFormData.published,
      image: createFormData.image,
      readTime: calculateReadTime(createFormData.content),
    };

    createBlog(newBlog, {
      onSuccess: () => {
        resetCreateForm();
        setIsCreateDialogOpen(false);
        resetCreateForm();
        toast.success("Blog created successfully");
      },
    });
  };

  const handleUpdateBlog = () => {
    if (!user) {
      toast.error("You must login first.");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    if (!selectedBlog || !updateFormData.title || !updateFormData.content)
      return;

    const updatedBlog: Partial<CreateBlogType> = {};
    if (updateFormData.title && updateFormData.title !== selectedBlog.title) {
      updatedBlog.title = updateFormData.title;
    }
    if (
      updateFormData.content &&
      updateFormData.content !== selectedBlog.content
    ) {
      updatedBlog.content = updateFormData.content;
    }
    if (
      updateFormData.category &&
      updateFormData.category !== selectedBlog.category
    ) {
      updatedBlog.category = updateFormData.category;
    }
    if (updateFormData.image) {
      updatedBlog.image = updateFormData.image;
    }
    if (
      updateFormData.tags &&
      updateFormData.tags !== selectedBlog.tags.join(",")
    ) {
      updatedBlog.tags = updateFormData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }
    if (updateFormData.published !== selectedBlog.published) {
      updatedBlog.published = updateFormData.published;
    }

    if (Object.keys(updatedBlog).length === 0) {
      warn("Everything is up to date");
      return;
    }

    updateBlog(
      { id: selectedBlog?.id as string, blog: updatedBlog },
      {
        onSuccess: () => {
          resetUpdateForm();
          setIsEditDialogOpen(false);
          setSelectedBlog(null);
          resetUpdateForm();
          toast.success("Blog updated successfully");
        },
      },
    );
  };

  const handleDeleteBlog = () => {
    if (!user) {
      toast.error("You must login first.");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    if (user.role !== "ADMIN") {
      toast.error("You don't have enough permissions to delete");
      return;
    }
    if (blogToDelete) {
      deleteBlog(blogToDelete);
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const openDeleteDialog = (blogId: string) => {
    setBlogToDelete(blogId);
    setIsDeleteDialogOpen(true);
  };

  const openRestoreDialog = (blogId: string) => {
    setBlogToRestore(blogId);
    setIsRestoreDialogOpen(true);
  };

  const confirmRestoreBlog = () => {
    if (!user) {
      toast.error("You must login first.");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    if (user.role !== "ADMIN") {
      toast.error("You don't have enough permissions to restore");
      return;
    }
    if (blogToRestore) {
      restoreBlog(
        { blogId: blogToRestore },
        {
          onSuccess: () => {
            setIsRestoreDialogOpen(false);
            setBlogToRestore(null);
          },
        },
      );
    }
  };

  const handleEditBlog = (blog: BlogType) => {
    setSelectedBlog(blog);
    setUpdateFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category || "Technology",
      tags: blog.tags.join(","),
      published: blog.published,
    });
    setIsEditDialogOpen(true);
  };

  const resetCreateForm = () => {
    setCreateFormData({
      title: "",
      content: "",
      category: "Technology",
      tags: "",
      published: false,
    });
  };

  const resetUpdateForm = () => {
    setUpdateFormData({
      title: "",
      content: "",
      category: "Technology",
      tags: "",
      published: false,
    });
  };

  const toggleBlogVisibility = (blog: BlogType) => {
    if (!user) {
      toast.error("You must login first.");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    updateBlog(
      { id: blog.id as string, blog: { published: !blog.published } },
      {
        onSuccess: () => {
          toast.success("Toggled visibility");
        },
      },
    );
  };

  // Comments handlers
  const handleViewComments = (blogId: string) => {
    setSelectedCommentsBlog(blogId);
    setIsCommentsDialogOpen(true);
  };

  const confirmDeleteComment = () => {
    if (!user) {
      toast.error("You must login first.");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    if (user.role !== "ADMIN") {
      toast.error("You don't have enough permissions to delete");
      return;
    }
    if (commentToDelete) {
      deleteComment(
        {
          blogId: selectedCommentsBlog as string,
          commentId: commentToDelete,
        },
        {
          onSuccess: () => {
            setCommentToDelete(null);
            toast.success("Comment deleted successfully");
          },
        },
      );
    }
  };

  const handleCreateComment = () => {
    if (!user) {
      toast.error("You must login first.");
      return;
    }
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    if (!newCommentText.trim() || !selectedCommentsBlog) return;

    if (showReplies && selectedComment) {
      createComment(
        {
          blogId: selectedCommentsBlog,
          comment: { content: newCommentText },
          parentId: selectedComment.id,
        },
        {
          onSuccess: () => {
            toast.success("Reply created successfully");
            setNewCommentText("");
            setIsCreatingComment(false);
          },
        },
      );
    } else {
      createComment(
        { blogId: selectedCommentsBlog, comment: { content: newCommentText } },
        {
          onSuccess: () => {
            toast.success("Comment created successfully");
            setNewCommentText("");
            setIsCreatingComment(false);
          },
        },
      );
    }
  };

  const handleCancelNewComment = () => {
    setNewCommentText("");
    setIsCreatingComment(false);
  };

  const topLevelComments = comments.filter((c) => !c.parentComment);

  // Preview handler
  const handlePreviewBlog = (blog: BlogType) => {
    setSelectedBlog(blog);
    setIsPreviewDialogOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  });

  function handleReset(): void {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setShowDeleted(false);
    setSelectedFilters({
      category: "",
      tags: [],
      latest: false,
      sortBy: "createAt",
      sortOrder: "desc",
    });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!user || user.status === "BLOCKED" || !selectedBlog) return;
      if (
        !isEditDialogOpen ||
        selectedBlog?.content === updateFormData.content
      ) {
        return;
      }
      updateBlog(
        {
          id: selectedBlog.id as string,
          blog: { content: updateFormData.content },
        },
        {
          onSuccess: () => {
            toast.success("Changes saved.");
          },
        },
      );
    }, 120000);

    return () => clearInterval(intervalId);
  }, [
    isEditDialogOpen,
    selectedBlog,
    updateFormData.content,
    user,
    updateBlog,
  ]);

  return (
    <div className="p-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Blogs</h1>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto scrollbar-hide">
              <DialogHeader>
                <DialogTitle>Create New Blog</DialogTitle>
                <DialogDescription>
                  Write and publish a new blog post.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    placeholder="Enter blog title"
                    value={createFormData.title}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-category">Category</Label>
                  <Select
                    value={createFormData.category}
                    onValueChange={(value) =>
                      setCreateFormData({
                        ...createFormData,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-tags">Tags (comma-separated)</Label>
                  <Input
                    id="create-tags"
                    placeholder="e.g. technology, AI, programming"
                    value={createFormData.tags}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        tags: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-thumbnail">Thumbnail</Label>
                  <Input
                    id="create-thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCreateFormData({
                          ...createFormData,
                          image: file,
                        });
                      }
                    }}
                  />
                  {createFormData.image && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(createFormData.image)}
                        alt="Thumbnail preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        New thumbnail
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="create-content">Content</Label>
                  <BlogEditor
                    initialContent={createFormData.content}
                    onChange={(content) =>
                      setCreateFormData({ ...createFormData, content })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="create-published"
                    checked={createFormData.published}
                    onCheckedChange={(checked) =>
                      setCreateFormData({
                        ...createFormData,
                        published: checked,
                      })
                    }
                  />
                  <Label htmlFor="create-published">
                    {createFormData.published ? "Published" : "Draft"}
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button disabled={creatingBlog} onClick={handleCreateBlog}>
                  <Save className="mr-2 h-4 w-4" />
                  Create Blog
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {user && user.role === "ADMIN" && (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={showDeleted}
                      onPressedChange={setShowDeleted}
                      variant="outline"
                      aria-label="Toggle deleted blogs"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showDeleted ? "Hide Deleted" : "Show Deleted"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          <Select
            value={selectedFilters.category}
            onValueChange={(value) =>
              setSelectedFilters({ ...selectedFilters, category: value })
            }
          >
            <SelectTrigger className="max-w-45">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedFilters.sortBy}
            onValueChange={(value) =>
              setSelectedFilters({ ...selectedFilters, sortBy: value })
            }
          >
            <SelectTrigger className="max-w-45">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="updatedAt">Date Updated</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedFilters.sortOrder}
            onValueChange={(value: "asc" | "desc") =>
              setSelectedFilters({ ...selectedFilters, sortOrder: value })
            }
          >
            <SelectTrigger className="max-w-45">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogsMetrics?.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">
              {blogsMetrics && blogsMetrics.totalBlogs > 0
                ? "Total blogs"
                : "No blogs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Published Blogs
            </CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogsMetrics?.publishedBlogs}
            </div>
            <p className="text-xs text-muted-foreground">
              {blogsMetrics && blogsMetrics.publishedBlogs > 0
                ? "Published blogs"
                : "No published blogs"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Draft Blogs</CardTitle>
            <EyeOff className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogsMetrics?.draftBlogs}</div>
            <p className="text-xs text-muted-foreground">
              {blogsMetrics && blogsMetrics.draftBlogs > 0
                ? "Draft blogs"
                : "No draft blogs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Deleted Blogs</CardTitle>
            <Trash2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogsMetrics?.deletedBlogs}
            </div>
            <p className="text-xs text-muted-foreground">
              {blogsMetrics && blogsMetrics.deletedBlogs > 0
                ? "Deleted blogs"
                : "No deleted blogs"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        {/* Blogs per category */}
        <BlogsPerCategory />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Blogs</h2>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Read Time</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs?.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">
                    {blog.title.substring(0, 30)}...
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {blog.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    {blog.published ? (
                      <span className="flex items-center text-green-600">
                        <Eye className="mr-1 h-4 w-4" />
                        Published
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <EyeOff className="mr-1 h-4 w-4" />
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(blog.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {blog.readTime} min
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex gap-1">
                        {canEdit(blog) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditBlog(blog)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePreviewBlog(blog)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Preview</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleViewComments(blog?.id as string)
                              }
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Comments</p>
                          </TooltipContent>
                        </Tooltip>

                        {canToggle(blog) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleBlogVisibility(blog)}
                              >
                                {blog.published ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{blog.published ? "Unpublish" : "Publish"}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Delete or Restore Button */}
                        {canDelete &&
                          (blog.deleted && showDeleted ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Dialog
                                  open={
                                    isRestoreDialogOpen &&
                                    blogToRestore === blog.id
                                  }
                                  onOpenChange={setIsRestoreDialogOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        openRestoreDialog(blog.id as string)
                                      }
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <RotateCcw className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Restore Blog</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to restore this
                                        blog? It will become visible to readers
                                        again.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setBlogToRestore(null)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="default"
                                        onClick={confirmRestoreBlog}
                                      >
                                        Restore
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Restore</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Dialog
                                  open={
                                    isDeleteDialogOpen &&
                                    blogToDelete === blog.id
                                  }
                                  onOpenChange={setIsDeleteDialogOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        openDeleteDialog(blog.id as string)
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Blog</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete this
                                        blog? This will mark it as deleted. You
                                        can restore it later from the deleted
                                        view.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setBlogToDelete(null)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={handleDeleteBlog}
                                      >
                                        Delete
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
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
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                        Loading...
                      </>
                    ) : (
                      "Load More Blogs"
                    )}
                  </Button>
                </div>
              )}
              {blogsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="flex justify-center">
                      <Loader2 className="size-4 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                blogs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No Blogs found
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>Update the blog post content.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="update-title">Title</Label>
              <Input
                id="update-title"
                placeholder="Enter blog title"
                value={updateFormData.title}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="update-category">Category</Label>
              <Select
                value={updateFormData.category}
                onValueChange={(value) =>
                  setUpdateFormData({ ...updateFormData, category: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="update-tags">Tags (comma-separated)</Label>
              <Input
                id="update-tags"
                placeholder="e.g. technology, AI, programming"
                value={updateFormData.tags}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    tags: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="update-thumbnail">Thumbnail</Label>
              <Input
                id="update-thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUpdateFormData({
                      ...updateFormData,
                      image: file,
                    });
                  }
                }}
              />
              {updateFormData.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(updateFormData.image)}
                    alt="Thumbnail preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}

              {selectedBlog?.thumbnail && !updateFormData.image && (
                <div className="mt-2">
                  <img
                    src={selectedBlog.thumbnail}
                    alt="Existing thumbnail"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Existing thumbnail
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="update-content">Content</Label>
              <BlogEditor
                initialContent={updateFormData.content}
                onChange={(content) =>
                  setUpdateFormData({ ...updateFormData, content })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="update-published"
                checked={updateFormData.published}
                onCheckedChange={(checked) =>
                  setUpdateFormData({ ...updateFormData, published: checked })
                }
              />
              <Label htmlFor="update-published">
                {updateFormData.published ? "Published" : "Draft"}
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={updatingBlog} onClick={handleUpdateBlog}>
              <Save className="mr-2 h-4 w-4" />
              Update Blog
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Comments Dialog */}
      <Dialog
        open={isCommentsDialogOpen}
        onOpenChange={setIsCommentsDialogOpen}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>
              {showReplies && selectedComment && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowReplies(false);
                    setSelectedComment(null);
                  }}
                  className="h-6 w-6 mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {showReplies && selectedComment
                ? `Comment Replies to ${selectedComment.author?.firstName}`
                : "Blog Comments"}
            </DialogTitle>
            <DialogDescription>
              Manage {showReplies && selectedComment ? "replies" : "comments"}{" "}
              for this{" "}
              {showReplies && selectedComment ? "comment." : "blog post."}{" "}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Create Comment Form */}
            {!isCreatingComment ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsCreatingComment(true)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {showReplies && selectedComment ? "Add Reply" : " Add Comment"}
              </Button>
            ) : (
              <Card className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <Label>
                    {showReplies && selectedComment
                      ? `Reply to ${selectedComment.author.firstName}`
                      : "New Comment"}
                  </Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancelNewComment}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={
                    showReplies && selectedComment
                      ? `Reply to ${selectedComment.author.firstName}`
                      : `Write your comment here...`
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleCreateComment()
                  }
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelNewComment}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCreateComment}
                    disabled={!newCommentText.trim() || creatingComment}
                  >
                    {creatingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Post
                  </Button>
                </div>
              </Card>
            )}
            {/* Comments List */}
            {showReplies && selectedComment ? (
              <>
                {loadingReplies ? (
                  <div className="flex justify-center">
                    <Loader2 className="size-4 animate-spin text-primary" />
                  </div>
                ) : replies.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No replies yet.</p>
                  </div>
                ) : (
                  replies?.map((comment) => (
                    <div key={comment?.id}>
                      <AdminCommentCard
                        comment={comment}
                        blogId={selectedCommentsBlog as string}
                      />
                    </div>
                  ))
                )}
                {hasRepliesNextPage && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={() => fetchNextReplies()}
                      disabled={isFetchingRepliesNextPage}
                      className="h-10"
                    >
                      {isFetchingRepliesNextPage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                          Loading...
                        </>
                      ) : (
                        "Load More Replies"
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {commentsLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="size-4 animate-spin text-primary" />
                  </div>
                ) : topLevelComments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No comments yet.</p>
                  </div>
                ) : (
                  topLevelComments?.map((comment) => (
                    <div key={comment?.id}>
                      <AdminCommentCard
                        comment={comment}
                        blogId={selectedCommentsBlog as string}
                      />
                    </div>
                  ))
                )}
                {hasCommentsNextPage && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={() => fetchCommentsNextPage()}
                      disabled={isFetchingCommentsNextPage}
                      className="h-10"
                    >
                      {isFetchingCommentsNextPage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                          Loading...
                        </>
                      ) : (
                        "Load More Comments"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>Blog Preview</DialogTitle>
            <DialogDescription>
              Preview the selected blog post.
            </DialogDescription>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-bold mb-2">
                  {selectedBlog.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {selectedBlog.category}
                  </span>
                  <span>•</span>
                  <span>{formatDate(selectedBlog.createdAt)}</span>
                  <span>•</span>
                  <span>{selectedBlog.readTime} min read</span>
                </div>
              </div>
              <BlogRenderer htmlContent={selectedBlog.content} />
              {selectedBlog.tags.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    {selectedBlog.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Comment Alert Dialog */}
      <Dialog
        open={!!commentToDelete}
        onOpenChange={(open) => !open && setCommentToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the comment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteComment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading more...
              </>
            ) : (
              "Load More Blogs"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
