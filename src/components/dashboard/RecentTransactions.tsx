
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah, formatDate } from "@/lib/formatter";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  account: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6 pb-3 border-b">
        <h3 className="text-lg font-medium">Transaksi Terbaru</h3>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Akun</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Tidak ada transaksi terbaru
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell 
                    className={`text-right font-medium ${
                      transaction.type === "income" ? "text-success" : "text-danger"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}{formatRupiah(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentTransactions;
