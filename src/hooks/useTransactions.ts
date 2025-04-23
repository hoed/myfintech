import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/types";

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            customer:customers(name),
            supplier:suppliers(name),
            bank_account:bank_accounts(name)
          `)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching transactions:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to load transactions: ${error.message}`,
          });
          throw error;
        }

        console.log('Fetched Transactions:', data);
        return data || [];
      } catch (error: any) {
        console.error('Error in transactions query:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load transactions: ${error.message || 'Unknown error'}`,
        });
        throw error;
      }
    },
  });

  const addTransaction = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        console.log('Adding transaction:', newTransaction);
        const { data, error } = await supabase
          .from('transactions')
          .insert([newTransaction])
          .select()
          .single();

        if (error) {
          console.error('Supabase error adding transaction:', error);
          throw new Error(error.message || 'Failed to add transaction');
        }
        
        if (!data) {
          throw new Error('No data returned from transaction creation');
        }
        
        console.log('Transaction added successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error adding transaction:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Transaction added successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Berhasil",
        description: "Transaksi berhasil ditambahkan",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add transaction: ${error.message || 'Unknown error'}`,
      });
      console.error('Error adding transaction:', error);
    },
  });

  return { transactions, isLoading, addTransaction };
};