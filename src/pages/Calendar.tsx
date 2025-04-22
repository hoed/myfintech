
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { formatRupiah, formatDate } from "@/lib/formatter";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { transactions, isLoading } = useTransactions();
  const { accounts } = useAccounts();

  // Filter transactions for the selected date
  const selectedDateTransactions = transactions.filter(transaction => {
    if (!date) return false;
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getDate() === date.getDate() &&
      transactionDate.getMonth() === date.getMonth() &&
      transactionDate.getFullYear() === date.getFullYear()
    );
  });

  // Get account name by id
  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : "Unknown Account";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kalender Keuangan</h1>
          <p className="text-muted-foreground mt-1">
            Jadwal transaksi dan aktivitas keuangan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Kalender</CardTitle>
              <CardDescription>Pilih tanggal untuk melihat transaksi</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mx-auto"
                components={{
                  DayContent: ({ day }) => {
                    // Find if there are transactions on this day
                    const hasTransactions = transactions.some(transaction => {
                      const transactionDate = new Date(transaction.date);
                      return (
                        transactionDate.getDate() === day.date.getDate() &&
                        transactionDate.getMonth() === day.date.getMonth() &&
                        transactionDate.getFullYear() === day.date.getFullYear()
                      );
                    });

                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {day.date.getDate()}
                        {hasTransactions && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                      </div>
                    );
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transaksi Tanggal {date ? formatDate(date.toISOString()) : "-"}</CardTitle>
              <CardDescription>
                Daftar transaksi untuk tanggal yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="p-10 text-center text-muted-foreground">
                  Memuat data transaksi...
                </div>
              ) : selectedDateTransactions.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  Tidak ada transaksi untuk tanggal ini
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode Transaksi</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Akun</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDateTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.transaction_code}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{getAccountName(transaction.account_id)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={transaction.type === "kredit" ? "outline" : "secondary"}
                          >
                            {transaction.type === "kredit" ? "Pendapatan" : "Pengeluaran"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatRupiah(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
