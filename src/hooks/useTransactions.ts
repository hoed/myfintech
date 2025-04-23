
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/types";

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          customer:customers(name),
          supplier:suppliers(name),
          bank_account:bank_accounts(name),
          report:reports(type)
        `)
        .order('date', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data transaksi",
        });
        throw error;
      }

      return data || [];
    },
  });

  const addTransaction = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .insert([newTransaction])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan transaksi",
      });
      console.error('Error adding transaction:', error);
    },
  });

  return { transactions, isLoading, addTransaction };
};
