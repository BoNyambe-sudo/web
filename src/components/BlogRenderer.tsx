import { useState, useEffect } from "react";
import parse, {
  domToReact,
  Element,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table as ShadcnTable,
  TableHeader as ShadcnTableHeader,
  TableBody as ShadcnTableBody,
  TableRow as ShadcnTableRow,
  TableHead as ShadcnTableHead,
  TableCell as ShadcnTableCell,
} from "@/components/ui/table";

const BlogRenderer = ({
  htmlContent,
  className,
  scrollContainerRef,
}: {
  htmlContent: string;
  className?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const target = scrollContainerRef?.current;
    if (target) {
      const handleScroll = () => {
        setShowBackToTop(target.scrollTop > 300);
      };
      target.addEventListener("scroll", handleScroll);
      return () => target.removeEventListener("scroll", handleScroll);
    } else {
      const handleScroll = () => {
        setShowBackToTop(window.scrollY > 300);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [scrollContainerRef]);
  const options: HTMLReactParserOptions = {
    replace(domNode: DOMNode) {
      if (domNode instanceof Element && domNode.tagName === "table") {
        const compatibleChildren = domNode.children.filter(
          (child): child is DOMNode => "type" in child,
        );
        return (
          <div className="my-6">
            <ShadcnTable>{domToReact(compatibleChildren)}</ShadcnTable>
          </div>
        );
      }

      if (domNode instanceof Element && domNode.tagName === "thead") {
        const compatibleChildren = domNode.children.filter(
          (child): child is DOMNode => "type" in child,
        );
        return (
          <ShadcnTableHeader>{domToReact(compatibleChildren)}</ShadcnTableHeader>
        );
      }

      if (domNode instanceof Element && domNode.tagName === "tbody") {
        const compatibleChildren = domNode.children.filter(
          (child): child is DOMNode => "type" in child,
        );
        return (
          <ShadcnTableBody>{domToReact(compatibleChildren)}</ShadcnTableBody>
        );
      }

      if (domNode instanceof Element && domNode.tagName === "tr") {
        const compatibleChildren = domNode.children.filter(
          (child): child is DOMNode => "type" in child,
        );
        return (
          <ShadcnTableRow>{domToReact(compatibleChildren)}</ShadcnTableRow>
        );
      }

      if (domNode instanceof Element && domNode.tagName === "th") {
        const compatibleChildren = domNode.children.filter(
          (child): child is DOMNode => "type" in child,
        );
        return (
          <ShadcnTableHead>{domToReact(compatibleChildren)}</ShadcnTableHead>
        );
      }

      if (domNode instanceof Element && domNode.tagName === "td") {
        const compatibleChildren = domNode.children.filter(
          (child): child is DOMNode => "type" in child,
        );
        return (
          <ShadcnTableCell>{domToReact(compatibleChildren)}</ShadcnTableCell>
        );
      }

      // 1. Handle Images: Add lazy loading and responsive wrappers
      if (domNode instanceof Element && domNode.tagName === "img") {
        const { src, alt } = domNode.attribs;
        return (
          <figure className="my-8">
            <img
              src={src}
              alt={alt || "Blog visual"}
              loading="lazy"
              className="rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              style={{ width: "100%", height: "auto" }}
            />
            {alt && (
              <figcaption className="text-center text-xs text-muted-foreground mt-2">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      }

      // 2. Handle Links: Ensure external links are secure
      if (domNode instanceof Element && domNode.tagName === "a") {
        const isExternal = domNode.attribs.href.startsWith("http");
        // Filter children to only include DOMNode types compatible with domToReact
        const compatibleChildren = domNode.children.filter(
          (child): child is DOMNode => "type" in child,
        );
        return isExternal ? (
          <a
            {...domNode.attribs}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/60 underline hover:text-primary"
          >
            {domToReact(compatibleChildren)}
          </a>
        ) : (
          <Link
            to={domNode.attribs.href}
            className="text-primary/60 underline hover:text-primary"
          >
            {domToReact(compatibleChildren)}
          </Link>
        );
      }
    },
  };

  return (
    <div className="relative">
      <article
        className={cn(
          "prose prose-blue dark:prose-invert lg:prose-xl mx-auto py-10",
          className,
        )}
      >
        {parse(htmlContent, options)}
      </article>
      {showBackToTop && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4"
          onClick={() => {
            if (scrollContainerRef?.current) {
              scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          aria-label="Back to top"
        >
          <ArrowUp />
        </Button>
      )}
    </div>
  );
};

export default BlogRenderer;
