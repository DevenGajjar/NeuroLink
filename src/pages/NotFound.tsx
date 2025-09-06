import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-poppins font-bold text-gradient-primary">404</h1>
          <p className="text-2xl font-semibold text-foreground mb-2">Page Not Found</p>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="therapeutic" asChild>
            <Link to="/">Return Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/chat">Get Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
