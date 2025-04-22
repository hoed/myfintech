
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, BookOpen, CreditCard, Calculator,
  Calendar, BarChart, Users, Settings, DollarSign, ChevronLeft,
  Store, Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, collapsed }) => {
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
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapsedChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Berhasil Logout",
        description: "Anda telah keluar dari sistem.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Logout",
        description: error.message || "Terjadi kesalahan saat logout",
      });
    }
  };

  return (
    <aside className={cn(
      "hidden md:flex h-screen flex-col bg-sidebar fixed inset-y-0 z-50 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="border-b border-sidebar-border px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-white">
          <DollarSign size={24} className="text-sidebar-primary" />
          {!collapsed && <span>Keuangan Mandiri</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(!collapsed)}
          className="text-white"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden py-4 px-4 hover:overflow-y-auto">
        <nav className="grid gap-1">
          <NavItem
            href="/"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            collapsed={collapsed}
          />
          <NavItem
            href="/akun"
            icon={<FileText size={20} />}
            label="Bagan Akun"
            collapsed={collapsed}
          />
          <NavItem
            href="/transaksi"
            icon={<BookOpen size={20} />}
            label="Transaksi"
            collapsed={collapsed}
          />
          <NavItem
            href="/buku-besar"
            icon={<BookOpen size={20} />}
            label="Buku Besar"
            collapsed={collapsed}
          />
          <NavItem
            href="/rekening-bank"
            icon={<CreditCard size={20} />}
            label="Rekening Bank"
            collapsed={collapsed}
          />
          <NavItem
            href="/hutang-piutang"
            icon={<Calculator size={20} />}
            label="Hutang & Piutang"
            collapsed={collapsed}
          />
          <NavItem
            href="/kalender"
            icon={<Calendar size={20} />}
            label="Kalender"
            collapsed={collapsed}
          />
          <NavItem
            href="/laporan"
            icon={<BarChart size={20} />}
            label="Laporan"
            collapsed={collapsed}
          />
          <NavItem
            href="/pengguna"
            icon={<Users size={20} />}
            label="Manajemen Pengguna"
            collapsed={collapsed}
          />
          <NavItem
            href="/pengaturan"
            icon={<Settings size={20} />}
            label="Pengaturan"
            collapsed={collapsed}
          />
          <NavItem
            href="/pelanggan"
            icon={<Store size={20} />}
            label="Pelanggan"
            collapsed={collapsed}
          />
          <NavItem
            href="/pemasok"
            icon={<Truck size={20} />}
            label="Pemasok"
            collapsed={collapsed}
          />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
