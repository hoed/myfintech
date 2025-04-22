
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah, formatDate } from "@/lib/formatter";
import { Account, Transaction } from "@/types";
import { Download, Search, Filter, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const Ledger = () => {
  // Sample data
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
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2023-04-20",
      description: "Saldo awal",
      amount: 200000000,
      type: "debit",
      accountId: "1",
      createdBy: "admin",
      createdAt: "2023-04-01T10:30:00",
      updatedAt: "2023-04-01T10:30:00",
    },
    {
      id: "2",
      date: "2023-04-05",
      description: "Penarikan dari Bank BCA",
      amount: 50000000,
      type: "debit",
      accountId: "1",
      createdBy: "admin",
      createdAt: "2023-04-05T14:15:00",
      updatedAt: "2023-04-05T14:15:00",
    },
    {
      id: "3",
      date: "2023-04-10",
      description: "Pembayaran ke supplier",
      amount: 35000000,
      type: "kredit",
      accountId: "1",
      createdBy: "manager",
      createdAt: "2023-04-10T09:45:00",
      updatedAt: "2023-04-10T09:45:00",
    },
    {
      id: "4",
      date: "2023-04-15",
      description: "Penerimaan dari customer",
      amount: 45000000,
      type: "debit",
      accountId: "1",
      createdBy: "admin",
      createdAt: "2023-04-15T16:20:00",
      updatedAt: "2023-04-15T16:20:00",
    },
    {
      id: "5",
      date: "2023-04-18",
      description: "Pembayaran biaya operasional",
      amount: 10000000,
      type: "kredit",
      accountId: "1",
      createdBy: "admin",
      createdAt: "2023-04-18T11:00:00",
      updatedAt: "2023-04-18T11:00:00",
    },
  ];

  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0].id);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2023, 3, 1)); // April 1, 2023
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2023, 3, 30)); // April 30, 2023
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by account
    if (transaction.accountId !== selectedAccount) {
      return false;
    }

    // Filter by date range
    if (startDate && endDate) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < startDate || transactionDate > endDate) {
        return false;
      }
    }

    // Filter by search term
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Calculate running balance - Fixed the error by declaring ledgerEntries before using it
  let initialBalance = 0;
  const ledgerEntries = filteredTransactions.map((transaction, index) => {
    const previousBalance = index === 0 ? initialBalance : ledgerEntries[index - 1]?.runningBalance || 0;
    const amount = transaction.type === "debit" ? transaction.amount : -transaction.amount;
    const runningBalance = previousBalance + amount;

    return {
      ...transaction,
      runningBalance,
    };
  });

  const selectedAccountObj = accounts.find((a) => a.id === selectedAccount);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Buku Besar</h1>
          <p className="text-muted-foreground mt-1">
            Pantau pergerakan transaksi dan saldo per akun
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Filter</CardTitle>
              <CardDescription>Filter buku besar berdasarkan kriteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pilih Akun</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih akun" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Tanggal Akhir</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Cari Deskripsi</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari transaksi..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Reset Filter
              </Button>
            </CardFooter>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedAccountObj?.name}</CardTitle>
                    <CardDescription>
                      Kode: {selectedAccountObj?.code} | Tipe: {selectedAccountObj?.type}
                    </CardDescription>
                  </div>
                  <Button variant="outline" className="h-8 gap-1">
                    <Download size={16} />
                    <span>Ekspor</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Kredit</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledgerEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          Tidak ada transaksi yang ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      ledgerEntries.map((entry, index) => (
                        <TableRow key={entry.id}>
                          <TableCell>{formatDate(entry.date)}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell className="text-right">
                            {entry.type === "debit" ? formatRupiah(entry.amount) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.type === "kredit" ? formatRupiah(entry.amount) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatRupiah(entry.runningBalance)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex justify-between w-full">
                  <div className="text-sm font-medium">Total Transaksi: {ledgerEntries.length}</div>
                  <div className="text-sm font-medium">
                    Saldo Akhir: {formatRupiah(ledgerEntries[ledgerEntries.length - 1]?.runningBalance || 0)}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Ledger;
