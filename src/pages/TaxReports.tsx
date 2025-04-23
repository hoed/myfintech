
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Plus, FileText, FileChartLine, ArrowRight } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { formatRupiah } from "@/lib/formatter";
import { TaxType } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "@/hooks/use-toast";

const TAX_TYPES = [
  { key: "ppn", label: "PPN", reportType: "monthly" },
  { key: "pph21", label: "PPh 21", reportType: "monthly" },
  { key: "pph23", label: "PPh 23", reportType: "monthly" },
  { key: "pph25", label: "PPh 25", reportType: "monthly" },
];

const TaxReports: React.FC = () => {
  const { reports, isLoading, addReport } = useReports();
  const { addTransaction } = useTransactions();
  const [newDialog, setNewDialog] = useState(false);
  const [newType, setNewType] = useState("ppn");
  const [newIncome, setNewIncome] = useState(0);
  const [newExpense, setNewExpense] = useState(0);
  const navigate = useNavigate();

  const taxReports = reports.filter((r: any) =>
    TAX_TYPES.some(t => r.type?.toLowerCase()?.includes(t.key))
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedTaxType = TAX_TYPES.find(t => t.key === newType);
    const reportType = selectedTaxType?.reportType === "monthly" ? "monthly" :
                       selectedTaxType?.reportType === "daily" ? "daily" : "yearly";
                       
    const newReport = await addReport.mutateAsync({
      date: new Date().toISOString().substring(0, 10),
      type: newType,
      income: newIncome,
      expense: newExpense,
      reportType: reportType,
    });
    
    setNewDialog(false);
    setNewType("ppn");
    setNewIncome(0);
    setNewExpense(0);
    
    // Create corresponding transaction
    try {
      if (newReport) {
        await addTransaction.mutateAsync({
          date: new Date().toISOString().substring(0, 10),
          description: `Laporan Pajak ${selectedTaxType?.label || newType}`,
          amount: newExpense,
          type: "debit", // expense as debit
          transaction_code: `TAX-${Date.now()}`,
          created_by: "System",
          entity_type: "tax",
          entity_id: newReport.id
        });
        
        toast({
          title: "Berhasil",
          description: "Laporan pajak dan transaksi berhasil ditambahkan",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan transaksi untuk laporan pajak",
      });
    }
  };
  
  const goToReports = () => {
    navigate('/laporan');
  };
  
  const goToTransactions = () => {
    navigate('/transaksi');
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileChartLine className="w-6 h-6 text-primary" />
            Laporan Pajak
          </h1>
          <p className="text-muted-foreground text-sm">Kelola dan lihat seluruh laporan pajak Anda.</p>
        </div>
        <Dialog open={newDialog} onOpenChange={setNewDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Laporan Pajak Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Buat Laporan Pajak Baru</DialogTitle>
            <form className="space-y-4 mt-2" onSubmit={handleCreate}>
              <div>
                <label className="block font-medium text-sm mb-1">Jenis Pajak</label>
                <select
                  className="w-full border rounded p-2"
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                >
                  {TAX_TYPES.map(t => (
                    <option value={t.key} key={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Pendapatan</label>
                <input type="number" className="w-full border rounded p-2"
                  value={newIncome}
                  onChange={e => setNewIncome(Number(e.target.value))}/>
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">Pengeluaran</label>
                <input type="number" className="w-full border rounded p-2"
                  value={newExpense}
                  onChange={e => setNewExpense(Number(e.target.value))}/>
              </div>
              <Button type="submit" className="w-full mt-2">Simpan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={goToReports}>
          <FileText className="w-4 h-4 mr-2" />
          Lihat Semua Laporan
        </Button>
        <Button variant="outline" size="sm" onClick={goToTransactions}>
          <ArrowRight className="w-4 h-4 mr-2" />
          Lihat Transaksi
        </Button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jenis Pajak</TableHead>
              <TableHead>Pendapatan</TableHead>
              <TableHead>Pengeluaran</TableHead>
              <TableHead>Laba Bersih</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Tidak ada laporan pajak.</TableCell>
              </TableRow>
            )}
            {taxReports.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.date ? new Date(r.date).toLocaleDateString("id-ID") : "-"}</TableCell>
                <TableCell>{TAX_TYPES.find(t => r.type?.toLowerCase()?.includes(t.key))?.label ?? r.type}</TableCell>
                <TableCell>{formatRupiah(r.income)}</TableCell>
                <TableCell>{formatRupiah(r.expense)}</TableCell>
                <TableCell>{formatRupiah(r.profit ?? (r.income ?? 0) - (r.expense ?? 0))}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={goToTransactions}>
                    Lihat Transaksi
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-2">Korelasi Pajak Indonesia</h2>
        <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
          <li><span className="font-medium text-black">PPN</span>: Pajak Pertambahan Nilai (umumnya 11% dari penjualan barang/jasa kena pajak).</li>
          <li><span className="font-medium text-black">PPh 21</span>: Pajak penghasilan atas gaji dan honorarium karyawan.</li>
          <li><span className="font-medium text-black">PPh 23</span>: Pajak atas penghasilan dari jasa, dividen, royalti, dan lain-lain.</li>
          <li><span className="font-medium text-black">PPh 25</span>: Angsuran pajak penghasilan tiap bulan (self assessment), terkait PPh badan/tahunan.</li>
        </ul>
      </div>
    </MainLayout>
  );
};

export default TaxReports;
