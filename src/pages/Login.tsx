
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SplashScreen from "@/components/SplashScreen";

const Login: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showingSplash, setShowingSplash] = useState(true);

  useEffect(() => {
    // Add a delay to show the splash screen
    const timer = setTimeout(() => {
      setShowingSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (showingSplash) {
    return <SplashScreen onComplete={() => setShowingSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E3E4E4] p-4">
      <LoginForm />
    </div>
  );
};

export default Login;
