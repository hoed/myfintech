
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
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
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}
      <div className="flex-1 overflow-auto flex flex-col md:ml-64"> {/* Add ml-64 for sidebar width */}
        <header className="border-b bg-white p-4 flex items-center md:hidden">
          <MobileSidebar />
          <div className="ml-3">
            <h1 className="text-lg font-medium">Keuangan Mandiri</h1>
          </div>
        </header>
        <main className="p-4 md:p-6 flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default MainLayout;
