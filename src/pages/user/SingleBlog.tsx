import BlogRenderer from "@/components/BlogRenderer";
import CommentSection from "@/components/CommentSection";
import Header from "@/components/Header";
import { useBlog, useBlogs, addView } from "@/hooks/serverState/useBlogServer";
import {
  Clock,
  Share2,
  Tag,
  Copy,
  Eye,
  ArrowRight,
  TrendingUp,
  Globe,
} from "lucide-react";
import Facebook from "@/components/icons/facebook";
import { Link, useNavigate, useParams } from "react-router";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Instagram from "@/components/icons/instagram";
import LinkedIn from "@/components/icons/linkedIn";
import Twitter from "@/components/icons/twitter";
import type { BlogQueryParams } from "./Blogs";
import SingleBlogSkeleton from "@/components/SingleBlogSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SEOHelmet from "@/components/SEOHelmet";
import { getBlogPostSchema } from "@/lib/seoConfig";
import { formatCompactNumber } from "@/lib/utils";
import Whatsapp from "@/components/icons/whatsapp";
import {BlogListSkeleton} from "@/components/BlogCardSkeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

const BLOG_VIEWED_KEY_PREFIX = "blog-viewed-";

const hasBlogBeenViewed = (id: string): boolean => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(`${BLOG_VIEWED_KEY_PREFIX}${id}`) !== null;
};

