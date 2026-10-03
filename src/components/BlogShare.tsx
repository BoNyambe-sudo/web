import * as React from "react";
import { Check, Copy, Share2 } from "lucide-react";
import Facebook from "./icons/Facebook";
import LinkedIn from "./icons/LinkedIn";
import Twitter from "./icons/Twitter";
import Whatsapp from "./icons/Whatsapp";

interface BlogShareProps {
  title: string;
  url: string;
}

const shareLinkClass =
  "inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function BlogShare({ title, url }: BlogShareProps) {
  const [copied, setCopied] = React.useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    await copyLink();
  };

  return (
    <div className="my-6 flex flex-wrap items-center gap-2 border-y border-border py-4">
      <span className="mr-1 inline-flex items-center gap-2 text-sm font-semibold">
        <Share2 className="size-4 text-primary" aria-hidden="true" />
        Share
      </span>
      <button
        type="button"
        onClick={share}
        className={shareLinkClass}
        aria-label="Share this article"
      >
        <Share2 className="size-4" aria-hidden="true" />
        More
      </button>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className={shareLinkClass}
        aria-label="Share on Facebook"
      >
        <Facebook className="size-4" aria-hidden="true" />
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className={shareLinkClass}
        aria-label="Share on LinkedIn"
      >
        <LinkedIn className="size-4" aria-hidden="true" />
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        className={shareLinkClass}
        aria-label="Share on X"
      >
        <Twitter className="size-4" aria-hidden="true" />X
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        className={shareLinkClass}
        aria-label="Share on WhatsApp"
      >
        <Whatsapp className="size-4" aria-hidden="true" />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={copyLink}
        className={shareLinkClass}
        aria-label="Copy article link"
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
