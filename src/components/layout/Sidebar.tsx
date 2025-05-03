
import React, { useState, useEffect } from "react";
import {
  Home,
  Settings,
  CreditCard,
  BookOpenCheck,
  Book,
  Users,
  ShoppingCart,
  CircleDollarSign,
  CalendarDays,
  BarChart,
  UserCog,
  FileChartLine,
  BanknoteIcon,
  WalletIcon
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePathname } from "@/hooks/use-pathname";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Listen for sidebar toggle events from MainLayout
  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.collapsed !== undefined) {
        setIsCollapsed(customEvent.detail.collapsed);
      }
    };
    
    window.addEventListener('toggle-sidebar', handleSidebarToggle);
    return () => {
      window.removeEventListener('toggle-sidebar', handleSidebarToggle);
    };
  }, []);

  // Group navigation items by category for better organization
  const navigationGroups = [
    {
      title: "Utama",
      items: [
        {
          title: "Dashboard",
          href: "/",
          icon: Home,
        },
        {
          title: "Transaksi",
          href: "/transaksi",
          icon: CreditCard,
        },
      ]
    },
    {
      title: "Keuangan",
      items: [
        {
          title: "Bagan Akun",
          href: "/akun",
          icon: BookOpenCheck,
        },
        {
          title: "Buku Besar",
          href: "/buku-besar",
          icon: Book,
        },
        {
          title: "Rekening Bank",
          href: "/rekening",
          icon: BanknoteIcon,
        },
        {
          title: "Hutang & Piutang",
          href: "/hutang-piutang",
          icon: WalletIcon,
        },
      ]
    },
    {
      title: "Relasi Bisnis",
      items: [
        {
          title: "Pelanggan",
          href: "/pelanggan",
          icon: Users,
        },
        {
          title: "Pemasok",
          href: "/pemasok",
          icon: ShoppingCart,
        },
      ]
    },
    {
      title: "Inventaris & Lainnya",
      items: [
        {
          title: "Inventaris",
          href: "/inventaris",
          icon: CircleDollarSign,
        },
        {
          title: "Kalender",
          href: "/kalender",
          icon: CalendarDays,
        },
      ]
    },
    {
      title: "Laporan",
      items: [
        {
          title: "Laporan",
          href: "/laporan",
          icon: BarChart,
        },
        {
          title: "Laporan Pajak",
          href: "/pajak",
          icon: FileChartLine,
        },
      ]
    },
    {
      title: "Sistem",
      items: [
        {
          title: "Pengguna",
          href: "/pengguna",
          icon: UserCog,
        },
        {
          title: "Pengaturan",
          href: "/pengaturan",
          icon: Settings,
        },
      ]
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar text-sidebar-foreground py-4 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-center px-4 mb-4">
        {!isCollapsed && (
          <div>
            <h1 className="text-lg md:text-xl font-bold">MyFinTech</h1>
            <p className="text-xs text-sidebar-foreground/70">v1.0.0</p>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center items-center h-10">
            <span className="text-xl font-bold">MF</span>
          </div>
        )}
      </div>
      <nav
        className={cn(
          "flex flex-col flex-1 px-2 mt-4 space-y-4 overflow-y-auto h-full",
          isCollapsed ? "items-center" : ""
        )}
      >
        {navigationGroups.map((group, index) => (
          <div key={index} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 text-xs uppercase font-medium text-sidebar-foreground/50">
                {group.title}
              </h3>
            )}
            
            {group.items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isCollapsed ? "justify-center" : "",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className={cn("w-4 h-4", isCollapsed ? "mr-0" : "mr-2")} />
                {!isCollapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
