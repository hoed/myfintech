import React from "react";
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
  ChevronLeft, // Import ChevronLeft icon
  ChevronRight, // Import ChevronRight icon
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePathname } from "@/hooks/use-pathname";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  isSeparator: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
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
    <div className={cn(
      "flex flex-col h-full bg-sidebar text-sidebar-foreground py-4 overflow-y-auto",
      isCollapsed ? "w-16" : "w-64" // Adjust width based on collapsed state
    )}>
      <div className="flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold">MyFinTech System</h1>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-sidebar-accent/30"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      <div className="px-4">
        <p className="text-sm text-sidebar-foreground/70">v1.0.0</p>
      </div>
      <nav className="flex flex-col flex-1 px-2 mt-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
