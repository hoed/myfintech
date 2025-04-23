
-- SQL DUMP FOR SYSTEM APP MIGRATION (for backup or setup)
-- Run these statements on a clean Postgres instance for this system.

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'user',
  avatar VARCHAR,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  subtype VARCHAR,
  balance NUMERIC DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  type VARCHAR NOT NULL,
  account_id uuid,
  transaction_code VARCHAR NOT NULL,
  invoice_number VARCHAR,
  created_by VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id)
);

CREATE TABLE IF NOT EXISTS bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  account_number VARCHAR NOT NULL,
  bank_name VARCHAR NOT NULL,
  balance NUMERIC,
  currency VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS debts_receivables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL,
  entity_name VARCHAR NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  type VARCHAR NOT NULL,
  income NUMERIC DEFAULT 0,
  expense NUMERIC DEFAULT 0,
  profit NUMERIC,
  reportType VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add more create table statements as needed following your app's structure.

-- End of schema dump.
