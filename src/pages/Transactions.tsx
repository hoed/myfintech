
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah, formatDate } from "@/lib/formatter";
import { Account, Transaction } from "@/types";
import { Calendar, Eye, FileText, Plus, Search, Filter, Download, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const TransactionsPage = () => {
  // Sample data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2023-04-20",
      description: "Pembayaran dari PT Maju Bersama",
      amount: 25000000,
      type: "kredit",
      accountId: "3",
      createdBy: "admin",
      createdAt: "2023-04-20T10:30:00",
      updatedAt: "2023-04-20T10:30:00",
    },
    {
      id: "2",
      date: "2023-04-19",
      description: "Pembayaran listrik bulan April",
      amount: 3500000,
      type: "debit",
      accountId: "7",
      createdBy: "admin",
      createdAt: "2023-04-19T14:15:00",
      updatedAt: "2023-04-19T14:15:00",
    },
    {
      id: "3",
      date: "2023-04-18",
      description: "Pembelian bahan baku",
      amount: 12000000,
      type: "debit",
      accountId: "4",
      createdBy: "manager",
      createdAt: "2023-04-18T09:45:00",
      updatedAt: "2023-04-18T09:45:00",
    },
    {
      id: "4",
      date: "2023-04-17",
      description: "Pembayaran dari PT Sukses Mandiri",
      amount: 18000000,
      type: "kredit",
      accountId: "3",
      createdBy: "admin",
      createdAt: "2023-04-17T16:20:00",
      updatedAt: "2023-04-17T16:20:00",
    },
    {
      id: "5",
      date: "2023-04-16",
      description: "Pembayaran gaji karyawan",
      amount: 45000000,
      type: "debit",
      accountId: "7",
      createdBy: "admin",
      createdAt: "2023-04-16T11:00:00",
      updatedAt: "2023-04-16T11:00:00",
    },
  ]);

  const accounts: Account[] = [
    {
      id: "1",
      code: "1-1000",
      name: "Kas",
      type: "aset",
      balance: 250000000,
      isActive: true,
      createdAt: "2023-01-01",
      updatedAt: "2023-04-20",
    },
    {
      id: "2",
      code: "1-2000",
      name: "Bank BCA",
      type: "aset",
      balance: 450000000,
      isActive: true,
      createdAt: "2023-01-01",
      updatedAt: "2023-04-19",
    },
    {
      id: "3",
      code: "1-3000",
      name: "Piutang Dagang",
      type: "aset",
      balance: 320000000,
      isActive: true,
      createdAt: "2023-01-01",
      updatedAt: "2023-04-18",
    },
    {
      id: "4",
      code: "2-1000",
      name: "Hutang Dagang",
      type: "kewajiban",
      balance: 180000000,
      isActive: true,
      createdAt: "2023-01-01",
      updatedAt: "2023-04-17",
    },
    {
      id: "5",
      code: "3-1000",
      name: "Modal Disetor",
      type: "ekuitas",
      balance: 500000000,
      isActive: true,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: "6",
      code: "4-1000",
      name: "Pendapatan Penjualan",
      type: "pendapatan",
      balance: 750000000,
      isActive: true,
      createdAt: "2023-01-01",
      updatedAt: "2023-04-20",
    },
    {
      id: "7",
      code: "5-1000",
      name: "Beban Gaji",
      type: "beban",
      balance: 280000000,
      isActive: true,
      createdAt: "2023-01-01",
      updatedAt: "2023-04-16",
    },
  ];

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

    const transaction: Transaction = {
      id: (transactions.length + 1).toString(),
      date: selectedDate.toISOString().split('T')[0],
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount.replace(/[^\d.-]/g, '')),
      type: transactionType === "pendapatan" ? "kredit" : "debit",
      accountId: newTransaction.accountId,
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions([transaction, ...transactions]);
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
                        // Simple rupiah formatting for input
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
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Akun</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Tidak ada transaksi yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{getAccountName(transaction.accountId)}</TableCell>
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
