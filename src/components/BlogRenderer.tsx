import parse, {
  domToReact,
  Element,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

const BlogRenderer = ({
  htmlContent,
  className,
}: {
  htmlContent: string;
  className?: string;
}) => {
  const options: HTMLReactParserOptions = {
    replace(domNode: DOMNode) {
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
    <article
      className={cn(
        "prose prose-blue dark:prose-invert lg:prose-xl mx-auto py-10",
        className,
      )}
    >
      {parse(htmlContent, options)}
    </article>
  );
};

export default BlogRenderer;
