
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleUserRound, Lock } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md animate-fade-in">
        <div className="flex items-center justify-center mb-6 relative">
          <CircleUserRound className="w-16 h-16 text-myers-yellow opacity-50" />
          <Lock className="absolute w-8 h-8 text-myers-blue opacity-50" />
        </div>
        
        <h1 className="text-6xl font-bold font-poppins mb-2">404</h1>
        <p className="text-2xl font-medium mb-4">Page Not Found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
