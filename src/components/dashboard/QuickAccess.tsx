
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  ChartBar, 
  Plus, 
  Banknote, // use correct icon from lucide-react-icons
  FileText,
  Package // for inventory/product
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
          // Navigate to 'create new account' page, e.g. /rekening?create=1
          onClick={() => navigateTo("/rekening?create=1")}
        >
          <Banknote className="h-6 w-6" />
          <span className="text-xs">Buat Rekening Baru</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2"
          // Open add product flow. If modal/form, replace with handler; here, link to /inventaris?add=product
          onClick={() => navigateTo("/inventaris?add=product")}
        >
          <Package className="h-6 w-6" />
          <span className="text-xs">Tambah Produk</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2"
          // Navigate to create new tax report, e.g. /laporan?create_tax=1
          onClick={() => navigateTo("/laporan?create_tax=1")}
        >
          <FileText className="h-6 w-6" />
          <span className="text-xs">Laporan Pajak Baru</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2"
          onClick={() => navigateTo("/kalender")}
        >
          <CalendarDays className="h-6 w-6" />
          <span className="text-xs">Kalender</span>
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
