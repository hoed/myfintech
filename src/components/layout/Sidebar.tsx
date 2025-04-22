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

const Sidebar = () => {
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
      href: "/bagan-akun",
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
    <div className="flex flex-col h-full bg-gray-50 border-r py-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Keuangan Mandiri</h1>
        <p className="text-sm text-gray-500">v1.0.0</p>
      </div>
      <nav className="flex flex-col flex-1 px-2 mt-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200",
                isActive
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-700"
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
