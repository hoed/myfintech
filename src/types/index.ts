
export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  subtype?: string;
  balance: number;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  chart_of_accounts?: any; // Add this to support nested query results
}

export type AccountType = 'aset' | 'kewajiban' | 'ekuitas' | 'pendapatan' | 'beban';

export interface Transaction {
  id: string;
  date: string;
  description?: string;
  amount: number;
  type: 'debit' | 'kredit';
  account_id?: string;
  transaction_code: string;
  invoice_number?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  entity_type?: string; // Add entity_type as optional
  entity_id?: string;   // Add entity_id as optional
  bank_account_id?: string;
  customer_id?: string;
  supplier_id?: string;
  chart_of_accounts?: any; // Add this to support nested query results
}

export interface BankAccount {
  id: string;
  name: string;
  account_number: string;
  bank_name: string;
  balance: number;
  currency: 'IDR' | 'USD';
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type DebtReceivableType = 'hutang' | 'piutang';
export type DebtReceivableStatus = 'belum_dibayar' | 'sebagian_dibayar' | 'lunas';

export interface DebtReceivable {
  id: string;
  type: DebtReceivableType;
  entity_name: string;
  amount: number;
  due_date: string;
  status: DebtReceivableStatus;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CurrencyExchange {
  id: string;
  fromCurrency: 'IDR' | 'USD';
  toCurrency: 'IDR' | 'USD';
  rate: number;
  effectiveDate: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  date: string;
  type: string;
  income: number;
  expense: number;
  profit?: number;
  reportType: 'daily' | 'monthly' | 'yearly'; // Required field for all reports
  created_at: string;
  updated_at: string;
}

export type TaxType = 'ppn' | 'pph21' | 'pph23' | 'pph25';
