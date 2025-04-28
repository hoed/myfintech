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
        "flex flex-col items-center justify-center gap-1 p-2 text-xs transition-all",
        isActive
          ? "text-primary"
          : "text-sidebar-foreground hover:text-primary"
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
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const closeSheet = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeSheet();
  };

  const bottomNavItems = [
    { href: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/transaksi", icon: <BookOpen size={20} />, label: "Transaksi" },
    { href: "/akun", icon: <FileText size={20} />, label: "Akun" },
    { href: "/buku-besar", icon: <BookOpen size={20} />, label: "Buku Besar" },
    { href: "/rekening-bank", icon: <CreditCard size={20} />, label: "Rekening" },
    { href: "/hutang-piutang", icon: <Calculator size={20} />, label: "Hutang" },
    { href: "/pelanggan", icon: <Users size={20} />, label: "Pelanggan" },
    { href: "/pemasok", icon: <ShoppingCart size={20} />, label: "Pemasok" },
    { href: "/inventaris", icon: <CircleDollarSign size={20} />, label: "Inventaris" },
    { href: "/kalender", icon: <Calendar size={20} />, label: "Kalender" },
    { href: "/pajak", icon: <Calendar size={20} />, label: "Pajak" },
    { href: "/laporan", icon: <BarChart size={20} />, label: "Laporan" },
  ];

  return (
    <>
      {/* Bottom Navigation for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-sidebar border-t border-sidebar-border shadow-lg">
        <div className="flex justify-between items-center px-2 py-1">
          <div className="flex overflow-x-auto space-x-1">
            {bottomNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                onClick={closeSheet}
              />
            ))}
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="flex flex-col items-center justify-center text-xs p-2"
              onClick={() => {
                navigate("/profil");
                closeSheet();
              }}
            >
              <User size={20} />
              <span>Profil</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex flex-col items-center justify-center text-xs p-2"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex flex-col items-center justify-center text-xs p-2"
              onClick={() => {
                navigate("/pengaturan");
                closeSheet();
              }}
            >
              <Settings size={20} />
              <span>Pengaturan</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sheet for Larger Screens */}
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
                {bottomNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    onClick={closeSheet}
                  />
                ))}
                <NavItem
                  href="/pengguna"
                  icon={<Users size={20} />}
                  label="Manajemen Pengguna"
                  onClick={closeSheet}
                />
                <NavItem
                  href="/pengaturan"
                  icon={<Settings size={20} />}
                  label="Pengaturan"
                  onClick={closeSheet}
                />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MobileSidebar;