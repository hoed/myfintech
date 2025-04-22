import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Account, AccountType } from "@/types";

export const useChartOfAccounts = () => {
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ['chartOfAccounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .order('code');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data akun",
        });
        throw error;
      }

      return data as Account[];
    },
  });

  const addAccount = useMutation({
    mutationFn: async (newAccount: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .insert([newAccount])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      toast({
        title: "Berhasil",
        description: "Akun berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan akun",
      });
      console.error('Error adding account:', error);
    },
  });

  const updateAccount = useMutation({
    mutationFn: async (account: Partial<Account> & { id: string }) => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .update({
          code: account.code,
          name: account.name,
          type: account.type,
          subtype: account.subtype,
          description: account.description,
          is_active: account.is_active,
          balance: account.balance,
        })
        .eq('id', account.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      toast({
        title: "Berhasil",
        description: "Akun berhasil diperbarui",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui akun",
      });
      console.error('Error updating account:', error);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      // Check if account is used in transactions
      const { data: transactions, error: checkError } = await supabase
        .from('transactions')
        .select('id')
        .eq('account_id', id)
        .limit(1);

      if (checkError) throw checkError;

      if (transactions && transactions.length > 0) {
        throw new Error('Akun sedang digunakan dalam transaksi. Tidak dapat dihapus.');
      }

      const { error } = await supabase
        .from('chart_of_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      toast({
        title: "Berhasil",
        description: "Akun berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Gagal menghapus akun",
      });
      console.error('Error deleting account:', error);
    },
  });

  // Get accounts filtered by type
  const getAccountsByType = (type: AccountType) => {
    return accounts.filter(account => account.type === type);
  };

  // Get all available account types
  const getAccountTypes = (): AccountType[] => {
    const types = new Set<AccountType>();
    accounts.forEach(account => {
      types.add(account.type);
    });
    return Array.from(types);
  };

  return {
    accounts,
    isLoading,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountsByType,
    getAccountTypes
  };
};
