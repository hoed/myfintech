import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/formatter";
import { Download, Printer, FileText, ChevronDown } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const { reports, isLoading, addReport } = useReports();
  const [reportPeriod, setReportPeriod] = useState("bulan-ini");
  const [activeTab, setActiveTab] = useState("laporan-keuangan");
  const navigate = useNavigate();

  // Transform reports data for financial report
  const financialData = reports
    .filter(r => r.type === 'monthly')
    .map(r => {
      const date = new Date(r.date);
      return {
        name: date.toLocaleString('id-ID', { month: 'short' }),
        pendapatan: r.income || 0,
        pengeluaran: r.expense || 0,
        laba: r.profit || 0,
      };
    })
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
    .slice(0, 6); // Limit to last 6 months for display

  // Aggregate total expenses for the selected period and mock category breakdown
  const totalExpenses = reports
    .filter(r => {
      const date = new Date(r.date);
      const now = new Date();
      if (reportPeriod === "bulan-ini") {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      return true; // Adjust for other periods if needed
    })
    .reduce((sum, r) => sum + (r.expense || 0), 0);

  const expenseData = totalExpenses > 0 ? [
    { name: "Beban Gaji", value: totalExpenses * 0.35 }, // 35%
    { name: "Beban Operasional", value: totalExpenses * 0.20 }, // 20%
    { name: "Beban Sewa", value: totalExpenses * 0.15 }, // 15%
    { name: "Beban Utilitas", value: totalExpenses * 0.10 }, // 10%
    { name: "Beban Pemasaran", value: totalExpenses * 0.10 }, // 10%
    { name: "Beban Lainnya", value: totalExpenses * 0.10 }, // 10%
  ] : [];

  // Transform tax reports data
  const taxReports = reports.filter(r => 
    r.type?.toLowerCase().includes('ppn') || 
    r.type?.toLowerCase().includes('pph21') || 
    r.type?.toLowerCase().includes('pph23') || 
    r.type?.toLowerCase().includes('pph25')
  );

  const taxData = taxReports.reduce((acc, r) => {
    const date = new Date(r.date);
    const month = date.toLocaleString('id-ID', { month: 'short' });
    const existing = acc.find(d => d.bulan === month) || { bulan: month, ppn: 0, pph21: 0, pph23: 0, pph25: 0 };
    
    if (r.type.toLowerCase().includes('ppn')) existing.ppn += r.expense || 0;
    if (r.type.toLowerCase().includes('pph21')) existing.pph21 += r.expense || 0;
    if (r.type.toLowerCase().includes('pph23')) existing.pph23 += r.expense || 0;
    if (r.type.toLowerCase().includes('pph25')) existing.pph25 += r.expense || 0;
    
    if (!acc.find(d => d.bulan === month)) acc.push(existing);
    return acc;
  }, [] as { bulan: string; ppn: number; pph21: number; pph23: number; pph25: number }[])
  .sort((a, b) => new Date(a.bulan).getTime() - new Date(b.bulan).getTime())
  .slice(0, 6); // Limit to last 6 months

  // Calculate summary data for the selected period
  const summaryData = reports
    .filter(r => {
      const date = new Date(r.date);
      const now = new Date();
      if (reportPeriod === "bulan-ini") {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      return true; // Adjust for other periods if needed
    })
    .reduce(
      (acc, r) => ({
        totalPendapatan: acc.totalPendapatan + (r.income || 0),
        totalPengeluaran: acc.totalPengeluaran + (r.expense || 0),
        labaBersih: acc.labaBersih + (r.profit || 0),
      }),
      { totalPendapatan: 0, totalPengeluaran: 0, labaBersih: 0 }
    );

  const taxSummary = taxData.reduce(
    (acc, d) => ({
      ppn: acc.ppn + d.ppn,
      pph21: acc.pph21 + d.pph21,
      pph23: acc.pph23 + d.pph23,
      pph25: acc.pph25 + d.pph25,
    }),
    { ppn: 0, pph21: 0, pph23: 0, pph25: 0 }
  );

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

  const handleExport = (format: string) => {
    const currentTab = activeTab;
    const period = reportPeriod;
    
    toast({
      title: `Laporan ${currentTab.replace('-', ' ')} diekspor`,
      description: `Format: ${format}, Periode: ${period}`,
    });
  };

  const createDailyReport = async () => {
    try {
      const now = new Date();
      await addReport.mutateAsync({
        date: now.toISOString().substring(0, 10),
        type: 'daily_report',
        income: Math.floor(Math.random() * 5000000) + 1000000,
        expense: Math.floor(Math.random() * 3000000) + 500000,
      });
      
      toast({
        title: "Laporan harian berhasil dibuat",
        description: `Tanggal: ${now.toLocaleDateString('id-ID')}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal membuat laporan harian",
        description: "Terjadi kesalahan saat membuat laporan harian",
      });
    }
  };

  const goToTaxReports = () => {
    navigate('/pajak');
  };

  useEffect(() => {
    const generateReport = async () => {
      if (reportPeriod === "bulan-ini" && financialData.length === 0) {
        const now = new Date();
        await addReport.mutateAsync({
          date: now.toISOString(),
          type: 'monthly',
          income: Math.floor(Math.random() * 100000000) + 50000000,
          expense: Math.floor(Math.random() * 60000000) + 30000000,
        });
      }
    };

    generateReport();
  }, [reportPeriod]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                <DropdownMenuItem onClick={() => handleExport('PDF')}>
                  Ekspor ke PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('Excel')}>
                  Ekspor ke Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('CSV')}>
                  Ekspor ke CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" onClick={() => window.print()}>
              <Printer size={16} />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={createDailyReport} className="gap-1">
            <FileText size={16} />
            <span>Buat Laporan Harian</span>
          </Button>
          <Button variant="outline" onClick={goToTaxReports} className="gap-1">
            <FileText size={16} />
            <span>Lihat Laporan Pajak</span>
          </Button>
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
                    {financialData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={financialData}
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
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Tidak ada data keuangan untuk periode ini.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Ringkasan Keuangan</CardTitle>
                  <CardDescription>Periode: {reportPeriod === "bulan-ini" ? new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }) : "Q2 2023"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Total Pendapatan</h3>
                      <p className="text-2xl font-bold">{formatRupiah(summaryData.totalPendapatan)}</p>
                      <p className="text-sm text-success">Data dari database</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Total Pengeluaran</h3>
                      <p className="text-2xl font-bold">{formatRupiah(summaryData.totalPengeluaran)}</p>
                      <p className="text-sm text-danger">Data dari database</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Laba Bersih</h3>
                      <p className="text-2xl font-bold">{formatRupiah(summaryData.labaBersih)}</p>
                      <p className="text-sm text-success">Data dari database</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="laporan-pajak" className="mt-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <Card className="md:col-span-3">
                <CardHeader className="pb-3 flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Laporan Pajak Bulanan</CardTitle>
                    <CardDescription>Rekap pajak PPN, PPh 21, PPh 23, dan PPh 25</CardDescription>
                  </div>
                  {taxReports.length > 0 && (
                    <Button variant="outline" size="sm" onClick={goToTaxReports}>
                      Lihat Semua
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    {taxData.length > 0 ? (
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
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Tidak ada data pajak untuk periode ini.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Ringkasan Pajak</CardTitle>
                  <CardDescription>Periode: {reportPeriod === "bulan-ini" ? new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }) : "Q2 2023"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">PPN</h3>
                      <p className="text-xl font-bold">{formatRupiah(taxSummary.ppn)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">PPh 21</h3>
                      <p className="text-xl font-bold">{formatRupiah(taxSummary.pph21)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">PPh 23</h3>
                      <p className="text-xl font-bold">{formatRupiah(taxSummary.pph23)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">PPh 25</h3>
                      <p className="text-xl font-bold">{formatRupiah(taxSummary.pph25)}</p>
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
                  <CardDescription>Periode: {reportPeriod === "bulan-ini" ? new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }) : "Q2 2023"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {expenseData.length > 0 ? (
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
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Tidak ada data pengeluaran untuk periode ini.</p>
                      </div>
                    )}
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
                    {expenseData.length > 0 ? (
                      expenseData.map((expense, index) => (
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
                      ))
                    ) : (
                      <p className="text-muted-foreground">Tidak ada data pengeluaran untuk periode ini.</p>
                    )}
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
                    {financialData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={financialData}
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
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Tidak ada data arus kas untuk periode ini.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Ringkasan Arus Kas</CardTitle>
                  <CardDescription>Periode: {reportPeriod === "bulan-ini" ? new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }) : "Q2 2023"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Saldo Awal</h3>
                      <p className="text-xl font-bold">{formatRupiah(summaryData.totalPendapatan - summaryData.labaBersih)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Kas Masuk</h3>
                      <p className="text-xl font-bold text-success">{formatRupiah(summaryData.totalPendapatan)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Kas Keluar</h3>
                      <p className="text-xl font-bold text-danger">{formatRupiah(summaryData.totalPengeluaran)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-muted-foreground">Saldo Akhir</h3>
                      <p className="text-xl font-bold">{formatRupiah(summaryData.totalPendapatan - summaryData.totalPengeluaran)}</p>
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