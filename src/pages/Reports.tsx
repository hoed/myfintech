import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/formatter";
import { Download, Printer, Filter, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useReports } from "@/hooks/useReports";

const Reports = () => {
  const { reports, isLoading, addReport } = useReports();
  const [reportPeriod, setReportPeriod] = useState("bulan-ini");
  const [activeTab, setActiveTab] = useState("laporan-keuangan");

  // Sample data for monthly financial report
  const monthlyData = [
    { name: "Jan", pendapatan: 125000000, pengeluaran: 82000000, laba: 43000000 },
    { name: "Feb", pendapatan: 145000000, pengeluaran: 96000000, laba: 49000000 },
    { name: "Mar", pendapatan: 130000000, pengeluaran: 85000000, laba: 45000000 },
    { name: "Apr", pendapatan: 170000000, pengeluaran: 105000000, laba: 65000000 },
    { name: "Mei", pendapatan: 190000000, pengeluaran: 120000000, laba: 70000000 },
    { name: "Jun", pendapatan: 200000000, pengeluaran: 130000000, laba: 70000000 },
  ];

  // Sample data for expenses by category
  const expenseData = [
    { name: "Beban Gaji", value: 45000000 },
    { name: "Beban Operasional", value: 25000000 },
    { name: "Beban Sewa", value: 15000000 },
    { name: "Beban Utilitas", value: 8000000 },
    { name: "Beban Pemasaran", value: 10000000 },
    { name: "Beban Lainnya", value: 7000000 },
  ];

  // Sample data for tax reports
  const taxData = [
    { bulan: "Jan", ppn: 12500000, pph21: 8000000, pph23: 3000000, pph25: 5000000 },
    { bulan: "Feb", ppn: 14500000, pph21: 8500000, pph23: 3500000, pph25: 5000000 },
    { bulan: "Mar", ppn: 13000000, pph21: 8200000, pph23: 3200000, pph25: 5000000 },
    { bulan: "Apr", ppn: 17000000, pph21: 9000000, pph23: 4000000, pph25: 5000000 },
    { bulan: "Mei", ppn: 19000000, pph21: 9500000, pph23: 4500000, pph25: 5000000 },
    { bulan: "Jun", ppn: 20000000, pph21: 10000000, pph23: 5000000, pph25: 5000000 },
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <p className="text-sm font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatRupiah(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const generateReport = async () => {
      if (reportPeriod === "bulan-ini") {
        const now = new Date();
        await addReport.mutateAsync({
          date: now.toISOString(),
          type: 'monthly',
          income: monthlyData[monthlyData.length - 1].pendapatan,
          expense: monthlyData[monthlyData.length - 1].pengeluaran,
        });
      }
    };

    generateReport();
  }, [reportPeriod]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Laporan</h1>
            <p className="text-muted-foreground mt-1">
              Lihat dan unduh laporan keuangan perusahaan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
                <SelectItem value="kuartal-ini">Kuartal Ini</SelectItem>
                <SelectItem value="tahun-ini">Tahun Ini</SelectItem>
                <SelectItem value="kustom">Periode Kustom</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Download size={16} />
                  <span>Ekspor</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Ekspor ke PDF</DropdownMenuItem>
                <DropdownMenuItem>Ekspor ke Excel</DropdownMenuItem>
                <DropdownMenuItem>Ekspor ke CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon">
              <Printer size={16} />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="laporan-keuangan" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="laporan-keuangan">Laporan Keuangan</TabsTrigger>
            <TabsTrigger value="laporan-pajak">Laporan Pajak</TabsTrigger>
            <TabsTrigger value="analisis-pengeluaran">Analisis Pengeluaran</TabsTrigger>
            <TabsTrigger value="arus-kas">Arus Kas</TabsTrigger>
          </TabsList>

          <TabsContent value="laporan-keuangan" className="mt-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Laporan Laba Rugi Bulanan</CardTitle>
                  <CardDescription>Perbandingan pendapatan dan pengeluaran bulanan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat('id-ID', {
                              notation: 'compact',
                              compactDisplay: 'short',
                            }).format(value)
                          }
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="pendapatan" name="Pendapatan" fill="#34A853" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#EA4335" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="laba" name="Laba Bersih" fill="#1A73E8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Ringkasan Keuangan</CardTitle>
                  <CardDescription>Periode: {reportPeriod === "bulan-ini" ? "Juni 2023" : "Q2 2023"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Total Pendapatan</h3>
                      <p className="text-2xl font-bold">{formatRupiah(200000000)}</p>
                      <p className="text-sm text-success">+5% dari periode sebelumnya</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Total Pengeluaran</h3>
                      <p className="text-2xl font-bold">{formatRupiah(130000000)}</p>
                      <p className="text-sm text-danger">+8% dari periode sebelumnya</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Laba Bersih</h3>
                      <p className="text-2xl font-bold">{formatRupiah(70000000)}</p>
                      <p className="text-sm text-success">+2% dari periode sebelumnya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="laporan-pajak" className="mt-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Laporan Pajak Bulanan</CardTitle>
                  <CardDescription>Rekap pajak PPN, PPh 21, PPh 23, dan PPh 25</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={taxData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bulan" />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat('id-ID', {
                              notation: 'compact',
                              compactDisplay: 'short',
                            }).format(value)
                          }
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="ppn" name="PPN" fill="#1A73E8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pph21" name="PPh 21" fill="#8B87F5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pph23" name="PPh 23" fill="#34A853" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pph25" name="PPh 25" fill="#FBBC05" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Ringkasan Pajak</CardTitle>
                  <CardDescription>Periode: {reportPeriod === "bulan-ini" ? "Juni 2023" : "Q2 2023"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">PPN</h3>
                      <p className="text-xl font-bold">{formatRupiah(20000000)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">PPh 21</h3>
                      <p className="text-xl font-bold">{formatRupiah(10000000)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">PPh 23</h3>
                      <p className="text-xl font-bold">{formatRupiah(5000000)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">PPh 25</h3>
                      <p className="text-xl font-bold">{formatRupiah(5000000)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analisis-pengeluaran" className="mt-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle>Pengeluaran Berdasarkan Kategori</CardTitle>
                  <CardDescription>Periode: {reportPeriod === "bulan-ini" ? "Juni 2023" : "Q2 2023"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend layout="vertical" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>Detail Pengeluaran</CardTitle>
                  <CardDescription>Perincian pengeluaran berdasarkan kategori</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenseData.map((expense, index) => (
                      <div key={`expense-${index}`} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{expense.name}</span>
                          <span>{formatRupiah(expense.value)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${(expense.value / expenseData.reduce((total, exp) => total + exp.value, 0)) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="arus-kas" className="mt-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Arus Kas Bulanan</CardTitle>
                  <CardDescription>Pergerakan kas masuk dan keluar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat('id-ID', {
                              notation: 'compact',
                              compactDisplay: 'short',
                            }).format(value)
                          }
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="pendapatan" name="Kas Masuk" stroke="#34A853" strokeWidth={2} />
                        <Line type="monotone" dataKey="pengeluaran" name="Kas Keluar" stroke="#EA4335" strokeWidth={2} />
                        <Line type="monotone" dataKey="laba" name="Arus Kas Bersih" stroke="#1A73E8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Ringkasan Arus Kas</CardTitle>
                  <CardDescription>Periode: {reportPeriod === "bulan-ini" ? "Juni 2023" : "Q2 2023"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Saldo Awal</h3>
                      <p className="text-xl font-bold">{formatRupiah(650000000)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Kas Masuk</h3>
                      <p className="text-xl font-bold text-success">{formatRupiah(200000000)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Kas Keluar</h3>
                      <p className="text-xl font-bold text-danger">{formatRupiah(130000000)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Saldo Akhir</h3>
                      <p className="text-xl font-bold">{formatRupiah(720000000)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
