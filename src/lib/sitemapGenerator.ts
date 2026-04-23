/**
 * Sitemap Generation Utilities
 * Use these functions to generate dynamic sitemaps from your blog data
 */

import { SITE_URL, BLOG_CATEGORIES } from "./seoConfig";

interface BlogPost {
  id: string;
  title: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Generate sitemap entry for a blog post
 */
export const getBlogSitemapEntry = (blog: BlogPost): string => {
  const lastmod = blog.updatedAt || blog.createdAt;
  return `  <url>
    <loc>${SITE_URL}/blogs/${blog.id}</loc>
    <lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
};

/**
 * Generate complete sitemap XML from blogs array
 */
export const generateSitemap = (blogs: BlogPost[]): string => {
  const blogEntries = blogs.map(getBlogSitemapEntry).join("\n");

  const categoryEntries = BLOG_CATEGORIES.map(
    (category) => `  <url>
    <loc>${SITE_URL}/blogs?category=${encodeURIComponent(category)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join("\n");

  const staticPages = `  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blogs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/faqs</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages}
${categoryEntries}
${blogEntries}
</urlset>`;
};

/**
 * Generate sitemap index for large sites (if you have multiple sitemaps)
 */
export const generateSitemapIndex = (
  sitemapUrls: string[]
): string => {
  const entries = sitemapUrls
    .map(
      (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
};
