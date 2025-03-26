
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BreadcrumbNav from "./Breadcrumb";

const MainLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:pl-64">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6">
          {/* Overlay for mobile when sidebar is open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
          
          <BreadcrumbNav />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
