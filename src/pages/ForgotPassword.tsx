
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import logo from "../images/myerslogo.webp";
import { toast } from "@/hooks/use-toast";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
      toast({
        title: "Reset link sent",
        description: "Please check your email for the password reset link.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <div className="w-full max-w-md mx-auto glass-card shadow-lg relative overflow-hidden">
        {/* Curved divider */}
        <div className="absolute w-full h-full">
          <div className="h-1/2 bg-gray-900"></div>
          <div className="h-1/2 bg-white"></div>
          <div className="absolute left-0 right-0 h-16 top-1/2 -mt-8 overflow-hidden">
            <div className="w-full h-16 bg-white rounded-t-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6 relative">
              <img
                src={logo}
                alt="Myers Security Logo"
                className="h-20 w-40 text-myers-blue animate-float"
              />
            </div>
            <h1 className="text-3xl font-poppins font-bold mb-2 text-white">Forgot Password</h1>
            <p className="text-gray-300">
              Enter your email to reset your password
            </p>
          </div>

          <div className="mt-8">
            {!resetSent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="form-label block text-gray-600">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input pl-10"
                      placeholder="admin@myerssecurity.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4 text-myers-blue">
                  <Mail className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-medium mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to {email}
                </p>
                <button
                  onClick={() => setResetSent(false)}
                  className="text-myers-blue hover:underline inline-flex items-center"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Resend email
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link to="/login" className="text-myers-blue hover:underline inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
