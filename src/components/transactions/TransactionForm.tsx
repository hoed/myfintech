
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
    customer_supplier: "",
    product_item: "",
    quantity: "1",
  });

  const handleAddTransaction = () => {
    if (!selectedDate || !newTransaction.account_id || !newTransaction.description || !newTransaction.amount) {
      return;
    }

    // Build description with customer/supplier and product information
    let enhancedDescription = newTransaction.description;
    if (transactionType === "pendapatan" && newTransaction.customer_supplier) {
      enhancedDescription = `Penjualan kepada ${newTransaction.customer_supplier}: ${enhancedDescription}`;
      if (newTransaction.product_item && newTransaction.quantity) {
        enhancedDescription += ` (${newTransaction.product_item} x ${newTransaction.quantity})`;
      }
    } else if (transactionType === "pengeluaran" && newTransaction.customer_supplier) {
      enhancedDescription = `Pembelian dari ${newTransaction.customer_supplier}: ${enhancedDescription}`;
      if (newTransaction.product_item && newTransaction.quantity) {
        enhancedDescription += ` (${newTransaction.product_item} x ${newTransaction.quantity})`;
      }
    }

    // Generate a simple transaction code (in a real app, this might come from the database)
    const transactionCode = `TRX-${Date.now().toString().slice(-6)}`;

    addTransaction.mutate({
      date: selectedDate.toISOString().split('T')[0],
      description: enhancedDescription,
      amount: parseFloat(newTransaction.amount.replace(/[^\d.-]/g, '')),
      type: transactionType === "pendapatan" ? "kredit" : "debit",
      account_id: newTransaction.account_id,
      created_by: "system", // In a real app, this would be the current user's ID
      transaction_code: transactionCode, // Add the required transaction_code
    });

    onOpenChange(false);
    setNewTransaction({
      description: "",
      amount: "",
      account_id: "",
      customer_supplier: "",
      product_item: "",
      quantity: "1",
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

  // Dummy product list for demonstration (would be fetched from the database in real implementation)
  const dummyProducts = [
    { id: "1", name: "Produk A", price: 75000 },
    { id: "2", name: "Produk B", price: 150000 },
    { id: "3", name: "Produk C", price: 40000 },
    { id: "4", name: "Produk D", price: 300000 },
    { id: "5", name: "Produk E", price: 125000 },
  ];

  const handleProductChange = (productId: string) => {
    const product = dummyProducts.find(p => p.id === productId);
    if (product) {
      const quantity = parseInt(newTransaction.quantity) || 1;
      const totalAmount = product.price * quantity;
      
      setNewTransaction({
        ...newTransaction,
        product_item: product.name,
        amount: new Intl.NumberFormat('id-ID').format(totalAmount),
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = e.target.value;
    setNewTransaction({
      ...newTransaction,
      quantity
    });

    if (newTransaction.product_item) {
      const product = dummyProducts.find(p => p.name === newTransaction.product_item);
      if (product) {
        const quantityNum = parseInt(quantity) || 1;
        const totalAmount = product.price * quantityNum;
        
        setNewTransaction(prev => ({
          ...prev,
          quantity,
          amount: new Intl.NumberFormat('id-ID').format(totalAmount),
        }));
      }
    }
  };

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
            <Label htmlFor="customer_supplier">
              {transactionType === "pendapatan" ? "Pelanggan" : "Supplier"}
            </Label>
            <Input
              id="customer_supplier"
              value={newTransaction.customer_supplier}
              onChange={(e) => setNewTransaction({ ...newTransaction, customer_supplier: e.target.value })}
              placeholder={transactionType === "pendapatan" ? "Nama pelanggan" : "Nama supplier"}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product_item">
              {transactionType === "pendapatan" ? "Produk yang Dijual" : "Barang yang Dibeli"}
            </Label>
            <Select 
              value={newTransaction.product_item}
              onValueChange={(value) => {
                setNewTransaction({ ...newTransaction, product_item: value });
                const productId = dummyProducts.find(p => p.name === value)?.id;
                if (productId) handleProductChange(productId);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih produk/barang" />
              </SelectTrigger>
              <SelectContent>
                {dummyProducts.map((product) => (
                  <SelectItem key={product.id} value={product.name}>
                    {product.name} - Rp{new Intl.NumberFormat('id-ID').format(product.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Jumlah Unit</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={newTransaction.quantity}
              onChange={handleQuantityChange}
              placeholder="1"
            />
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