const markBlogAsViewed = (id: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${BLOG_VIEWED_KEY_PREFIX}${id}`, "true");
};

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { data: blog, isLoading: blogLoading } = useBlog(slug as string);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareMessage = `Check out this amazing blog: ${blog?.title}!`;
  const queryParams: BlogQueryParams = {
    limit: 3,
    deleted: false,
    published: true,
    sortBy: "-views",
  };
  if (blog) {
    queryParams.category = blog.category;
  }
  const { data: similarBlogsData, isLoading: loadingSimilarBlogs } =
    useBlogs(queryParams);
  const similarBlogs =
    similarBlogsData?.data.filter((blg) => blg?.id !== blog?.id) || [];

  useEffect(() => {
    if (!blog?.id || blogLoading) return;
    if (!hasBlogBeenViewed(blog.id)) {
      addView(blog.id).catch(() => {});
      markBlogAsViewed(blog.id);
    }
  }, [blog?.id, blogLoading]);

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedMessage = encodeURIComponent(shareMessage);
    const shareText = `${shareMessage} ${currentUrl}`;

    let shareUrl = "";

    // Safe clipboard copy that ignores errors
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {
        // Silently ignore clipboard errors
      }
    };

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        await copyToClipboard();
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        await copyToClipboard();
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
        break;
      case "instagram": {
        // Open Instagram website synchronously first to avoid popup blockers
        // This must happen before any async operations
        const instagramWebsiteUrl = "https://instagram.com";
        const anchor = document.createElement("a");
        anchor.href = instagramWebsiteUrl;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // Then copy to clipboard and show notification async
        await copyToClipboard();
        toast.success("Blog link copied! Opening Instagram...");

        // Close the share dialog
        setShareDialogOpen(false);

        // Check if on mobile before trying app schemes
        // On desktop, Instagram app is unlikely to be installed
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Try to open Instagram app using various schemes (best effort, mobile only)
        if (isMobile) {
          const instagramSchemes = [
            "instagram://camera",
            "instagram://app",
            "instagram://",
          ];

          for (const scheme of instagramSchemes) {
            try {
              const anchor = document.createElement("a");
              anchor.href = scheme;
              anchor.target = "_blank";
              anchor.rel = "noopener noreferrer";
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
              break;
            } catch {
              // Scheme failed, continue to next
            }
          }
        }
        break;
      }
    }

    if (shareUrl) {
      try {
        window.open(shareUrl, "_blank");
      } catch (err) {
        console.error("Failed to open share window:", err);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <>
      {blog && (
        <SEOHelmet
          title={blog.title}
          description={blog.description || blog.title}
          keywords={`${blog.category}, ${blog.tags?.join(", ") || ""}, blog, article`}
          url={currentUrl}
          canonicalUrl={currentUrl}
          type="article"
          author={`${blog.author.firstName} ${blog.author.lastName}`}
          publishedDate={new Date(blog.createdAt).toISOString()}
          modifiedDate={new Date(blog.updatedAt || blog.createdAt).toISOString()}
        >
          <script type="application/ld+json">
            {JSON.stringify(getBlogPostSchema(blog))}
          </script>
        </SEOHelmet>
      )}
      <Header />
      <div className="container py-10">
        {blogLoading ? (
          <SingleBlogSkeleton />
        ) : blog ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Blog Content */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {blog.category}
                  </span>
                  <div className="flex text-sm md:text-base items-center gap-1 text-muted-foreground">
                    <Clock size={16} />
                    <span>{blog.readTime} min read</span>
                  </div>
                  {blog.views !== undefined && (
                    <div className="flex text-sm md:text-base items-center gap-1 text-muted-foreground">
                      <Eye size={16} />
                      <span>
                        {formatCompactNumber(blog.views)}{" "}
                        {blog.views === 1 ? "view" : "views"}
                      </span>
                    </div>
                  )}
                  <Dialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex text-sm md:text-base items-center gap-2.5 text-muted-foreground hover:text-primary cursor-pointer"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setShareDialogOpen(true);
                          }
                        }}
                      >
                        <Share2 size={20} />
                        <p>Share</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Share Blog
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-3 gap-4 py-4">
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 p-4 h-auto hover:text-blue-600 hover:border-blue-200 transition-all"
                          onClick={() => handleShare("facebook")}
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="size-6" />
                          <span className="text-sm">Facebook</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 p-4 h-auto hover:text-blue-400 hover:border-blue-400 transition-all"
                          onClick={() => handleShare("twitter")}
                          aria-label="Share on Twitter"
                        >
                          <Twitter className="size-6" />
                          <span className="text-sm">Twitter</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 p-4 h-auto hover:text-blue-700 hover:border-blue-700 transition-all"
                          onClick={() => handleShare("linkedin")}
                          aria-label="Share on LinkedIn"
                        >
                          <LinkedIn className="size-6" />
                          <span className="text-sm">LinkedIn</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 p-4 h-auto hover:text-green-500 hover:border-green-500 transition-all"
                          onClick={() => handleShare("whatsapp")}
                          aria-label="Share on WhatsApp"
                        >
                          <Whatsapp className="size-6" />
                          <span className="text-sm">WhatsApp</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 p-4 h-auto hover:text-pink-500 hover:border-pink-500 transition-all"
                          onClick={() => handleShare("instagram")}
                          aria-label="Share on Instagram"
                        >
                          <Instagram className="size-6" />
                          <span className="text-sm">Instagram</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 p-4 h-auto hover:bg-muted hover:text-muted-foreground hover:border-gray-500 transition-all"
                          onClick={handleCopyLink}
                          aria-label="Copy link"
                        >
                          <Copy className="size-6" />
                          <span className="text-sm">Copy Link</span>
                        </Button>
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Share this Blog with your friends and family!
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  {blog?.title}
                </h1>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={blog.author.profilePicture} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(
                          blog.author.firstName,
                          blog.author.lastName,
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium">
                      {blog?.author?.firstName} {blog?.author?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <BlogRenderer htmlContent={blog?.content} />
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-muted-foreground" />
                  <span className="font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <CommentSection blogId={blog?.id as string} />
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <Tag size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold">Similar Blog Posts</h2>
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loadingSimilarBlogs ? <BlogListSkeleton count={3} /> : similarBlogs?.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
              </div>
            </div>

            {/* Marketing Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card
                  size="sm"
                  className="border-primary/20 bg-linear-to-br from-primary/5 to-background animate-sidebar-pulse"
                >
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe size={18} className="text-primary" />
                      Unlock Your Digital Potential
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A powerful website is the ultimate weapon for wealth,
                      credibility, and unstoppable growth. Discover why your
                      business cannot afford to be left behind.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full" variant="default">
                      <Link to="/website-benefits">
                        Explore Website Benefits{" "}
                        <ArrowRight size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card
                  size="sm"
                  className="border-primary/20 bg-linear-to-br from-primary/5 to-background animate-sidebar-pulse"
                >
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp size={18} className="text-primary" />
                      Shape Your Digital Future
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Take our quick survey and discover how a website can
                      transform your business. Get personalized insights in
                      minutes.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/website-survey">
                        Take the Survey{" "}
                        <ArrowRight size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <Card size="sm" className="text-center p-4">
              <CardTitle className="text-lg font-medium mb-2">
                No blog post found
              </CardTitle>
              <CardDescription className="text-muted-foreground mb-4">
                Try going back to the blog page
              </CardDescription>
              <Button variant="outline" onClick={() => navigate("/blog")}>
                Go back to blog
              </Button>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SingleBlog;
