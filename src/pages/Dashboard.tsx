import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import FinancialChart from "@/components/dashboard/FinancialChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import NewFeatureBanner from "@/components/dashboard/NewFeatureBanner";
import QuickAccess from "@/components/dashboard/QuickAccess"; 
import { formatRupiah } from "@/lib/formatter";
import { CreditCard, ArrowUpDown, DollarSign, Wallet } from "lucide-react";
import { useChartOfAccounts } from "@/hooks/useChartOfAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { useDebtReceivables } from "@/hooks/useDebtReceivables";

const Dashboard = () => {
  const { accounts } = useChartOfAccounts();
  const { transactions } = useTransactions();
  const { debtReceivables } = useDebtReceivables();

  // Sample data for demonstration purposes
  const dailyData = [
    { month: "Senin", income: 12000000, expense: 8200000 },
    { month: "Selasa", income: 14500000, expense: 9600000 },
    { month: "Rabu", income: 13000000, expense: 8500000 },
    { month: "Kamis", income: 17000000, expense: 10500000 },
    { month: "Jumat", income: 19000000, expense: 12000000 },
    { month: "Sabtu", income: 9000000, expense: 5000000 },
    { month: "Minggu", income: 5000000, expense: 2000000 },
  ];

  const monthlyData = [
    { month: "Jan", income: 125000000, expense: 82000000 },
    { month: "Feb", income: 145000000, expense: 96000000 },
    { month: "Mar", income: 130000000, expense: 85000000 },
    { month: "Apr", income: 170000000, expense: 105000000 },
    { month: "Mei", income: 190000000, expense: 120000000 },
    { month: "Jun", income: 200000000, expense: 130000000 },
  ];

  const yearlyData = [
    { month: "2021", income: 1250000000, expense: 820000000 },
    { month: "2022", income: 1450000000, expense: 960000000 },
    { month: "2023", income: 1800000000, expense: 1050000000 },
    { month: "2024", income: 2100000000, expense: 1300000000 },
    { month: "2025", income: 2500000000, expense: 1500000000 },
  ];

  // Calculate total balance from chart of accounts
  const totalAssets = accounts && accounts.length > 0
    ? accounts
        .filter(account => account.type === 'aset' && account.is_active)
        .reduce((total, account) => total + (account.balance || 0), 0)
    : 0;

  const totalLiabilities = accounts && accounts.length > 0
    ? accounts
        .filter(account => account.type === 'kewajiban' && account.is_active)
        .reduce((total, account) => total + (account.balance || 0), 0)
    : 0;

  const totalEquity = accounts && accounts.length > 0
    ? accounts
        .filter(account => account.type === 'ekuitas' && account.is_active)
        .reduce((total, account) => total + (account.balance || 0), 0)
    : 0;

  // Calculate monthly income and expense
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = transactions && transactions.length > 0
    ? transactions
        .filter(tx => 
          tx.type === 'income' && 
          new Date(tx.date).getMonth() === currentMonth && 
          new Date(tx.date).getFullYear() === currentYear
        )
        .reduce((total, tx) => total + tx.amount, 0)
    : 0;

  const monthlyExpense = transactions && transactions.length > 0
    ? transactions
        .filter(tx => 
          tx.type === 'expense' && 
          new Date(tx.date).getMonth() === currentMonth && 
          new Date(tx.date).getFullYear() === currentYear
        )
        .reduce((total, tx) => total + tx.amount, 0)
    : 0;

  // Calculate total debt
  const totalDebt = debtReceivables && debtReceivables.length > 0
    ? debtReceivables
        .filter(dr => dr.type === 'hutang' && dr.status !== 'lunas')
        .reduce((total, dr) => total + dr.amount, 0)
    : 0;

  // Get recent transactions
  const recentTransactions = transactions && transactions.length > 0 && accounts && accounts.length > 0
    ? transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map(tx => ({
          id: tx.id,
          date: tx.date,
          description: tx.description || '',
          amount: tx.amount,
          type: tx.type as 'income' | 'expense',
          account: accounts.find(a => a.id === tx.account_id)?.name || '',
        }))
    : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Selamat Datang di Keuangan Mandiri</h1>
          <p className="text-muted-foreground mt-1">
            Kelola keuangan bisnis anda dengan mudah dan efisien
          </p>
        </div>
        
        {/* Quick Access Section */}
        <QuickAccess />

        <NewFeatureBanner 
          title="Fitur Baru: Laporan Pajak PPN"
          description="Laporan pajak otomatis untuk kepatuhan perpajakan di Indonesia"
          ctaAction={() => console.log('Navigating to tax reports')}
        />

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Saldo"
            value={formatRupiah(totalAssets - totalLiabilities)}
            icon={<Wallet size={20} />}
            trend="up"
            trendValue="12% dari bulan lalu"
          />
          <DashboardCard
            title="Pendapatan Bulanan"
            value={formatRupiah(monthlyIncome)}
            icon={<DollarSign size={20} />}
            trend="up"
            trendValue="5% dari bulan lalu"
          />
          <DashboardCard
            title="Pengeluaran Bulanan"
            value={formatRupiah(monthlyExpense)}
            icon={<ArrowUpDown size={20} />}
            trend="up"
            trendValue="8% dari bulan lalu"
          />
          <DashboardCard
            title="Hutang"
            value={formatRupiah(totalDebt)}
            icon={<CreditCard size={20} />}
            trend="down"
            trendValue="3% dari bulan lalu"
          />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border bg-card shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Grafik Keuangan</h3>
            <FinancialChart dailyData={dailyData} monthlyData={monthlyData} yearlyData={yearlyData} />
          </div>
          <div className="lg:col-span-1">
            <div className="grid gap-6">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2">Ringkasan Keuangan</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Aset</span>
                    <span className="font-medium">{formatRupiah(totalAssets)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Kewajiban</span>
                    <span className="font-medium">{formatRupiah(totalLiabilities)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ekuitas</span>
                    <span className="font-medium">{formatRupiah(totalEquity)}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Laba Bersih (YTD)</span>
                      <span className="font-medium text-success">{formatRupiah(monthlyIncome - monthlyExpense)}</span>
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
                    Diperbarui: {new Date().toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}, {new Date().toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} WIB
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
