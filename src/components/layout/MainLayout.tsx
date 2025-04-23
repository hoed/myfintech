import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Check for sidebar collapse preference in localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, [navigate]);

  // Function to toggle sidebar state (not used anymore, but keep for potential sidebar collapse state management)
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && (
        <div className={`${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64'} transition-all duration-300 ease-in-out h-screen`}>
          <Sidebar />
        </div>
      )}
      <div className="flex-1 overflow-auto flex flex-col">
        <Header />
        <div className="flex-1 relative">
          {/* Remove sidebar arrow toggle button here */}
          <main className="p-4 md:p-6 flex-1">
            {children}
          </main>
        </div>
        <Footer />
      </div>
      {isMobile && <MobileSidebar />}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default MainLayout;
