import { Card } from "../components/ui/card";
import { Link } from "react-router";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL } from "@/lib/seoConfig";

const NotFoundPage = () => {
  return (
    <>
      <SEOHelmet
        title="Page Not Found - Bo Nyambe"
        description="The page you're looking for doesn't exist. Return to Bo Nyambe's homepage for web development, mobile app development, and AI solutions."
        url={`${SITE_URL}/404`}
        canonicalUrl={`${SITE_URL}/404`}
      />
      <div className="container py-12">
        <Card className="p-8 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-6">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Go back to Home
          </Link>
        </Card>
      </div>
    </>
  );
};

export default NotFoundPage;
