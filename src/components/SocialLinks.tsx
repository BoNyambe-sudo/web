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
import { facebookLink, instagramLink, linkedinLink, xLink } from "@/lib/constants";

type Props = {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
};

const socialLinks = [
  {
    title: "Facebook",
    href: facebookLink,
    icon: <Facebook className="size-3.5" />,
  },
  {
    title: "X",
    href: xLink,
    icon: <Twitter className="size-3.5" />,
  },
  {
    title: "Instagram",
    href: instagramLink,
    icon: <Instagram className="size-3.5" />,
  },
  {
    title: "Linkedin",
    href: linkedinLink,
    icon: <LinkedIn className="size-3.5" />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center justify-center gap-3 p-4", className)}>
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
