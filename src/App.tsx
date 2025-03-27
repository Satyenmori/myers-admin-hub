
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ManageSupportEngineers from "./pages/ManageSupportEngineers";
import Dispensaries from "./pages/Dispensaries";
import ServiceRequests from "./pages/ServiceRequests";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import ForgotPassword from "./pages/ForgotPassword";
import AddEditUser from "./pages/AddEditUser";
import AddEditSupportEngineer from "./pages/AddEditSupportEngineer";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Protected Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/add" element={<AddEditUser />} />
                  <Route path="/users/edit/:userId" element={<AddEditUser />} />
                  <Route path="/manage-support-engineers" element={<ManageSupportEngineers />} />
                  <Route path="/manage-support-engineers/add" element={<AddEditSupportEngineer />} />
                  <Route path="/manage-support-engineers/edit/:engineerId" element={<AddEditSupportEngineer />} />
                  <Route path="/dispensaries" element={<Dispensaries />} />
                  <Route path="/service-requests" element={<ServiceRequests />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
