import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import LinkedIn from "./icons/linkedIn";
import Facebook from "./icons/facebook";
import Twitter from "./icons/twitter";
import Instagram from "./icons/instagram";

type Props = {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
};

const socialLinks = [
  {
    title: "Facebook",
    href: "https://www.facebook.com/bonyambe",
    icon: <Facebook className="size-3.5" />,
  },
  {
    title: "X",
    href: "https://www.twitter.com/bonyambe",
    icon: <Twitter className="size-3.5" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/bonyambe",
    icon: <Instagram className="size-3.5" />,
  },
  {
    title: "Linkedin",
    href: "https://www.linkedin.com/in/bonyambe",
    icon: <LinkedIn className="size-3.5" />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLinks?.map((item) => {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <a
                  className={cn(
                    "p-2 border rounded-full hover:text-foreground hover:border-primary/80 hoverEffect",
                    iconClassName,
                  )}
                  href={item.href}
                >
                  {item.icon}
                </a>
              </TooltipTrigger>
              <TooltipContent
                className={cn(
                  "text-muted-foreground font-semibold bg-popover",
                  tooltipClassName,
                )}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
