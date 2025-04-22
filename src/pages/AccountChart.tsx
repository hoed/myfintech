
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, FileDown, Edit, Trash, Check, X } from "lucide-react";
import { formatRupiah } from "@/lib/formatter";
import { useChartOfAccounts } from "@/hooks/useChartOfAccounts";
import { toast } from "@/hooks/use-toast";
import { Account, AccountType } from "@/types";

const AccountChart = () => {
  const { accounts, isLoading, addAccount, updateAccount, deleteAccount } = useChartOfAccounts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("semua");
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  
  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "aset" as AccountType,
    subtype: "",
    description: "",
    balance: 0,
  });

  const accountTypes = [
    { value: "aset", label: "Aset" },
    { value: "kewajiban", label: "Kewajiban" },
    { value: "ekuitas", label: "Ekuitas" },
    { value: "pendapatan", label: "Pendapatan" },
    { value: "beban", label: "Beban" },
  ];

  const handleAddAccount = () => {
    addAccount.mutate({
      ...newAccount,
      is_active: true,
    }, {
      onSuccess: () => {
        setIsNewAccountOpen(false);
        setNewAccount({
          code: "",
          name: "",
          type: "aset",
          subtype: "",
          description: "",
          balance: 0,
        });
      }
    });
  };

  const handleEditAccount = () => {
    if (currentAccount) {
      updateAccount.mutate(currentAccount, {
        onSuccess: () => {
          setEditAccountOpen(false);
          setCurrentAccount(null);
        }
      });
    }
  };

  const handleDeleteAccount = () => {
    if (currentAccount) {
      deleteAccount.mutate(currentAccount.id, {
        onSuccess: () => {
          setDeleteAccountOpen(false);
          setCurrentAccount(null);
        }
      });
    }
  };

  const openEditDialog = (account: Account) => {
    setCurrentAccount(account);
    setEditAccountOpen(true);
  };

  const openDeleteDialog = (account: Account) => {
    setCurrentAccount(account);
    setDeleteAccountOpen(true);
  };

  const filteredAccounts = accounts
    .filter((account) => 
      (account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
       account.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "semua" || account.type === filterType)
    )
    .sort((a, b) => a.code.localeCompare(b.code));

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Kode", "Nama", "Tipe", "Subtipe", "Deskripsi", "Saldo"];
    const rows = filteredAccounts.map(account => [
      account.code,
      account.name,
      account.type,
      account.subtype || "",
      account.description || "",
      account.balance?.toString() || "0"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "bagan_akun_" + new Date().toISOString().split("T")[0] + ".csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Ekspor Berhasil",
      description: "Bagan akun telah berhasil diekspor ke CSV",
    });
  };

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

          <div className="flex gap-2">
            <Button
              variant="outline" 
              className="flex items-center gap-2"
              onClick={exportToCSV}
            >
              <FileDown size={16} />
              <span>Ekspor</span>
            </Button>
            
            <Dialog open={isNewAccountOpen} onOpenChange={setIsNewAccountOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Tambah Akun</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Akun Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan akun baru ke bagan akun perusahaan
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code">Kode Akun</Label>
                      <Input
                        id="code"
                        value={newAccount.code}
                        onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                        placeholder="Contoh: 1-1000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nama Akun</Label>
                      <Input
                        id="name"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                        placeholder="Nama akun"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Tipe Akun</Label>
                      <Select
                        value={newAccount.type}
                        onValueChange={(value) => setNewAccount({ ...newAccount, type: value as AccountType })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe akun" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="subtype">Subtipe (Opsional)</Label>
                      <Input
                        id="subtype"
                        value={newAccount.subtype}
                        onChange={(e) => setNewAccount({ ...newAccount, subtype: e.target.value })}
                        placeholder="Subtipe akun"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="balance">Saldo Awal</Label>
                    <Input
                      id="balance"
                      type="number"
                      value={newAccount.balance.toString()}
                      onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Deskripsi (Opsional)</Label>
                    <Textarea
                      id="description"
                      value={newAccount.description}
                      onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                      placeholder="Deskripsi singkat tentang akun ini"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddAccount}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
              {accountTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Tabel</TabsTrigger>
            <TabsTrigger value="tree">Struktur Pohon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Akun</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Subtipe</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Tidak ada akun yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {accountTypes.find(t => t.value === account.type)?.label || account.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.subtype || "-"}</TableCell>
                      <TableCell className="text-right">{formatRupiah(account.balance || 0)}</TableCell>
                      <TableCell className="text-center">
                        {account.is_active ? (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            Nonaktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(account)}>
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(account)}>
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="tree">
            <div className="rounded-lg border p-6 shadow-sm">
              <p className="text-center text-muted-foreground">Tampilan struktur pohon bagan akun akan segera hadir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Account Dialog */}
      <Dialog open={editAccountOpen} onOpenChange={setEditAccountOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Akun</DialogTitle>
            <DialogDescription>
              Ubah informasi akun {currentAccount?.name}
            </DialogDescription>
          </DialogHeader>
          {currentAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-code">Kode Akun</Label>
                  <Input
                    id="edit-code"
                    value={currentAccount.code}
                    onChange={(e) => setCurrentAccount({ ...currentAccount, code: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nama Akun</Label>
                  <Input
                    id="edit-name"
                    value={currentAccount.name}
                    onChange={(e) => setCurrentAccount({ ...currentAccount, name: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Tipe Akun</Label>
                  <Select
                    value={currentAccount.type}
                    onValueChange={(value) => setCurrentAccount({ ...currentAccount, type: value as AccountType })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Pilih tipe akun" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-subtype">Subtipe (Opsional)</Label>
                  <Input
                    id="edit-subtype"
                    value={currentAccount.subtype || ""}
                    onChange={(e) => setCurrentAccount({ ...currentAccount, subtype: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-balance">Saldo</Label>
                <Input
                  id="edit-balance"
                  type="number"
                  value={currentAccount.balance?.toString() || "0"}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, balance: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Deskripsi (Opsional)</Label>
                <Textarea
                  id="edit-description"
                  value={currentAccount.description || ""}
                  onChange={(e) => setCurrentAccount({ ...currentAccount, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-status" className="flex-shrink-0">Status Aktif</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant={currentAccount.is_active ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => setCurrentAccount({ ...currentAccount, is_active: true })}
                  >
                    <Check size={16} />
                    <span>Aktif</span>
                  </Button>
                  <Button
                    type="button"
                    variant={!currentAccount.is_active ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => setCurrentAccount({ ...currentAccount, is_active: false })}
                  >
                    <X size={16} />
                    <span>Nonaktif</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditAccount}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Akun</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus akun {currentAccount?.code} - {currentAccount?.name}?
              Akun yang telah digunakan dalam transaksi tidak dapat dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AccountChart;
