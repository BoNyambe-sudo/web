import { type BlogType } from "@/hooks/clientState/useBlog";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/formattedDate";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BlogRenderer from "@/components/BlogRenderer";
import { useBlogAnalytics, useBlogs } from "@/hooks/serverState/useBlogServer";
import { useFetchUserAnalytics } from "@/hooks/serverState/useUserServer";
import type { BlogQueryParams } from "../user/Blogs";
import { useAppointmentMetrics } from "@/hooks/serverState/userAppointmentServer";

const AdminHome = () => {
  const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const { data: blogsMetrics } = useBlogAnalytics();
  const { data: usersMetrics } = useFetchUserAnalytics();
  const { data: appointmentsMetrics } = useAppointmentMetrics();
  const queryParams: BlogQueryParams = { latest: true, deleted: false };
  const { data: blogsData, isLoading: blogsLoading } = useBlogs(queryParams);
  const blogs = blogsData?.data || [];

  const handlePreviewBlog = (blog: BlogType) => {
    setSelectedBlog(blog);
    setIsPreviewDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin dashboard
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogsMetrics?.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">
              {blogsMetrics && blogsMetrics?.totalBlogs > 0
                ? "Blogs"
                : "No blogs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersMetrics?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {usersMetrics && usersMetrics?.totalUsers > 0
                ? "Registered users"
                : "No users registered"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointmentsMetrics?.totalAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              {appointmentsMetrics && appointmentsMetrics?.totalAppointments > 0
                ? "Appointments"
                : "No appointments"}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Latest Blogs</h2>
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
                              onClick={() => handlePreviewBlog(blog)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Preview</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
};

export default AdminHome;
