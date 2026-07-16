/**
 * SEO Configuration and Utilities
 * Centralized SEO keywords, categories, and metadata
 */

import { facebookLink, instagramLink, linkedinLink, xLink } from "./constants";

export const SITE_NAME = "Bo Nyambe";
export const SITE_URL = "https://bonyambe-sudo.github.io/web";
export const SITE_DESCRIPTION =
  "Bo Nyambe builds fast, SEO-optimized NestJS and Angular websites and web apps that rank well and convert visitors into customers.";

export const BLOG_CATEGORIES = [
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

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Technology: [
    "web development",
    "mobile app development",
    "software engineering",
    "AI development",
    "machine learning",
    "cloud computing",
    "DevOps",
    "full stack development",
    "Code Newbie",
    "Junior Dev",
    "Beginners Guide",
    "Career Tips",
    "Self Taught",
    "Programming Basics",
    "Web Dev",
    "Software development",
    "Tech Tips",
    "JavaScript",
    "Python",
    "TypeScript 7.0 Release",
    "Go-Native TypeScript Compiler",
    "Project Corsa Microsoft",
    "Strada to Corsa Migration, tsc native port",
    "10x Faster Type-Checking",
    "TypeScript Parallelization Flags",
    "TypeScript checkers builders",
    "TypeScript 7.0 VS Code Integration",
    "TypeScript 6.0 compatibility side-by-side",
    "How to configure typescript6",
    "Go language compiler speedup",
    "ZESCO loadshedding developer energy conservation",
    "Low spec laptop programming RAM optimization",
    "TypeScript monorepo build speedup",
    "TypeScript deterministic type sorting",
    "stableTypeOrdering explanation",
    "TypeScript 7.0 breaking changes",
    "TypeScript 7.1 Programmatic API",
    "parcel file watcher Go port",
  ],
  Lifestyle: [
    "lifestyle tips",
    "daily routines",
    "personal development",
    "wellness",
    "productivity",
  ],
  Health: [
    "health tips",
    "fitness",
    "nutrition",
    "mental health",
    "wellness",
    "medical information",
  ],
  Photography: [
    "photography tips",
    "camera techniques",
    "photo editing",
    "visual storytelling",
  ],
  Sports: [
    "sports news",
    "athletic training",
    "fitness coaching",
    "sports analysis",
  ],
  Business: [
    "business strategy",
    "entrepreneurship",
    "startup tips",
    "marketing",
    "sales",
    "business development",
    "website security",
    "custom web development",
    "digital business asset",
    "platform risk mitigation",
    "NestJS Angular developer",
    "web development",
    "Web development services in Zambia",
    "SEO web design",
    "performance optimization",
    "Zambia web developer",
    "website development Zambia",
    "website design Zambia",
    "software development Zambia",
    "web developer Lusaka",
    "responsive web design",
    "ecommerce website Zambia",
    "SEO services Zambia",
    "custom software development",
    "WordPress development Zambia",
  ],
  Religious: [
    "faith",
    "spirituality",
    "religious insights",
    "personal growth",
    "community",
    "What is the Mark of the Beast",
    "National Sunday Law",
    "Daniel and Revelation Prophecy",
    "Project 2025 Sunday Rest",
    "Sabbath vs Sunday in Prophecy",
    "Sabbath vs Sunday in Prophecy",
    "Jesuit influence in American institutions",
    "The role of the Catholic Church in end-time events",
    "The significance of the Papacy in biblical prophecy",
    "Liberty of conscience threatened",
    "Heritage Foundation uniform day of rest",
    "Vicarius Filii Dei 666 calculation",
    "The Mark of the Beast and modern technology",
    "The role of the United States in end-time prophecy",
    "The importance of religious freedom in the context of end-time events",
    "The connection between the Mark of the Beast and economic control",
    "The significance of the number 666 in biblical prophecy",
    "The role of the Catholic Church in shaping global events",
    "The impact of religious persecution on end-time events",
    "The importance of understanding biblical prophecy for modern believers",
    "The connection between the Mark of the Beast and the rise of authoritarianism",
    "The significance of the Papacy in shaping world history",
    "The role of religious institutions in end-time events",
    "The importance of staying informed about current events in the context of biblical prophecy",
    "The connection between the Mark of the Beast and the rise of global surveillance",
    "The significance of the number 666 in popular culture",
    "The role of the Catholic Church in influencing political decisions",
    "The impact of religious beliefs on end-time events",
    "The importance of maintaining faith and hope in the face of end-time challenges",
    "The connection between the Mark of the Beast and the rise of cashless societies",
    "The significance of the Papacy in shaping religious beliefs",
    "The role of religious leaders in end-time events",
    "The importance of understanding the historical context of biblical prophecy",
    "The connection between the Mark of the Beast and the rise of digital currencies",
    "The significance of the number 666 in literature and media",
    "The role of the Catholic Church in shaping cultural norms",
    "The impact of religious beliefs on social and political movements",
    "The importance of staying vigilant in the face of end-time challenges",
    "The connection between the Mark of the Beast and the rise of global governance",
    "The significance of the Papacy in shaping religious practices",
    "The role of religious institutions in providing support during end-time events",
    "The importance of understanding the spiritual implications of biblical prophecy",
    "The connection between the Mark of the Beast and the rise of authoritarian regimes",
    "The significance of the number 666 in religious symbolism",
    "The role of the Catholic Church in shaping moral values",
    "The impact of religious beliefs on humanitarian efforts during end-time events",
    "The importance of maintaining a strong faith community in the face of end-time challenges",
    "Dignitatis Humanae church state separation",
    "Ellen G White Great Controversy Sunday Law",
    "Jesuit Infiltration in American Institutions",
  ],
  Politics: ["political analysis", "current events", "policy discussion"],
  Science: [
    "scientific research",
    "innovation",
    "discoveries",
    "technology advances",
  ],
  Art: ["art techniques", "creative process", "artistic expression"],
  Music: [
    "music production",
    "music theory",
    "artist interviews",
    "music reviews",
  ],
  "Film & TV": [
    "film reviews",
    "TV show analysis",
    "entertainment news",
    "cinematography",
    "Power Book II Ghost Review",
    "Is Power Book 2 worth watching",
    "Power Book 2 vs Original Power",
    "Tariq St Patrick character arc",
    "Power Book 2 finale explained",
    "Erick Stark",
    "Power Book 2 Ghost season 2 predictions",
    "Power Book 2 Ghost season 3 theories",
    "Power Book 2 Ghost best episodes",
    "Power Book 2 Ghost worst episodes",
    "Power Book 2 Ghost character analysis",
    "Power Book 2 Ghost plot twists",
    "Power Book 2 Ghost fan theories",
    "Power Book 2 Ghost Easter eggs",
    "Power Book 2 Ghost behind the scenes",
    "Power Book 2 Ghost cast interviews",
    "Power Book 2 Ghost soundtrack review",
    "Power Book 2 Ghost cinematography analysis",
    "Power Book 2 Ghost writing style",
    "Power Book 2 Ghost themes and motifs",
    "Power Book 2 Ghost character development",
    "Power Book 2 Ghost social commentary",
    "Power Book 2 Ghost cultural impact",
    "Power Book 2 Ghost fan reactions",
    "Power Book 2 Ghost critical reception",
    "Power Book 2 Ghost awards and nominations",
    "Power Book 2 Ghost season 1 recap",
    "Power Book 2 Ghost season 2 recap",
    "Power Book 2 Ghost season 3 recap",
    "Power Book 2 Ghost season 4 predictions",
    "Power Book 2 Ghost season 5 theories",
    "Power Book 2 Ghost best moments",
    "Power Book 2 Ghost worst moments",
    "Power Book 2 Ghost character relationships",
    "Power Book 2 Ghost plot analysis",
    "Power Book 2 Ghost fan theories debunked",
    "Power Book 2 Ghost Easter eggs explained",
    "Power Book 2 Ghost behind the scenes insights",
    "Power Book 2 Ghost cast interviews highlights",
    "Power Book 2 Ghost soundtrack review and analysis",
    "Power Book 2 Ghost cinematography techniques",
    "Power Book 2 Ghost writing style breakdown",
    "Power Book 2 Ghost themes and motifs exploration",
    "Power Book 2 Ghost character development arcs",
    "Power Book 2 Ghost social commentary analysis",
    "Power Book 2 Ghost cultural impact discussion",
    "Power Book 2 Ghost fan reactions compilation",
    "Power Book 2 Ghost critical reception overview",
    "Power Book 2 Ghost awards and nominations summary",
    "Whiz Kid",
    "Lil Ghost",
    "Apex Predator",
    "Tariq Scam Patrick",
    "Power Book 2 spoilers",
    "Mary J Blige Power character",
    "Monet Tejada death",
    "Monet vs Tasha St Patrick",
    "Woody McClain Power",
    "Cane Tejada loyalty",
    "Cane vs Tariq rivalry",
    "Method Man Power",
    "Davis MacLean best moments",
    "Davis MacLean legal tactics",
    "Gianni Paolo Power",
    "Brayden Weston character arc",
    "Power Book 2 Ghost season 2 cast",
    "Power Book 2 Ghost season 3 cast",
    "Power Book 2 Ghost season 4 cast",
    "Power Book 2 Ghost season 5 cast",
    "Power Book 2 Ghost spin-offs",
    "Power Book 2 Ghost crossover episodes",
    "Power Book 2 Ghost fan theories about Tariq's future",
    "Power Book 2 Ghost fan theories about Monet's return",
    "Power Book 2 Ghost fan theories about Davis MacLean's fate",
    "Power Book 2 Ghost fan theories about Cane's loyalty",
    "Power Book 2 Ghost fan theories about Method Man's character development",
    "Power Book 2 Ghost fan theories about Gianni Paolo's role",
    "Power Book 2 Ghost fan theories about Brayden Weston's arc",
    "Power Book 2 Ghost fan theories about future cast members",
    "Tariq and Brayden partnership",
    "The aftermath of Ghost's murder",
    "Tariq and Tommy spinof",
    "Power Legacy release date",
    "will Tariq be in Power Legacy",
    "Michael Rainey Jr and Joseph Sikora team up",
    "Young Ghost and Tommy prequel",
    "Power Origins cast",
    "MeKai Curtis as Kanan in Origins",
    "origin of Ghost and Tommy",
    "Tariq and Brayden partnership",
    "Tariq and Brayden brotherhood",
    "Tejada siblings drug business",
    "The aftermath of Ghost's murde",
    "The trial and legal drama focus",
    "Global expansion with Noma",
    "The 'Ghost in the Machine' finale",
    "Why was Power Book 2 cancelled",
    "Starz money saving tactics",
    "Lionsgate Starz separation impact",
    "Jeffrey Hirsch Starz strategy",
    "Power Book 2 budget",
    "Mary J Blige salary Power",
    "cost of Power spinoffs",
    "Power Book 2 vs Original Power",
    "Power Book 2 vs Raising Kanan",
    "Power Book 2 vs Power Book 4",
    "Ghost spinoff vs Power",
    "Tariq and Tommy spinoff",
    "Power Legacy release date",
    "will Tariq be in Power Legacy",
    "Michael Rainey Jr and Joseph Sikora team up",
    "Young Ghost and Tommy preque",
    "Power Origins cast",
    "MeKai Curtis as Kanan in Origins",
    "origin of Ghost and Tommy",
    "How Power Book 2 sets up Power Legacy",
    "Tariq St Patrick future in Power universe",
    "Is Tariq the new Ghost",
    "Omari Hardwick return in Book 2",
    "Ghost vs Tariq comparison",
    "did Tariq ruin the Power legacy",
    "Legacy, betrayal, and the 'Ghost' moniker",
    "Most shocking deaths Power Book 2",
    "Tariq St Patrick outfits",
    "Power Book 2 best moments",
    "is Power Book 2 entertaining",
    "Spectacle",
    "fashion",
    "vibes",
    "Tariq St Patrick plot armor",
    "Power Book 2 unrealistic writing",
    "Reddit Power TV theories",
    "Cane Tejada vs Tariq debate",
    "Realism",
    "plot holes",
    "community consensus",
    "Does Monet Tejada die?",
    "Who killed Zion in Power Book 2?",
    "Where to watch Power Book 2?",
    "Is Lauren Baldwin alive?",
    "Power Book II entertaining as hell",
    "best spinoff in the universe",
    "must-watch for Power fans",
    "Tariq St Patrick aura",
    "Objectively awful writing",
    "Tariq is an insufferable lead",
    "waste of a spinof",
    "rushed finale disappointment",
    "Power Book II ratings 2026",
    "where to stream Power spinoffs",
    "Power Book 2 season 4 part 2 schedule",
    "Power universe chronological order",
    "Is Power Book 2 worth the hype",
    " honest Power Book 2 review",
    "Tariq St Patrick plot armor",
    "Power Book 2 soap opera criticism",
    "Power Legacy release date 2027",
    " Power Origins prequel cast",
    "Power Book 2 vs Raising Kanan",
    "best order to watch Power spinoffs",
    "Ghost in the Machine finale explained",
    "Power Book 2 cancellation reason",
    "Tariq and Brayden murder Zion",
    "who died in Power Book 2 season 4",
    "Michael Rainey Jr acting growth",
    "Brayden Weston character development",
    "Monet Tejada legacy",
  ],
  Fashion: [
    "fashion trends",
    "style tips",
    "clothing advice",
    "fashion design",
  ],
  Food: [
    "recipes",
    "food reviews",
    "cooking tips",
    "culinary techniques",
    "food culture",
  ],
  Travel: [
    "travel guides",
    "destination reviews",
    "travel tips",
    "adventure planning",
  ],
  Finance: [
    "financial planning",
    "investment advice",
    "cryptocurrency",
    "personal finance",
  ],
  Education: [
    "learning tips",
    "educational resources",
    "online courses",
    "skill development",
  ],
  Productivity: [
    "productivity tips",
    "time management",
    "workflow optimization",
    "task management",
    "focus techniques",
    "efficiency strategies",
    "Procrastination",
    "Habit Stacking",
    "5 Second Rule",
    "James Clear",
    "Mel Robbins",
    "Neuroscience",
    "Metacognition",
    "Behavior Change",
    "Self-Regulatory Failure",
  ],
  Entertainment: [
    "entertainment news",
    "celebrity updates",
    "event coverage",
    "industry insights",
  ],
};

