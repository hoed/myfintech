
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
          chart_of_accounts (
            id,
            name,
            code
          )
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
    mutationFn: async (newTransaction: Partial<Transaction>) => {
      // Get transaction code and invoice number
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_transaction_code');
      if (codeError) throw codeError;

      const { data: invoiceData, error: invoiceError } = await supabase
        .rpc('generate_invoice_number');
      if (invoiceError) throw invoiceError;

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...newTransaction,
          transaction_code: codeData,
          invoice_number: invoiceData,
          created_by: 'admin' // TODO: Replace with actual user
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
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

  return {
    transactions,
    isLoading,
    addTransaction
  };
};
