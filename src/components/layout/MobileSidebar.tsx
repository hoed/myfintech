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
    { href: "/pengguna", icon: <Users size={20} />, label: "Manajemen Pengguna" },
    { href: "/pengaturan", icon: <Settings size={20} />, label: "Pengaturan" },
  ];

  return (
    <>
      {/* Bottom Navigation for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden border-t border-sidebar-border shadow-lg rounded-t-lg">
        <div className="flex justify-around items-center py-3 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] backdrop-blur-sm">
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex flex-col items-center justify-center text-sm p-3 text-white"
            >
              <Menu size={24} />
              <span>Menu</span>
            </Button>
          </SheetTrigger>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center text-sm p-3 text-white"
            onClick={() => navigate("/profil")}
          >
            <User size={24} />
            <span>Profil</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center text-sm p-3 text-white"
            onClick={() => navigate("/pengaturan")}
          >
            <Settings size={24} />
            <span>Pengaturan</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center text-sm p-3 text-white"
            onClick={handleLogout}
          >
            <LogOut size={24} />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Sheet for Mobile Menu (triggered by Hamburger) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 bg-sidebar w-[280px] max-w-[80vw]">
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
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet Trigger for Larger Screens (if needed) */}
      <div className="hidden md:block">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-sidebar w-[280px] max-w-[80vw]">
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
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MobileSidebar;