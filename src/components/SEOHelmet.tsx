import { Helmet } from "react-helmet-async";
import { getOrganizationSchema, SITE_NAME, SITE_URL } from "@/lib/seoConfig";

interface SEOHelmetProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "blog";
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  canonicalUrl?: string;
  children?: React.ReactNode;
}

export default function SEOHelmet({
  title,
  description,
  keywords,
  image,
  url = SITE_URL,
  type = "website",
  author,
  publishedDate,
  modifiedDate,
  canonicalUrl,
  children,
}: SEOHelmetProps) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} - ${SITE_NAME}`;
  const canonicalHref = canonicalUrl || url || SITE_URL;
  const resolvedImage = image || `${SITE_URL}favicon.svg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author || SITE_NAME} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalHref} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      {publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={resolvedImage} />
      <meta name="twitter:creator" content="@franknyambe213" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getOrganizationSchema())}
      </script>

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href={`${SITE_URL}favicon.svg`} />
      <link rel="apple-touch-icon" href={`${SITE_URL}favicon.svg`} />
      <meta name="theme-color" content="#0f172a" />

      {children}
    </Helmet>
  );
}
