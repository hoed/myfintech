
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

  // Setup event listener for sidebar toggle events from sidebar component
  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.collapsed !== undefined) {
        setSidebarCollapsed(customEvent.detail.collapsed);
        localStorage.setItem('sidebarCollapsed', String(customEvent.detail.collapsed));
      }
    };
    
    window.addEventListener('toggle-sidebar', handleSidebarToggle);
    return () => {
      window.removeEventListener('toggle-sidebar', handleSidebarToggle);
    };
  }, []);

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
            // Dispatch event to notify sidebar component
            window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: { collapsed: true } }));
          }}
          onExpand={() => {
            setSidebarCollapsed(false);
            localStorage.setItem('sidebarCollapsed', 'false');
            // Dispatch event to notify sidebar component
            window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: { collapsed: false } }));
          }}
          className="h-screen"
        >
          <Sidebar />
        </ResizablePanel>

        <ResizablePanel defaultSize={80} className="overflow-hidden">
          <div className="flex-1 overflow-auto flex flex-col h-full">
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