/**
 * Generate primary keywords from a category
 */
export const getKeywordsForCategory = (category: string): string => {
  const categoryKeywords = CATEGORY_KEYWORDS[category] || [];
  return [category, ...categoryKeywords].join(", ");
};

/**
 * Generate meta description for category pages
 */
export const getDescriptionForCategory = (category: string): string => {
  return `Explore insightful articles and discussions about ${category}. Expert insights, tips, and latest trends in ${category}.`;
};

/**
 * Generate structured data for Organization
 */
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    image: `${SITE_URL}/favicon.svg`,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: SITE_DESCRIPTION,
    sameAs: [facebookLink, xLink, linkedinLink, instagramLink],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "franknyambe202205@gmail.com",
    },
  };
};

/**
 * Generate structured data for Blog List
 */
export const getBlogListSchema = (category?: string, blogCount: number = 0) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category ? `${category} Blog Articles` : "Blog - " + SITE_NAME,
    description: category
      ? getDescriptionForCategory(category)
      : SITE_DESCRIPTION,
    url: SITE_URL + "/blogs",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: Array(blogCount)
        .fill(null)
        .map((_, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: SITE_URL + "/blogs",
        })),
    },
  };
};

/**
 * Generate structured data for Blog Post
 */
export const getBlogPostSchema = (blog: {
  id?: string;
  title: string;
  content?: string;
  description?: string;
  category?: string;
  author: {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
  };
  thumbnail: string;
  tags?: string[];
  readTime?: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}) => {
  // Ensure dates are in ISO string format
  const datePublished =
    blog.createdAt instanceof Date
      ? blog.createdAt.toISOString()
      : blog.createdAt || new Date().toISOString();

  const dateModified =
    blog.updatedAt instanceof Date
      ? blog.updatedAt.toISOString()
      : blog.updatedAt || datePublished;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description || blog.title,
    image: {
      "@type": "ImageObject",
      url: blog.thumbnail,
      width: 1200,
      height: 630,
    },
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name:
        `${blog.author?.firstName || ""} ${blog.author?.lastName || ""}`.trim() ||
        SITE_NAME,
      image: blog.author?.profilePicture
        ? {
            "@type": "ImageObject",
            url: blog.author.profilePicture,
          }
        : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blogs/${blog.id}`,
    },
    articleSection: blog.category,
    keywords: blog.tags?.join(", "),
    wordCount: blog.content ? blog.content.split(/\s+/).length : undefined,
    timeRequired: blog.readTime ? `PT${blog.readTime}M` : undefined,
  };
};

/**
 * Generate structured data for FAQ
 */
export const getFAQSchema = (
  faqs: Array<{ question: string; answer: string }>,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate breadcrumb schema
 */
export const getBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};
