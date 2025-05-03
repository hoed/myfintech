
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, DollarSign, LogOut, User, Settings, BanknoteIcon, WalletIcon } from "lucide-react";
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
          ? "bg-[#2a2a2a] text-white"
          : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
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
    navigate("/login");
  };

  // Group navigation items by category for better organization
  const navGroups = [
    {
      title: "Utama",
      items: [
        { href: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { href: "/transaksi", icon: <CreditCard size={20} />, label: "Transaksi" },
      ]
    },
    {
      title: "Keuangan",
      items: [
        { href: "/akun", icon: <FileText size={20} />, label: "Bagan Akun" },
        { href: "/buku-besar", icon: <BookOpen size={20} />, label: "Buku Besar" },
        { href: "/rekening", icon: <BanknoteIcon size={20} />, label: "Rekening Bank" },
        { href: "/hutang-piutang", icon: <WalletIcon size={20} />, label: "Hutang & Piutang" },
      ]
    },
    {
      title: "Relasi Bisnis",
      items: [
        { href: "/pelanggan", icon: <Users size={20} />, label: "Pelanggan" },
        { href: "/pemasok", icon: <ShoppingCart size={20} />, label: "Pemasok" },
      ]
    },
    {
      title: "Inventaris & Lainnya",
      items: [
        { href: "/inventaris", icon: <CircleDollarSign size={20} />, label: "Inventaris" },
        { href: "/kalender", icon: <Calendar size={20} />, label: "Kalender" },
      ]
    },
    {
      title: "Laporan",
      items: [
        { href: "/laporan", icon: <BarChart size={20} />, label: "Laporan" },
        { href: "/pajak", icon: <Calculator size={20} />, label: "Pajak" },
      ]
    },
    {
      title: "Sistem",
      items: [
        { href: "/pengguna", icon: <Users size={20} />, label: "Manajemen Pengguna" },
        { href: "/pengaturan", icon: <Settings size={20} />, label: "Pengaturan" },
      ]
    },
  ];

  return (
    <>
      {/* Bottom Navigation for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden border-t border-gray-700 shadow-lg rounded-t-2xl bg-[#1a1a1a] transition-all duration-300 ease-in-out">
        <div className="flex justify-around items-center py-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center justify-center text-sm p-3 text-white hover:bg-[#2a2a2a] rounded-full transition-colors"
              >
                <Menu size={24} />
                <span>Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-[#1a1a1a] w-[280px] max-w-[80vw] rounded-r-2xl shadow-lg">
              <div className="border-b border-gray-700 px-6 py-5">
                <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-white" onClick={closeSheet}>
                  <DollarSign size={24} className="text-blue-500" />
                  <span>Keuangan Mandiri</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-4 px-4">
                <nav className="grid gap-6">
                  {navGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                      <h4 className="text-xs uppercase font-medium text-gray-400 px-3 mb-1">{group.title}</h4>
                      {group.items.map((item) => (
                        <NavItem
                          key={item.href}
                          href={item.href}
                          icon={item.icon}
                          label={item.label}
                          onClick={closeSheet}
                        />
                      ))}
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center text-sm p-3 text-white hover:bg-[#2a2a2a] rounded-full transition-colors"
            onClick={() => navigate("/profil")}
          >
            <User size={24} />
            <span>Profil</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center text-sm p-3 text-white hover:bg-[#2a2a2a] rounded-full transition-colors"
            onClick={() => navigate("/pengaturan")}
          >
            <Settings size={24} />
            <span>Pengaturan</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center text-sm p-3 text-white hover:bg-[#2a2a2a] rounded-full transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={24} />
            <span>Logout</span>
          </Button>
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
          <SheetContent side="left" className="p-0 bg-[#1a1a1a] w-[280px] max-w-[80vw]">
            <div className="border-b border-gray-700 px-6 py-5">
              <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-white" onClick={closeSheet}>
                <DollarSign size={24} className="text-blue-500" />
                <span>Keuangan Mandiri</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-4 px-4">
              <nav className="grid gap-6">
                {navGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-xs uppercase font-medium text-gray-400 px-3 mb-1">{group.title}</h4>
                    {group.items.map((item) => (
                      <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        onClick={closeSheet}
                      />
                    ))}
                  </div>
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
