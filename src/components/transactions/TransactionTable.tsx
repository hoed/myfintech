
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah, formatDate } from "@/lib/formatter";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, isLoading }) => {
  return (
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
                <TableCell>{transaction.chart_of_accounts?.name || "—"}</TableCell>
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
  );
};

export default TransactionTable;
