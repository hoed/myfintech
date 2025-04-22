
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah, formatDate } from "@/lib/formatter";
import { DebtReceivable } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebtReceivables } from "@/hooks/useDebtReceivables";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, CalendarIcon, PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const debtReceivableSchema = z.object({
  type: z.enum(["hutang", "piutang"]),
  entity_name: z.string().min(3, { message: "Nama entitas minimal 3 karakter" }),
  amount: z.coerce.number().min(1, { message: "Jumlah minimal 1" }),
  due_date: z.date(),
  status: z.enum(["belum_dibayar", "sebagian_dibayar", "lunas"]),
  description: z.string().optional(),
});

const DebtReceivables = () => {
  const { debtReceivables, isLoading, addDebtReceivable } = useDebtReceivables();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"semua" | "hutang" | "piutang">("semua");
  const [formData, setFormData] = useState({
    type: "hutang" as "hutang" | "piutang",
    entity_name: "",
    amount: 0,
    due_date: new Date(),
    status: "belum_dibayar" as "belum_dibayar" | "sebagian_dibayar" | "lunas",
    description: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof debtReceivableSchema>>({
    resolver: zodResolver(debtReceivableSchema),
    defaultValues: {
      type: "hutang",
      entity_name: "",
      amount: 0,
      due_date: new Date(),
      status: "belum_dibayar",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof debtReceivableSchema>) => {
    try {
      await addDebtReceivable.mutateAsync({
        ...values,
        due_date: format(values.due_date, "yyyy-MM-dd"),
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding debt/receivable:", error);
    }
  };

  const handleAddDebtReceivable = () => {
    if (!formData.entity_name || !formData.amount || !formData.due_date) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Harap mengisi semua field yang wajib",
      });
      return;
    }

    addDebtReceivable.mutate({
      type: formData.type,
      entity_name: formData.entity_name,
      amount: formData.amount,
      due_date: format(formData.due_date, "yyyy-MM-dd"),
      status: formData.status,
      description: formData.description || ""
    });

    // Reset form
    setFormData({
      type: "hutang",
      entity_name: "",
      amount: 0,
      due_date: new Date(),
      status: "belum_dibayar",
      description: ""
    });
    setIsDialogOpen(false);
  };

  const filteredData = debtReceivables.filter((item) => {
    if (tab === "semua") return true;
    return item.type === tab;
  });

  const totalHutang = debtReceivables
    .filter((item) => item.type === "hutang" && item.status !== "lunas")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPiutang = debtReceivables
    .filter((item) => item.type === "piutang" && item.status !== "lunas")
    .reduce((sum, item) => sum + item.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "belum_dibayar":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Belum Dibayar
          </span>
        );
      case "sebagian_dibayar":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Sebagian Dibayar
          </span>
        );
      case "lunas":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Lunas
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Hutang & Piutang</h1>
            <p className="text-muted-foreground mt-1">
              Kelola hutang dan piutang perusahaan
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle size={16} />
                Tambah Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Hutang / Piutang</DialogTitle>
                <DialogDescription>
                  Isi form berikut untuk menambahkan data baru
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hutang">Hutang</SelectItem>
                            <SelectItem value="piutang">Piutang</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="entity_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Entitas</FormLabel>
                        <FormControl>
                          <Input placeholder="PT Maju Bersama" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Jatuh Tempo</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd MMMM yyyy")
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="belum_dibayar">Belum Dibayar</SelectItem>
                            <SelectItem value="sebagian_dibayar">Sebagian Dibayar</SelectItem>
                            <SelectItem value="lunas">Lunas</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi (Opsional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Keterangan tambahan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={addDebtReceivable.isPending}>
                      {addDebtReceivable.isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-red-500" />
                Total Hutang
              </CardTitle>
              <CardDescription>Belum lunas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{formatRupiah(totalHutang)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-green-500" />
                Total Piutang
              </CardTitle>
              <CardDescription>Belum terbayar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{formatRupiah(totalPiutang)}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="semua" className="w-full" onValueChange={(v) => setTab(v as any)}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="semua">Semua</TabsTrigger>
                  <TabsTrigger value="hutang">Hutang</TabsTrigger>
                  <TabsTrigger value="piutang">Piutang</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="semua" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deskripsi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          Memuat data...
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          Belum ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.type === "hutang"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.type === "hutang" ? "Hutang" : "Piutang"}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{item.entity_name}</TableCell>
                          <TableCell>{formatRupiah(item.amount)}</TableCell>
                          <TableCell>{formatDate(item.due_date)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {item.description || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="hutang" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deskripsi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          Memuat data...
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          Belum ada data hutang
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.entity_name}</TableCell>
                          <TableCell>{formatRupiah(item.amount)}</TableCell>
                          <TableCell>{formatDate(item.due_date)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {item.description || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="piutang" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deskripsi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          Memuat data...
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          Belum ada data piutang
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.entity_name}</TableCell>
                          <TableCell>{formatRupiah(item.amount)}</TableCell>
                          <TableCell>{formatDate(item.due_date)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {item.description || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DebtReceivables;
