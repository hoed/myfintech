import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah, formatDate } from "@/lib/formatter";
import { Calendar, Eye, FileText, Plus, Search, Filter, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const TransactionsPage = () => {
  const { transactions, isLoading, addTransaction } = useTransactions();
  const { accounts } = useAccounts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("semua");
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("pendapatan");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    accountId: "",
  });

  const handleAddTransaction = () => {
    if (!selectedDate || !newTransaction.accountId || !newTransaction.description || !newTransaction.amount) {
      return;
    }

    addTransaction.mutate({
      date: selectedDate.toISOString().split('T')[0],
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount.replace(/[^\d.-]/g, '')),
      type: transactionType === "pendapatan" ? "kredit" : "debit",
      accountId: newTransaction.accountId,
    });

    setIsNewTransactionOpen(false);
    setNewTransaction({
      description: "",
      amount: "",
      accountId: "",
    });
    setSelectedDate(new Date());
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "semua") {
      return matchesSearch;
    } else if (filterType === "pendapatan") {
      return matchesSearch && transaction.type === "kredit";
    } else if (filterType === "pengeluaran") {
      return matchesSearch && transaction.type === "debit";
    }
    return matchesSearch;
  });

  const getAccountName = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account ? account.name : "Unknown Account";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Transaksi</h1>
            <p className="text-muted-foreground mt-1">
              Catat dan kelola transaksi keuangan perusahaan
            </p>
          </div>
          <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Tambah Transaksi</span>
              </Button>
            </DialogTrigger>
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
                      <CalendarComponent
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
                    value={newTransaction.accountId}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, accountId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih akun terkait" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts
                        .filter((account) => {
                          if (transactionType === "pendapatan") {
                            return account.type === "pendapatan" || account.type === "aset";
                          } else {
                            return account.type === "beban" || account.type === "kewajiban";
                          }
                        })
                        .map((account) => (
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
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari transaksi berdasarkan deskripsi..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Transaksi</SelectItem>
              <SelectItem value="pendapatan">Pendapatan</SelectItem>
              <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
          <Button variant="outline" size="icon">
            <Download size={16} />
          </Button>
        </div>

        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Transaksi</TableHead>
                <TableHead>No. Invoice</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Akun</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    Tidak ada transaksi yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.transaction_code}</TableCell>
                    <TableCell>{transaction.invoice_number}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.chart_of_accounts?.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "kredit"
                            ? "bg-success/20 text-success"
                            : "bg-danger/20 text-danger"
                        }`}
                      >
                        {transaction.type === "kredit" ? "Pendapatan" : "Pengeluaran"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatRupiah(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
