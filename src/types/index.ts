
export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  subtype?: string;
  balance: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type AccountType = 'aset' | 'kewajiban' | 'ekuitas' | 'pendapatan' | 'beban';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'kredit';
  accountId: string;
  references?: string[];
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  balance: number;
  currency: 'IDR' | 'USD';
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DebtReceivable {
  id: string;
  type: 'hutang' | 'piutang';
  entityName: string;
  amount: number;
  dueDate: string;
  status: 'belum_dibayar' | 'sebagian_dibayar' | 'lunas';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyExchange {
  id: string;
  fromCurrency: 'IDR' | 'USD';
  toCurrency: 'IDR' | 'USD';
  rate: number;
  effectiveDate: string;
  updatedAt: string;
}
