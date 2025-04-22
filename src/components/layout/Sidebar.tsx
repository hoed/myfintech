import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  CreditCard,
  Calculator,
  Calendar,
  BarChart,
  Users,
  Settings,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
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
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
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
    <aside className="hidden md:flex h-screen w-64 flex-col bg-sidebar fixed inset-y-0 z-50">
      <div className="border-b border-sidebar-border px-6 py-5">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-white">
          <DollarSign size={24} className="text-sidebar-primary" />
          <span>Keuangan Mandiri</span>
        </Link>
      </div>

      <div className="flex-1 overflow-hidden py-4 px-4 hover:overflow-y-auto">
        <nav className="grid gap-1">
          <NavItem
            href="/"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavItem
            href="/akun"
            icon={<FileText size={20} />}
            label="Bagan Akun"
          />
          <NavItem
            href="/transaksi"
            icon={<BookOpen size={20} />}
            label="Transaksi"
          />
          <NavItem
            href="/buku-besar"
            icon={<BookOpen size={20} />}
            label="Buku Besar"
          />
          <NavItem
            href="/rekening-bank"
            icon={<CreditCard size={20} />}
            label="Rekening Bank"
          />
          <NavItem
            href="/hutang-piutang"
            icon={<Calculator size={20} />}
            label="Hutang & Piutang"
          />
          <NavItem
            href="/kalender"
            icon={<Calendar size={20} />}
            label="Kalender"
          />
          <NavItem
            href="/laporan"
            icon={<BarChart size={20} />}
            label="Laporan"
          />
          <NavItem
            href="/pengguna"
            icon={<Users size={20} />}
            label="Manajemen Pengguna"
          />
          <NavItem
            href="/pengaturan"
            icon={<Settings size={20} />}
            label="Pengaturan"
          />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
