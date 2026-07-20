/**
 * SEO Configuration and Utilities
 * Centralized SEO keywords, categories, and metadata
 */

import { facebookLink, instagramLink, linkedinLink, xLink } from "./constants";

export const SITE_NAME = "Bo Nyambe";
export const SITE_URL = "https://bonyambe-sudo.github.io/web/";
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

/**
 * Generate structured data for Organization
 */
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    image: `${SITE_URL}favicon.svg`,
    url: SITE_URL,
    logo: `${SITE_URL}favicon.svg`,
    description: SITE_DESCRIPTION,
    sameAs: [facebookLink, xLink, linkedinLink, instagramLink],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "franknyambe202205@gmail.com",
    },
  };
};
