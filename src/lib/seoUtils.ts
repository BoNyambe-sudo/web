/**
 * SEO Best Practices and Performance Utilities
 * Helpers for implementing advanced SEO features
 */

/**
 * Generate breadcrumb navigation for SEO
 */
export interface Breadcrumb {
  name: string;
  url: string;
}

export const generateBreadcrumbs = (path: string): Breadcrumb[] => {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [
    { name: "Home", url: "/" },
  ];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      name: name,
      url: currentPath,
    });
  });

  return breadcrumbs;
};

/**
 * Calculate and optimize heading hierarchy for SEO
 */
export const validateHeadingHierarchy = (headings: { level: number; text: string }[]): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Should start with h1
  if (headings.length === 0) {
    issues.push("No headings found on page");
  } else if (headings[0].level !== 1) {
    issues.push("Page should start with an h1 heading");
  }

  // Check for hierarchy
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level;
    const curr = headings[i].level;
    if (curr > prev + 1) {
      issues.push(
        `Invalid heading hierarchy: h${prev} followed by h${curr}`
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Generate meta description with optimal character count
 */
export const generateOptimalMetaDescription = (
  text: string,
  maxLength: number = 160
): string => {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  // Find last complete word within limit
  let truncated = trimmed.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    truncated = truncated.substring(0, lastSpace);
  }
  return truncated + "...";
};

/**
 * Analyze SEO readability score
 */
export const calculateReadabilityScore = (text: string): {
  score: number;
  grade: string;
  recommendations: string[];
} => {
  const recommendations: string[] = [];
  let score = 100;

  // Average sentence length (optimal: 15-20 words)
  const sentences = text.match(/[.!?]+/g) || [];
  const words = text.split(/\s+/).length;
  const avgSentenceLength = words / sentences.length;

  if (avgSentenceLength > 20) {
    score -= 10;
    recommendations.push("Consider breaking long sentences into shorter ones");
  }
  if (avgSentenceLength < 10) {
    score -= 5;
    recommendations.push("Some sentences are too short; add more context");
  }

  // Paragraph length (optimal: 50-100 words)
  const paragraphs = text.split(/\n\n+/);
  const avgParagraphLength = words / paragraphs.length;

  if (avgParagraphLength > 150) {
    score -= 15;
    recommendations.push("Break longer paragraphs into smaller chunks");
  }

  // Keywords density check
  const keywordMatch = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  const uniqueKeywords = new Set(keywordMatch);
  const keywordDensity = (keywordMatch.length / uniqueKeywords.size) * 100;

  if (keywordDensity < 5) {
    score -= 10;
    recommendations.push("Increase keyword usage slightly for better SEO");
  }
  if (keywordDensity > 20) {
    score -= 15;
    recommendations.push("Reduce keyword density to avoid keyword stuffing");
  }

  let grade = "Good";
  if (score >= 90) grade = "Excellent";
  else if (score >= 70) grade = "Good";
  else if (score >= 50) grade = "Fair";
  else grade = "Poor";

  return {
    score,
    grade,
    recommendations,
  };
};

/**
 * Generate image alt text best practices
 */
export const validateImageAltText = (altText: string): boolean => {
  // Alt text should be:
  // 1. Not empty
  // 2. Not too long (120 characters max)
  // 3. Descriptive and not keyword stuffed
  const minLength = 5;
  const maxLength = 120;

  return (
    altText.length >= minLength &&
    altText.length <= maxLength &&
    !altText.endsWith(",") &&
    !altText.endsWith(".")
  );
};

/**
 * Generate schema.org markup for common types
 */
export const generateLocalBusinessSchema = (business: {
  name: string;
  description: string;
  address: string;
  telephone: string;
  email: string;
  website: string;
  latitude?: number;
  longitude?: number;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
    },
    telephone: business.telephone,
    email: business.email,
    url: business.website,
    ...(business.latitude &&
      business.longitude && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: business.latitude,
          longitude: business.longitude,
        },
      }),
  };
};

/**
 * Open Graph validation
 */
export const validateOpenGraphTags = (tags: Record<string, string>): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (!tags["og:title"]) issues.push("Missing og:title");
  if (!tags["og:description"]) issues.push("Missing og:description");
  if (!tags["og:image"]) issues.push("Missing og:image");
  if (!tags["og:type"]) issues.push("Missing og:type");

  if (tags["og:title"] && tags["og:title"].length > 60) {
    issues.push("og:title should be under 60 characters");
  }
  if (tags["og:description"] && tags["og:description"].length > 160) {
    issues.push("og:description should be under 160 characters");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};
