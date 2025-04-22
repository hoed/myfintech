
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";

interface TransactionFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType
}) => {
  return (
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
  );
};

export default TransactionFilter;
