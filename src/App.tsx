
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AccountChart from "./pages/AccountChart";
import TransactionsPage from "./pages/Transactions";
import Ledger from "./pages/Ledger";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import BankAccounts from "./pages/BankAccounts";
import DebtReceivables from "./pages/DebtReceivables";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import InitializeAdmin from "./pages/InitializeAdmin";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import React from "react";
import TaxReports from "./pages/TaxReports";
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/akun" element={<AccountChart />} />
          <Route path="/transaksi" element={<TransactionsPage />} />
          <Route path="/buku-besar" element={<Ledger />} />
          <Route path="/rekening" element={<BankAccounts />} />
          <Route path="/hutang-piutang" element={<DebtReceivables />} />
          <Route path="/pelanggan" element={<Customers />} />
          <Route path="/pemasok" element={<Suppliers />} />
          <Route path="/inventaris" element={<Inventory />} />
          <Route path="/kalender" element={<Calendar />} />
          <Route path="/laporan" element={<Reports />} />
          <Route path="/pengguna" element={<UserManagement />} />
          <Route path="/pengaturan" element={<Settings />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/init-admin" element={<InitializeAdmin />} />
          <Route path="/pajak" element={<React.Suspense fallback={<div>Loading...</div>}><TaxReports /></React.Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
