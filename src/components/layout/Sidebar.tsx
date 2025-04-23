import React, { useState } from "react";
import {
  Home,
  Settings,
  CreditCard,
  BookOpenCheck,
  Book,
  Landmark,
  Users,
  ShoppingCart,
  CircleDollarSign,
  CalendarDays,
  BarChart,
  UserCog,
  ChevronLeft,
  ChevronRight,
  FileChartLine
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePathname } from "@/hooks/use-pathname";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      isSeparator: false,
    },
    {
      title: "Transaksi",
      href: "/transaksi",
      icon: CreditCard,
      isSeparator: false,
    },
    {
      title: "Bagan Akun",
      href: "/akun",
      icon: BookOpenCheck,
      isSeparator: false,
    },
    {
      title: "Buku Besar",
      href: "/buku-besar",
      icon: Book,
      isSeparator: false,
    },
    {
      title: "Rekening Bank",
      href: "/rekening",
      icon: Landmark,
      isSeparator: false,
    },
    {
      title: "Hutang & Piutang",
      href: "/hutang-piutang",
      icon: CreditCard,
      isSeparator: false,
    },
    {
      title: "Pelanggan",
      href: "/pelanggan",
      icon: Users,
      isSeparator: false,
    },
    {
      title: "Pemasok",
      href: "/pemasok",
      icon: ShoppingCart,
      isSeparator: false,
    },
    {
      title: "Inventaris",
      href: "/inventaris",
      icon: CircleDollarSign,
      isSeparator: false,
    },
    {
      title: "Kalender",
      href: "/kalender",
      icon: CalendarDays,
      isSeparator: false,
    },
    {
      title: "Laporan",
      href: "/laporan",
      icon: BarChart,
      isSeparator: false,
    },
    {
      title: "Laporan Pajak",
      href: "/pajak",
      icon: FileChartLine,
      isSeparator: false,
    },
    {
      title: "Pengguna",
      href: "/pengguna",
      icon: UserCog,
      isSeparator: false,
    },
    {
      title: "Pengaturan",
      href: "/pengaturan",
      icon: Settings,
      isSeparator: false,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar text-sidebar-foreground py-4 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 mb-4">
        {!isCollapsed && (
          <div>
            <h1 className="text-lg md:text-xl font-bold">MyFinTech</h1>
            <p className="text-xs text-sidebar-foreground/70">v1.0.0</p>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full hover:bg-sidebar-accent/50 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav
        className={cn(
          "flex flex-col flex-1 px-2 mt-4 space-y-1 overflow-y-auto h-full",
          isCollapsed ? "items-center" : ""
        )}
      >
        {navigationItems.map((item) => (
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
      </nav>
    </div>
  );
};

export default Sidebar;
