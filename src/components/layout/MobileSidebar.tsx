
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
  Settings,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

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

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  const closeSheet = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-sidebar w-[280px] max-w-[80vw]" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-sidebar-border px-6 py-5">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-white" onClick={closeSheet}>
            <DollarSign size={24} className="text-sidebar-primary" />
            <span>Keuangan Mandiri</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4 px-4">
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

        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-sidebar-primary flex items-center justify-center text-white">
              AD
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Admin Sistem</p>
              <p className="text-xs text-sidebar-foreground/70">admin@example.com</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
