import { useEffect, useState } from "react";
import { AdminBreadcrumb } from "@/components/AdminBreadCrumb";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Save,
  MessageSquare,
  ExternalLink,
  BookOpen,
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
import {
  useBlog,
  type BlogType,
  type CommentType,
} from "@/hooks/clientState/useBlog";

//import { Loader2 } from "lucide-react";
import BlogRenderer from "@/components/BlogRenderer";
import { blogMetrics, sampleComments } from "@/temporalData";
import BlogsPerCategory, {
  type BlogsPerCategoryType,
} from "@/components/BlogsPerCategory";

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
  const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);
  const [createFormData, setCreateFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    category: "Technology",
    tags: "",
    published: false,
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
  const [editingComment, setEditingComment] = useState<CommentType | null>(
    null,
  );
  const [editCommentText, setEditCommentText] = useState("");

  const blogs = useBlog((state) => state.blogs);
  const comments = useBlog((state) => state.comments);
  const setComments = useBlog((state) => state.setComments);

  useEffect(() => {
    setComments(sampleComments);
  }, [setComments]);

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
  ];

  const handleCreateBlog = () => {
    if (!createFormData.title || !createFormData.content) return;

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

    setIsCreateDialogOpen(false);
    resetCreateForm();
  };

  const handleUpdateBlog = () => {
    if (!selectedBlog || !updateFormData.title || !updateFormData.content)
      return;

    const updatedBlog = {
      ...selectedBlog,
      title: updateFormData.title,
      content: updateFormData.content,
      category: updateFormData.category,
      tags: updateFormData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      published: updateFormData.published,
      image: updateFormData.image,
      readTime: calculateReadTime(updateFormData.content),
    };

    setIsEditDialogOpen(false);
    setSelectedBlog(null);
    resetUpdateForm();
  };

  const handleDeleteBlog = () => {
    if (blogToDelete) {
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const openDeleteDialog = (blogId: string) => {
    setBlogToDelete(blogId);
    setIsDeleteDialogOpen(true);
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

  const blogsPerCategory: BlogsPerCategoryType[] =
    blogs?.reduce((acc: BlogsPerCategoryType[], blog) => {
      const existingCategory = acc.find(
        (item) => item.category === blog.category,
      );
      if (existingCategory) {
        existingCategory.count++;
      } else {
        acc.push({ category: blog.category, count: 1 });
      }
      return acc;
    }, []) || [];

  const toggleBlogVisibility = (blog: BlogType) => {
    const updatedBlog: BlogType = {
      ...blog,
      published: !blog.published,
    };
  };

  // Comments handlers
  const handleViewComments = (blogId: string) => {
    setSelectedCommentsBlog(blogId);
    setIsCommentsDialogOpen(true);
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = () => {
    if (commentToDelete) {
      setCommentToDelete(null);
    }
  };

  const handleEditComment = (comment: CommentType) => {
    setEditingComment(comment);
    setEditCommentText(comment.content);
  };

  const handleUpdateComment = () => {
    if (editingComment) {
      setEditingComment(null);
      setEditCommentText("");
    }
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  // Preview handler
  const handlePreviewBlog = (blog: BlogType) => {
    setSelectedBlog(blog);
    setIsPreviewDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <AdminBreadcrumb />
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <p className="text-muted-foreground mt-2">
          Manage your blog posts and view analytics
        </p>

        <div className="flex justify-end mb-6">
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
                      setCreateFormData({ ...createFormData, category: value })
                    }
                  >
                    <SelectTrigger>
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
                <Button onClick={handleCreateBlog}>
                  <Save className="mr-2 h-4 w-4" />
                  Create Blog
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogMetrics.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">
              {blogMetrics.totalBlogs > 0 ? "Total blogs" : "No blogs"}
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
              {blogMetrics.publishedBlogs}
            </div>
            <p className="text-xs text-muted-foreground">
              {blogMetrics.publishedBlogs > 0
                ? "Published blogs"
                : "No published blogs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Deleted Blogs</CardTitle>
            <Trash2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogMetrics.drafts}</div>
            <p className="text-xs text-muted-foreground">
              {blogMetrics.drafts > 0 ? "Deleted blogs" : "No deleted blogs"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        {/* Blogs per category */}
        <BlogsPerCategory blogsPerCategory={blogsPerCategory} />
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
                  <TableCell className="font-medium">{blog.title}</TableCell>
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

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog
                              open={
                                isDeleteDialogOpen && blogToDelete === blog.id
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
                                    Are you sure you want to delete this blog?
                                    This action cannot be undone.
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
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
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
                <SelectTrigger>
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
              {/* Show existing thumbnail if no new file is selected */}
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
            <Button onClick={handleUpdateBlog}>
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
            <DialogTitle>Blog Comments</DialogTitle>
            <DialogDescription>
              Manage comments for this blog post.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No comments yet.</p>
              </div>
            ) : (
              comments?.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">
                        {comment.author.firstName} {comment.author.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(comment?.createdAt as Date)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditComment(comment)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteComment(comment.id as string)
                              }
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  {editingComment?.id === comment.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        placeholder="Edit comment..."
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEditComment}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUpdateComment}
                          disabled={!editCommentText.trim()}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {comment?.content}
                    </p>
                  )}
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide">
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
      {/* {hasNextPage && (
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
      )} */}
    </div>
  );
};

export default AdminBlogs;
