export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          account_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_name: string
          key_value: string
          service_type: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          key_value: string
          service_type: string
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          key_value?: string
          service_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          account_id: string | null
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_history: {
        Row: {
          account_id: string | null
          backup_data: Json
          backup_date: string | null
          backup_name: string
          created_by: string | null
          id: string
        }
        Insert: {
          account_id?: string | null
          backup_data: Json
          backup_date?: string | null
          backup_name: string
          created_by?: string | null
          id?: string
        }
        Update: {
          account_id?: string | null
          backup_data?: Json
          backup_date?: string | null
          backup_name?: string
          created_by?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backup_history_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_id: string | null
          account_number: string
          balance: number | null
          bank_name: string
          created_at: string | null
          currency: string
          currency_rate_id: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          account_number: string
          balance?: number | null
          bank_name: string
          created_at?: string | null
          currency: string
          currency_rate_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          account_number?: string
          balance?: number | null
          bank_name?: string
          created_at?: string | null
          currency?: string
          currency_rate_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_currency_rate_id_fkey"
            columns: ["currency_rate_id"]
            isOneToOne: false
            referencedRelation: "currency_rates"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_of_accounts: {
        Row: {
          balance: number | null
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          subtype: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subtype?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subtype?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          account_id: string | null
          company_address: string | null
          company_email: string | null
          company_name: string
          company_phone: string | null
          company_tax_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          company_address?: string | null
          company_email?: string | null
          company_name: string
          company_phone?: string | null
          company_tax_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          company_address?: string | null
          company_email?: string | null
          company_name?: string
          company_phone?: string | null
          company_tax_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      currency_rates: {
        Row: {
          account_id: string | null
          currency_from: string
          currency_to: string
          id: string
          rate: number
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          currency_from: string
          currency_to: string
          id?: string
          rate: number
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          currency_from?: string
          currency_to?: string
          id?: string
          rate?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "currency_rates_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          account_id: string | null
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      debts_receivables: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          description: string | null
          due_date: string
          entity_name: string
          id: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          description?: string | null
          due_date: string
          entity_name: string
          id?: string
          status: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          description?: string | null
          due_date?: string
          entity_name?: string
          id?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debts_receivables_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          acquisition_cost: number | null
          acquisition_date: string | null
          api_key_id: string | null
          buy_price: number | null
          category: string | null
          condition: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          location: string | null
          name: string
          sell_price: number | null
          sku: string | null
          stock: number | null
          sub_category: string | null
          supplier: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          acquisition_cost?: number | null
          acquisition_date?: string | null
          api_key_id?: string | null
          buy_price?: number | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          location?: string | null
          name: string
          sell_price?: number | null
          sku?: string | null
          stock?: number | null
          sub_category?: string | null
          supplier?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          acquisition_cost?: number | null
          acquisition_date?: string | null
          api_key_id?: string | null
          buy_price?: number | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          sell_price?: number | null
          sku?: string | null
          stock?: number | null
          sub_category?: string | null
          supplier?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          debt_id: string | null
          due_date: string
          entity_id: string
          entity_type: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          debt_id?: string | null
          due_date: string
          entity_id: string
          entity_type: string
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          debt_id?: string | null
          due_date?: string
          entity_id?: string
          entity_type?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts_receivables"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_id: string | null
          created_at: string | null
          email: string | null
          id: number
          user_id: string | null
          username: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          user_id?: string | null
          username?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          account_id: string | null
          created_at: string | null
          date: string
          debt_id: string | null
          expense: number | null
          id: string
          income: number | null
          profit: number | null
          reporttype: string | null
          transaction_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          date: string
          debt_id?: string | null
          expense?: number | null
          id?: string
          income?: number | null
          profit?: number | null
          reporttype?: string | null
          transaction_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          date?: string
          debt_id?: string | null
          expense?: number | null
          id?: string
          income?: number | null
          profit?: number | null
          reporttype?: string | null
          transaction_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts_receivables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          account_id: string | null
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          bank_account_id: string | null
          created_at: string | null
          created_by: string
          customer_id: string | null
          date: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          invoice_number: string | null
          supplier_id: string | null
          transaction_code: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          bank_account_id?: string | null
          created_at?: string | null
          created_by: string
          customer_id?: string | null
          date: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          invoice_number?: string | null
          supplier_id?: string | null
          transaction_code: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          bank_account_id?: string | null
          created_at?: string | null
          created_by?: string
          customer_id?: string | null
          date?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          invoice_number?: string | null
          supplier_id?: string | null
          transaction_code?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_backup: {
        Row: {
          account_id: string | null
          amount: number | null
          bank_account_id: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          date: string | null
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          invoice_number: string | null
          supplier_id: string | null
          transaction_code: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount?: number | null
          bank_account_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          date?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id: string
          invoice_number?: string | null
          supplier_id?: string | null
          transaction_code?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number | null
          bank_account_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          date?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          invoice_number?: string | null
          supplier_id?: string | null
          transaction_code?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_backup_transaction_id"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          account_id: string | null
          created_at: string | null
          id: string
          page: string
          permission: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          id?: string
          page: string
          permission: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          id?: string
          page?: string
          permission?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_id: string | null
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_permission: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_customer_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_supplier_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_transaction_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_permission: {
        Args:
          | Record<PropertyKey, never>
          | { user_id: string; page: string; permission: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
