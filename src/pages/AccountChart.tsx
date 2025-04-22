
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/formatter";
import { Plus, Search, Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Account } from "@/types";
import { useChartOfAccounts } from "@/hooks/useChartOfAccounts";

const AccountChart = () => {
  const { accounts, addAccount, updateAccount, deleteAccount, isLoading } = useChartOfAccounts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("aset");
  
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const [newAccount, setNewAccount] = useState<Omit<Account, 'id' | 'created_at' | 'updated_at'>>({
    code: "",
    name: "",
    type: "aset",
    subtype: "",
    description: "",
    is_active: true,
    balance: 0,
  });

  const accountTypes = [
    { value: "aset", label: "Aset" },
    { value: "kewajiban", label: "Kewajiban" },
    { value: "ekuitas", label: "Ekuitas" },
    { value: "pendapatan", label: "Pendapatan" },
    { value: "biaya", label: "Biaya" },
  ];

  const subtypeOptions = {
    aset: [
      { value: "lancar", label: "Aset Lancar" },
      { value: "tetap", label: "Aset Tetap" },
      { value: "tidak_berwujud", label: "Aset Tidak Berwujud" },
    ],
    kewajiban: [
      { value: "jangka_pendek", label: "Kewajiban Jangka Pendek" },
      { value: "jangka_panjang", label: "Kewajiban Jangka Panjang" },
    ],
    ekuitas: [
      { value: "modal", label: "Modal" },
      { value: "laba_ditahan", label: "Laba Ditahan" },
    ],
    pendapatan: [
      { value: "operasional", label: "Pendapatan Operasional" },
      { value: "non_operasional", label: "Pendapatan Non-Operasional" },
    ],
    biaya: [
      { value: "operasional", label: "Biaya Operasional" },
      { value: "non_operasional", label: "Biaya Non-Operasional" },
    ],
  };

  const subtypeMap: Record<string, string> = {
    lancar: "Aset Lancar",
    tetap: "Aset Tetap",
    tidak_berwujud: "Aset Tidak Berwujud",
    jangka_pendek: "Kewajiban Jangka Pendek",
    jangka_panjang: "Kewajiban Jangka Panjang",
    modal: "Modal",
    laba_ditahan: "Laba Ditahan",
    operasional: "Operasional",
    non_operasional: "Non-Operasional",
  };

  const typeLabels: Record<string, string> = {
    aset: "Aset",
    kewajiban: "Kewajiban",
    ekuitas: "Ekuitas",
    pendapatan: "Pendapatan",
    biaya: "Biaya",
  };

  const handleAddAccount = () => {
    if (!newAccount.code || !newAccount.name || !newAccount.type) {
      alert("Mohon lengkapi data akun!");
      return;
    }

    addAccount.mutate(newAccount, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setNewAccount({
          code: "",
          name: "",
          type: "aset",
          subtype: "",
          description: "",
          is_active: true,
          balance: 0,
        });
      },
    });
  };

  const handleEditAccount = () => {
    if (!selectedAccount) return;

    updateAccount.mutate(selectedAccount, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setSelectedAccount(null);
      },
    });
  };

  const handleDeleteAccount = () => {
    if (!selectedAccount) return;

    deleteAccount.mutate(selectedAccount.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedAccount(null);
      },
    });
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearchTerm =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    if (filterType === "all") {
      return matchesSearchTerm;
    } else if (filterType === "active") {
      return matchesSearchTerm && account.is_active;
    } else if (filterType === "inactive") {
      return matchesSearchTerm && !account.is_active;
    } else {
      return matchesSearchTerm && account.type === filterType;
    }
  });

  const filterAccountsByType = (type: string) => {
    return filteredAccounts.filter((account) => account.type === type);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bagan Akun</h1>
            <p className="text-muted-foreground mt-1">
              Kelola akun-akun keuangan di perusahaan anda
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Tambah Akun</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Tambah Akun Baru</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="code">Kode Akun</Label>
                    <Input
                      id="code"
                      value={newAccount.code}
                      onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                      placeholder="Contoh: 1-1001"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
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
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="type">Jenis Akun</Label>
                    <Select
                      value={newAccount.type}
                      onValueChange={(value) => setNewAccount({ 
                        ...newAccount, 
                        type: value,
                        subtype: "" // Reset subtype when type changes
                      })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Pilih jenis akun" />
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
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="subtype">Sub Jenis</Label>
                    <Select
                      value={newAccount.subtype || ""}
                      onValueChange={(value) => setNewAccount({ ...newAccount, subtype: value })}
                    >
                      <SelectTrigger id="subtype">
                        <SelectValue placeholder="Pilih sub jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        {newAccount.type && subtypeOptions[newAccount.type as keyof typeof subtypeOptions]?.map((subtype) => (
                          <SelectItem key={subtype.value} value={subtype.value}>
                            {subtype.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={newAccount.description || ""}
                    onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                    placeholder="Deskripsi akun (opsional)"
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="balance">Saldo Awal</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={newAccount.balance || 0}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newAccount.is_active}
                      onCheckedChange={(checked) => setNewAccount({ ...newAccount, is_active: checked })}
                    />
                    <Label htmlFor="active">Akun Aktif</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="button" onClick={handleAddAccount} disabled={addAccount.isPending}>
                  {addAccount.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari akun berdasarkan nama, kode, atau deskripsi..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter akun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Akun</SelectItem>
              <SelectItem value="active">Akun Aktif</SelectItem>
              <SelectItem value="inactive">Akun Nonaktif</SelectItem>
              <SelectItem value="aset">Aset</SelectItem>
              <SelectItem value="kewajiban">Kewajiban</SelectItem>
              <SelectItem value="ekuitas">Ekuitas</SelectItem>
              <SelectItem value="pendapatan">Pendapatan</SelectItem>
              <SelectItem value="biaya">Biaya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="flex overflow-auto">
            {accountTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {accountTypes.map((type) => (
            <TabsContent key={type.value} value={type.value}>
              <div className="rounded-lg border shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Kode</TableHead>
                      <TableHead>Nama Akun</TableHead>
                      <TableHead>Sub Jenis</TableHead>
                      <TableHead>Saldo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          Memuat data akun...
                        </TableCell>
                      </TableRow>
                    ) : filterAccountsByType(type.value).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          Tidak ada akun yang ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterAccountsByType(type.value).map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-mono">{account.code}</TableCell>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell>
                            {account.subtype ? subtypeMap[account.subtype] || account.subtype : "-"}
                          </TableCell>
                          <TableCell>{formatRupiah(account.balance || 0)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={account.is_active ? "default" : "secondary"}
                              className="flex items-center gap-1 w-fit"
                            >
                              {account.is_active ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Aktif</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3" />
                                  <span>Nonaktif</span>
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Akun</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-code">Kode Akun</Label>
                  <Input
                    id="edit-code"
                    value={selectedAccount.code}
                    onChange={(e) =>
                      setSelectedAccount({ ...selectedAccount, code: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-name">Nama Akun</Label>
                  <Input
                    id="edit-name"
                    value={selectedAccount.name}
                    onChange={(e) =>
                      setSelectedAccount({ ...selectedAccount, name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-type">Jenis Akun</Label>
                  <Select
                    value={selectedAccount.type}
                    onValueChange={(value) =>
                      setSelectedAccount({ 
                        ...selectedAccount, 
                        type: value,
                        subtype: "" // Reset subtype when type changes
                      })
                    }
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Pilih jenis akun" />
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-subtype">Sub Jenis</Label>
                  <Select
                    value={selectedAccount.subtype || ""}
                    onValueChange={(value) =>
                      setSelectedAccount({ ...selectedAccount, subtype: value })
                    }
                  >
                    <SelectTrigger id="edit-subtype">
                      <SelectValue placeholder="Pilih sub jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAccount.type && 
                        subtypeOptions[selectedAccount.type as keyof typeof subtypeOptions]?.map((subtype) => (
                          <SelectItem key={subtype.value} value={subtype.value}>
                            {subtype.label}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={selectedAccount.description || ""}
                  onChange={(e) =>
                    setSelectedAccount({
                      ...selectedAccount,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-balance">Saldo</Label>
                <Input
                  id="edit-balance"
                  type="number"
                  value={selectedAccount.balance || 0}
                  onChange={(e) =>
                    setSelectedAccount({
                      ...selectedAccount,
                      balance: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={selectedAccount.is_active}
                    onCheckedChange={(checked) =>
                      setSelectedAccount({
                        ...selectedAccount,
                        is_active: checked,
                      })
                    }
                  />
                  <Label htmlFor="edit-active">Akun Aktif</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={handleEditAccount} disabled={updateAccount.isPending}>
              {updateAccount.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedAccount?.is_active
                ? "Nonaktifkan Akun"
                : "Hapus Akun"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAccount?.is_active
                ? "Akun yang sudah digunakan dalam transaksi tidak dapat dihapus. Apakah Anda ingin menonaktifkan akun ini?"
                : "Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className={selectedAccount?.is_active ? "bg-yellow-600 hover:bg-yellow-700" : "bg-destructive hover:bg-destructive/90"}
            >
              {deleteAccount.isPending
                ? "Memproses..."
                : selectedAccount?.is_active
                ? "Nonaktifkan"
                : "Hapus"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AccountChart;
