
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  ChartBar, 
  Plus, 
  BanknoteIcon,
  FileText
} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "@/components/transactions/TransactionForm";

const QuickAccess: React.FC = () => {
  const navigate = useNavigate();
  const [isNewTransactionOpen, setIsNewTransactionOpen] = React.useState(false);

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Akses Cepat</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2"
          onClick={() => setIsNewTransactionOpen(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="text-xs">Transaksi Baru</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2"
          onClick={() => navigateTo("/rekening-bank")}
        >
          <BanknoteIcon className="h-6 w-6" />
          <span className="text-xs">Rekening Bank</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2"
          onClick={() => navigateTo("/laporan")}
        >
          <FileText className="h-6 w-6" />
          <span className="text-xs">Laporan Harian</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2"
          onClick={() => navigateTo("/kalender")}
        >
          <CalendarDays className="h-6 w-6" />
          <span className="text-xs">Kalender</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2"
          onClick={() => navigateTo("/inventory")}
        >
          <ChartBar className="h-6 w-6" />
          <span className="text-xs">Inventaris</span>
        </Button>
      </div>

      <TransactionForm 
        isOpen={isNewTransactionOpen} 
        onOpenChange={setIsNewTransactionOpen} 
      />
    </div>
  );
};

export default QuickAccess;
