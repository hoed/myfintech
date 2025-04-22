
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/lib/formatter";
import { BankAccount } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const bankAccountSchema = z.object({
  name: z.string().min(3, { message: "Nama rekening minimal 3 karakter" }),
  account_number: z.string().min(5, { message: "Nomor rekening minimal 5 karakter" }),
  bank_name: z.string().min(2, { message: "Nama bank minimal 2 karakter" }),
  balance: z.coerce.number().min(0, { message: "Saldo minimal 0" }),
  currency: z.enum(["IDR", "USD"]),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

const BankAccounts = () => {
  const { bankAccounts, isLoading, addBankAccount } = useBankAccounts();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<BankAccountFormData>({
    name: "",
    account_number: "",
    bank_name: "",
    currency: "IDR",
    balance: 0,
    description: "",
    is_active: true
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof bankAccountSchema>>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      name: "",
      account_number: "",
      bank_name: "",
      balance: 0,
      currency: "IDR",
      description: "",
      is_active: true,
    },
  });

  const handleAddAccount = () => {
    if (!formData.name || !formData.account_number || !formData.bank_name || !formData.currency) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field wajib diisi",
      });
      return;
    }

    // Make sure all required fields are properly defined
    const newAccount: Omit<BankAccount, "id" | "created_at" | "updated_at"> = {
      name: formData.name,
      account_number: formData.account_number,
      bank_name: formData.bank_name,
      currency: formData.currency,
      balance: formData.balance,
      description: formData.description || "",
      is_active: formData.is_active
    };
    
    addBankAccount.mutate(newAccount);

    setFormData({
      name: "",
      account_number: "",
      bank_name: "",
      currency: "IDR",
      balance: 0,
      description: "",
      is_active: true
    });
    setIsDialogOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof bankAccountSchema>) => {
    try {
      // Ensure all required properties are provided
      const newAccount: Omit<BankAccount, "id" | "created_at" | "updated_at"> = {
        name: values.name,
        account_number: values.account_number,
        bank_name: values.bank_name,
        currency: values.currency,
        balance: values.balance,
        description: values.description || "",
        is_active: values.is_active
      };
      
      await addBankAccount.mutateAsync(newAccount);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding bank account:", error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Rekening Bank</h1>
            <p className="text-muted-foreground mt-1">
              Kelola semua rekening bank perusahaan
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle size={16} />
                Tambah Rekening
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Rekening Bank</DialogTitle>
                <DialogDescription>
                  Isi form berikut untuk menambahkan rekening bank baru
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Rekening</FormLabel>
                        <FormControl>
                          <Input placeholder="Rekening Operasional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="account_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Rekening</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bank_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Bank</FormLabel>
                          <FormControl>
                            <Input placeholder="BCA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="balance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saldo Awal</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mata Uang</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih mata uang" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="IDR">IDR - Rupiah</SelectItem>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi (Opsional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Rekening untuk operasional perusahaan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={addBankAccount.isPending}>
                      {addBankAccount.isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Total Saldo (IDR)
              </CardTitle>
              <CardDescription>Semua rekening dalam Rupiah</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatRupiah(
                  bankAccounts
                    .filter((account) => account.currency === "IDR")
                    .reduce((sum, account) => sum + account.balance, 0)
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Total Saldo (USD)
              </CardTitle>
              <CardDescription>Semua rekening dalam Dollar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${" "}
                {bankAccounts
                  .filter((account) => account.currency === "USD")
                  .reduce((sum, account) => sum + account.balance, 0)
                  .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-500" />
                Jumlah Rekening
              </CardTitle>
              <CardDescription>Total rekening aktif</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{bankAccounts.filter(account => account.is_active).length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Rekening Bank</CardTitle>
            <CardDescription>Semua rekening bank yang terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Rekening</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>No. Rekening</TableHead>
                  <TableHead>Mata Uang</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : bankAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Belum ada data rekening bank
                    </TableCell>
                  </TableRow>
                ) : (
                  bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.bank_name}</TableCell>
                      <TableCell>{account.account_number}</TableCell>
                      <TableCell>{account.currency}</TableCell>
                      <TableCell className="text-right">
                        {account.currency === "IDR"
                          ? formatRupiah(account.balance)
                          : `$ ${account.balance.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            account.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {account.is_active ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BankAccounts;
