
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CircleUserRound, Lock } from "lucide-react";
import logo from "../../images/myerslogo.webp"
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6 relative">
        <img src={logo} alt="User Avatar" className="h-20 w-40 text-myers-blue animate-float" />
          {/* <CircleUserRound className="w-16 h-16 text-myers-blue animate-float" /> */}
          {/* <Lock className="absolute w-8 h-8 text-myers-yellow" /> */}
        </div>
        <h1 className="text-3xl font-poppins font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      <div className="glass-card p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="form-label block">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@myerssecurity.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="form-label block">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter any password"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              For demo: use any of the predefined emails with any password
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Demo Accounts:
          </p>
          <div className="mt-2 text-xs space-y-1">
            <div><strong>Admin:</strong> admin@myerssecurity.com</div>
            <div><strong>Manager:</strong> manager@myerssecurity.com</div>
            <div><strong>User:</strong> user@myerssecurity.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
