import { Card } from "../components/ui/card";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
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
  );
};

export default NotFoundPage;
