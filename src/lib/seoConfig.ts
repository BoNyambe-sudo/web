import { facebookLink, instagramLink, linkedinLink, xLink } from "./constants";

export const SITE_NAME = "Bo Nyambe";
export const SITE_URL = "https://bonyambe-sudo.github.io/web/";
export const SITE_DESCRIPTION =
  "Bo Nyambe builds fast, SEO-optimized websites, with Astro, NestJS and Angular, that rank well and convert visitors into customers. Serving Zambian and global clients, Bo Nyambe is your trusted partner for web development and digital solutions.";

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

export const getDescriptionForCategory = (category: string): string => {
  return `Explore insightful articles and discussions about ${category}. Expert insights, tips, and latest trends in ${category}.`;
};

export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    image: `${SITE_URL}favicon.svg`,
    url: SITE_URL,
    logo: `${SITE_URL}favicon.svg`,
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressCountry: "ZM",
      addressLocality: "Lusaka",
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Zambia",
      },
    ],
    knowsAbout: [
      "Web Development",
      "SEO Optimization",
      "Digital Marketing",
      "Web Design",
      "Typescript",
      "Angular",
      "NestJS",
      "Astro",
      "Node.js",
      "JavaScript",
      "HTML",
      "CSS",
      "UI/UX Design",
      "Software Engineering",
    ],
    sameAs: [facebookLink, xLink, linkedinLink, instagramLink],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "franknyambe202205@gmail.com",
    },
  };
};

export const getBlogListSchema = (category?: string, blogCount: number = 0) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category ? `${category} Blog Articles` : "Blog - " + SITE_NAME,
    description: category
      ? getDescriptionForCategory(category)
      : SITE_DESCRIPTION,
    url: SITE_URL + "blog",
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
          url: SITE_URL + "blog",
        })),
    },
  };
};

export const getBlogPostSchema = (blog: {
  id?: string;
  slug?: string;
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
        url: `${SITE_URL}favicon.svg`,
      },
    },
    inLanguage: "en-US",
    url: `${SITE_URL}blog/${blog.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}blog/${blog.slug}`,
    },
    articleSection: blog.category,
    keywords: blog.tags?.join(", "),
    wordCount: blog.content
      ? blog.content
          .replace(/<[^>]+>/g, "")
          .trim()
          .split(/\s+/).length
      : undefined,
    timeRequired: blog.readTime ? `PT${blog.readTime}M` : undefined,
  };
};

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
