import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, DollarSign, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  CreditCard,
  Calculator,
  Calendar,
  BarChart,
  Users,
  ShoppingCart,
  CircleDollarSign,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const closeSheet = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeSheet();
  };

  const navItems = [
    { href: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/transaksi", icon: <BookOpen size={20} />, label: "Transaksi" },
    { href: "/akun", icon: <FileText size={20} />, label: "Bagan Akun" },
    { href: "/buku-besar", icon: <BookOpen size={20} />, label: "Buku Besar" },
    { href: "/rekening-bank", icon: <CreditCard size={20} />, label: "Rekening Bank" },
    { href: "/hutang-piutang", icon: <Calculator size={20} />, label: "Hutang & Piutang" },
    { href: "/pelanggan", icon: <Users size={20} />, label: "Pelanggan" },
    { href: "/pemasok", icon: <ShoppingCart size={20} />, label: "Pemasok" },
    { href: "/inventaris", icon: <CircleDollarSign size={20} />, label: "Inventaris" },
    { href: "/kalender", icon: <Calendar size={20} />, label: "Kalender" },
    { href: "/laporan", icon: <BarChart size={20} />, label: "Laporan" },
    { href: "/pajak", icon: <BarChart size={20} />, label: "Pajak" },
    { href: "/pengguna", icon: <Users size={20} />, label: "Manajemen Pengguna" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn(
          "p-0 bg-sidebar w-[280px] max-w-[80vw] rounded-r-3xl shadow-lg transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-sidebar-border px-6 py-5">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-white" onClick={closeSheet}>
            <DollarSign size={24} className="text-sidebar-primary" />
            <span>Keuangan Mandiri</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4 px-4">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                onClick={closeSheet}
              />
            ))}
            <NavItem
              href="/profil"
              icon={<User size={20} />}
              label="Profil"
              onClick={closeSheet}
            />
            <NavItem
              href="/pengaturan"
              icon={<Settings size={20} />}
              label="Pengaturan"
              onClick={closeSheet}
            />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;