
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { cn } from "@/lib/utils";
import { Account } from "@/types";

interface TransactionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onOpenChange }) => {
  const { accounts } = useAccounts();
  const { addTransaction } = useTransactions();

  const [transactionType, setTransactionType] = useState("pendapatan");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    account_id: "",
  });

  const handleAddTransaction = () => {
    if (!selectedDate || !newTransaction.account_id || !newTransaction.description || !newTransaction.amount) {
      return;
    }

    addTransaction.mutate({
      date: selectedDate.toISOString().split('T')[0],
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount.replace(/[^\d.-]/g, '')),
      type: transactionType === "pendapatan" ? "kredit" : "debit",
      account_id: newTransaction.account_id,
    });

    onOpenChange(false);
    setNewTransaction({
      description: "",
      amount: "",
      account_id: "",
    });
    setSelectedDate(new Date());
  };

  const filteredAccounts = accounts.filter((account: Account) => {
    if (transactionType === "pendapatan") {
      return account.type === "pendapatan" || account.type === "aset";
    } else {
      return account.type === "beban" || account.type === "kewajiban";
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Baru</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs defaultValue="pendapatan" value={transactionType} onValueChange={setTransactionType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pendapatan">Pendapatan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-2">
            <Label htmlFor="date">Tanggal Transaksi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              placeholder="Deskripsi transaksi"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Jumlah</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="amount"
                className="pl-10"
                value={newTransaction.amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  if (value) {
                    setNewTransaction({
                      ...newTransaction,
                      amount: new Intl.NumberFormat('id-ID').format(parseInt(value)),
                    });
                  } else {
                    setNewTransaction({ ...newTransaction, amount: '' });
                  }
                }}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="account">Akun</Label>
            <Select
              value={newTransaction.account_id}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, account_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih akun terkait" />
              </SelectTrigger>
              <SelectContent>
                {filteredAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAddTransaction} className="mt-2">Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
