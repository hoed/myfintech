
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import FinancialChart from "@/components/dashboard/FinancialChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import NewFeatureBanner from "@/components/dashboard/NewFeatureBanner";
import { formatRupiah } from "@/lib/formatter";
import { CreditCard, ArrowUpDown, DollarSign, Wallet } from "lucide-react";

const Dashboard = () => {
  // Sample data for demonstration purposes
  const financialData = [
    { month: "Jan", income: 125000000, expense: 82000000 },
    { month: "Feb", income: 145000000, expense: 96000000 },
    { month: "Mar", income: 130000000, expense: 85000000 },
    { month: "Apr", income: 170000000, expense: 105000000 },
    { month: "Mei", income: 190000000, expense: 120000000 },
    { month: "Jun", income: 200000000, expense: 130000000 },
  ];

  const recentTransactions = [
    {
      id: "1",
      date: "2023-04-20",
      description: "Pembayaran dari PT Maju Bersama",
      amount: 25000000,
      type: "income" as const,
      account: "Piutang Dagang",
    },
    {
      id: "2",
      date: "2023-04-19",
      description: "Pembayaran listrik bulan April",
      amount: 3500000,
      type: "expense" as const,
      account: "Beban Utilitas",
    },
    {
      id: "3",
      date: "2023-04-18",
      description: "Pembelian bahan baku",
      amount: 12000000,
      type: "expense" as const,
      account: "Persediaan",
    },
    {
      id: "4",
      date: "2023-04-17",
      description: "Pembayaran dari PT Sukses Mandiri",
      amount: 18000000,
      type: "income" as const,
      account: "Piutang Dagang",
    },
    {
      id: "5",
      date: "2023-04-16",
      description: "Pembayaran gaji karyawan",
      amount: 45000000,
      type: "expense" as const,
      account: "Beban Gaji",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Selamat Datang di Keuangan Mandiri</h1>
          <p className="text-muted-foreground mt-1">
            Kelola keuangan bisnis anda dengan mudah dan efisien
          </p>
        </div>
        
        <NewFeatureBanner 
          title="Fitur Baru: Laporan Pajak PPN"
          description="Laporan pajak otomatis untuk kepatuhan perpajakan di Indonesia"
          ctaAction={() => console.log('Navigating to tax reports')}
        />

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Saldo"
            value={formatRupiah(850000000)}
            icon={<Wallet size={20} />}
            trend="up"
            trendValue="12% dari bulan lalu"
          />
          <DashboardCard
            title="Pendapatan Bulanan"
            value={formatRupiah(200000000)}
            icon={<DollarSign size={20} />}
            trend="up"
            trendValue="5% dari bulan lalu"
          />
          <DashboardCard
            title="Pengeluaran Bulanan"
            value={formatRupiah(130000000)}
            icon={<ArrowUpDown size={20} />}
            trend="up"
            trendValue="8% dari bulan lalu"
          />
          <DashboardCard
            title="Hutang"
            value={formatRupiah(45000000)}
            icon={<CreditCard size={20} />}
            trend="down"
            trendValue="3% dari bulan lalu"
          />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border bg-card shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Grafik Keuangan (6 Bulan Terakhir)</h3>
            <FinancialChart data={financialData} />
          </div>
          <div className="lg:col-span-1">
            <div className="grid gap-6">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2">Ringkasan Keuangan</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Aset</span>
                    <span className="font-medium">{formatRupiah(1250000000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Kewajiban</span>
                    <span className="font-medium">{formatRupiah(380000000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ekuitas</span>
                    <span className="font-medium">{formatRupiah(870000000)}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Laba Bersih (YTD)</span>
                      <span className="font-medium text-success">{formatRupiah(320000000)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2">Nilai Tukar</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">1 USD</span>
                    <span className="font-medium">{formatRupiah(15650)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    Diperbarui: 22 April 2023, 09:30 WIB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
