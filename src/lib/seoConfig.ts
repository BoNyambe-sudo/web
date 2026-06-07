/**
 * SEO Configuration and Utilities
 * Centralized SEO keywords, categories, and metadata
 */

export const SITE_NAME = "Bo Nyambe";
export const SITE_URL = "https://bonyambe-sudo.github.io/web/";
export const SITE_DESCRIPTION =
  "Professional web, mobile, and AI development services. Expert in technology solutions for modern businesses.";

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
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: SITE_DESCRIPTION,
    sameAs: [
      "https://www.facebook.com/profile.php?id=61559651890241",
      "https://www.x.com/franknyambe213",
      "https://www.linkedin.com/in/frank-nyambe-79a633321",
      "https://www.instagram.com/f_nyambe?igsh=b2wzd2t4Y3YxdmVj",
    ],
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
