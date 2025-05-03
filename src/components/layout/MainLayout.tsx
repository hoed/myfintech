
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { setTheme, theme } = useTheme();
  const { settings } = useAppSettings();

  // Apply theme from settings with proper boolean handling
  useEffect(() => {
    if (settings?.dark_mode !== undefined) {
      const newTheme = Boolean(settings.dark_mode) ? 'dark' : 'light';
      if (theme !== newTheme) {
        setTheme(newTheme);
      }
    }
  }, [settings?.dark_mode, setTheme, theme]);

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

  // Function to toggle sidebar state
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 overflow-auto flex flex-col">
          <Header />
          <div className="flex-1 relative">
            <main className="p-4 md:p-6 flex-1">
              {children}
            </main>
          </div>
          <Footer />
        </div>
        <MobileSidebar />
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
        <ResizablePanel 
          defaultSize={sidebarCollapsed ? 0 : 20} 
          minSize={15} 
          maxSize={25}
          collapsible={true}
          collapsedSize={0}
          onCollapse={() => {
            setSidebarCollapsed(true);
            localStorage.setItem('sidebarCollapsed', 'true');
          }}
          onExpand={() => {
            setSidebarCollapsed(false);
            localStorage.setItem('sidebarCollapsed', 'false');
          }}
          className="h-screen"
        >
          <Sidebar />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80}>
          <div className="flex-1 overflow-auto flex flex-col">
            <Header />
            <div className="flex-1 relative">
              <main className="p-4 md:p-6 flex-1">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default MainLayout;
