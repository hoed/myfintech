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

DROP TABLE IF EXISTS profiles;
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id uuid,
  email TEXT,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
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
  entity_type VARCHAR,
  entity_id uuid,
  bank_account_id uuid,
  customer_id uuid,
  supplier_id uuid,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id)
);

CREATE TABLE IF NOT EXISTS bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  account_number VARCHAR NOT NULL,
  bank_name VARCHAR NOT NULL,
  balance NUMERIC DEFAULT 0.00,
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
  reportType VARCHAR CHECK(reportType IN ('daily', 'monthly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR NOT NULL, 
  company_address TEXT,
  company_email VARCHAR,
  company_phone VARCHAR,
  company_tax_id VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type VARCHAR NOT NULL,
  key_name VARCHAR NOT NULL,
  key_value VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  address TEXT,
  tax_id VARCHAR,
  contact_person VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  address TEXT,
  tax_id VARCHAR,
  contact_person VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_id uuid NOT NULL,
  amount NUMERIC NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  notes TEXT,
  transaction_id uuid,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS currency_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_from VARCHAR NOT NULL,
  currency_to VARCHAR NOT NULL,
  rate NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role TEXT NOT NULL,
  page TEXT NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS backup_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name VARCHAR NOT NULL,
  backup_data JSONB NOT NULL,
  backup_date TIMESTAMPTZ DEFAULT now(),
  created_by VARCHAR
);

-- Create necessary sequences
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START WITH 1 INCREMENT BY 1;

-- Add any necessary indexes for optimization
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(date);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);

-- Create custom functions
CREATE OR REPLACE FUNCTION update_updated_at_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;   
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables that have this column
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY['users', 'chart_of_accounts', 'transactions', 'bank_accounts', 
                           'debts_receivables', 'reports', 'company_settings', 'app_settings', 
                           'customers', 'suppliers', 'invoices', 'user_roles'];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS set_updated_at ON %I;
            CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', tbl, tbl);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- End of schema dump.
