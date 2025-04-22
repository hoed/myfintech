
import React from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}
      <div className="flex-1 overflow-auto">
        <header className="border-b bg-white p-4 flex items-center md:hidden">
          <MobileSidebar />
          <div className="ml-3">
            <h1 className="text-lg font-medium">Keuangan Mandiri</h1>
          </div>
        </header>
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default MainLayout;
