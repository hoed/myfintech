
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { formatRupiah } from "@/lib/formatter";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { rates } = useCurrencyRates();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium md:hidden">Keuangan Mandiri</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-sm">
          <span className="text-muted-foreground">USD/IDR: </span>
          <span className="font-medium">{formatRupiah(rates?.find(r => r.currency_from === 'USD' && r.currency_to === 'IDR')?.rate || 0)}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden md:flex items-center gap-2"
          onClick={() => navigate("/profil")}
        >
          <User size={16} />
          <span>Profil</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
