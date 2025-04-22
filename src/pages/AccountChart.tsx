
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Account, AccountType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/lib/formatter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Search } from "lucide-react";

const AccountChart = () => {
  // Sample data for demonstration
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      code: "1-1000",
      name: "Kas",
      type: "aset",
      subtype: "Aset Lancar",
      balance: 250000000,
      is_active: true,
      description: "Uang tunai perusahaan",
      created_at: "2023-01-01",
      updated_at: "2023-04-20",
    },
    {
      id: "2",
      code: "1-2000",
      name: "Bank BCA",
      type: "aset",
      subtype: "Aset Lancar",
      balance: 450000000,
      is_active: true,
      description: "Rekening bank utama",
      created_at: "2023-01-01",
      updated_at: "2023-04-19",
    },
    {
      id: "3",
      code: "1-3000",
      name: "Piutang Dagang",
      type: "aset",
      subtype: "Aset Lancar",
      balance: 320000000,
      is_active: true,
      description: "Piutang kepada pelanggan",
      created_at: "2023-01-01",
      updated_at: "2023-04-18",
    },
    {
      id: "4",
      code: "2-1000",
      name: "Hutang Dagang",
      type: "kewajiban",
      subtype: "Kewajiban Lancar",
      balance: 180000000,
      is_active: true,
      description: "Hutang kepada supplier",
      created_at: "2023-01-01",
      updated_at: "2023-04-17",
    },
    {
      id: "5",
      code: "3-1000",
      name: "Modal Disetor",
      type: "ekuitas",
      subtype: "Modal",
      balance: 500000000,
      is_active: true,
      description: "Modal awal perusahaan",
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
    },
    {
      id: "6",
      code: "4-1000",
      name: "Pendapatan Penjualan",
      type: "pendapatan",
      subtype: "Pendapatan Operasional",
      balance: 750000000,
      is_active: true,
      description: "Pendapatan dari penjualan produk",
      created_at: "2023-01-01",
      updated_at: "2023-04-20",
    },
    {
      id: "7",
      code: "5-1000",
      name: "Beban Gaji",
      type: "beban",
      subtype: "Beban Operasional",
      balance: 280000000,
      is_active: true,
      description: "Beban gaji karyawan",
      created_at: "2023-01-01",
      updated_at: "2023-04-16",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("semua");
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "aset" as AccountType,
    subtype: "",
    description: "",
  });

  const accountTypeLabels: Record<AccountType, string> = {
    aset: "Aset",
    kewajiban: "Kewajiban",
    ekuitas: "Ekuitas",
    pendapatan: "Pendapatan",
    beban: "Beban",
  };

  const handleAddAccount = () => {
    const account: Account = {
      id: (accounts.length + 1).toString(),
      code: newAccount.code,
      name: newAccount.name,
      type: newAccount.type,
      subtype: newAccount.subtype,
      balance: 0,
      is_active: true,
      description: newAccount.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setAccounts([...accounts, account]);
    setIsNewAccountOpen(false);
    setNewAccount({
      code: "",
      name: "",
      type: "aset",
      subtype: "",
      description: "",
    });
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    if (filterType === "semua") {
      return matchesSearch;
    } else {
      return matchesSearch && account.type === filterType;
    }
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bagan Akun</h1>
            <p className="text-muted-foreground mt-1">
              Kelola struktur akun keuangan perusahaan
            </p>
          </div>
          <Dialog open={isNewAccountOpen} onOpenChange={setIsNewAccountOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Tambah Akun</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Akun Baru</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Kode Akun
                  </label>
                  <Input
                    id="code"
                    value={newAccount.code}
                    onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                    placeholder="Contoh: 1-1000"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nama Akun
                  </label>
                  <Input
                    id="name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    placeholder="Nama akun"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Tipe Akun
                  </label>
                  <Select
                    value={newAccount.type}
                    onValueChange={(value) => setNewAccount({ ...newAccount, type: value as AccountType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe akun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aset">Aset</SelectItem>
                      <SelectItem value="kewajiban">Kewajiban</SelectItem>
                      <SelectItem value="ekuitas">Ekuitas</SelectItem>
                      <SelectItem value="pendapatan">Pendapatan</SelectItem>
                      <SelectItem value="beban">Beban</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="subtype" className="text-sm font-medium">
                    Subtipe
                  </label>
                  <Input
                    id="subtype"
                    value={newAccount.subtype}
                    onChange={(e) => setNewAccount({ ...newAccount, subtype: e.target.value })}
                    placeholder="Contoh: Aset Lancar"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Deskripsi
                  </label>
                  <Input
                    id="description"
                    value={newAccount.description}
                    onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                    placeholder="Deskripsi akun"
                  />
                </div>
                <Button onClick={handleAddAccount} className="mt-2">Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari akun berdasarkan kode atau nama..."
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
              <SelectItem value="semua">Semua Tipe</SelectItem>
              <SelectItem value="aset">Aset</SelectItem>
              <SelectItem value="kewajiban">Kewajiban</SelectItem>
              <SelectItem value="ekuitas">Ekuitas</SelectItem>
              <SelectItem value="pendapatan">Pendapatan</SelectItem>
              <SelectItem value="beban">Beban</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Subtipe</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Tidak ada akun yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{accountTypeLabels[account.type]}</TableCell>
                    <TableCell>{account.subtype}</TableCell>
                    <TableCell className="text-right">{formatRupiah(account.balance)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <FileText size={16} />
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

export default AccountChart;
