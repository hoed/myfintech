
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TransactionFilter from "@/components/transactions/TransactionFilter";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionTable from "@/components/transactions/TransactionTable";

const TransactionsPage = () => {
  const { transactions, isLoading } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("semua");
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

    if (filterType === "semua") {
      return matchesSearch;
    } else if (filterType === "pendapatan") {
      return matchesSearch && transaction.type === "kredit";
    } else if (filterType === "pengeluaran") {
      return matchesSearch && transaction.type === "debit";
    }
    return matchesSearch;
  });

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
          <Button className="flex items-center gap-2" onClick={() => setIsNewTransactionOpen(true)}>
            <Plus size={16} />
            <span>Tambah Transaksi</span>
          </Button>
          <TransactionForm 
            isOpen={isNewTransactionOpen} 
            onOpenChange={setIsNewTransactionOpen} 
          />
        </div>

        <TransactionFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        <TransactionTable 
          transactions={filteredTransactions}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
