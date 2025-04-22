
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DebtReceivable } from "@/types";

export const useDebtReceivables = () => {
  const queryClient = useQueryClient();

  const { data: debtReceivables = [], isLoading } = useQuery({
    queryKey: ['debtReceivables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debts_receivables')
        .select('*')
        .order('due_date');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data hutang piutang",
        });
        throw error;
      }

      return data as DebtReceivable[];
    },
  });

  const addDebtReceivable = useMutation({
    mutationFn: async (newDebtReceivable: Omit<DebtReceivable, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('debts_receivables')
        .insert([newDebtReceivable])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debtReceivables'] });
      toast({
        title: "Berhasil",
        description: "Data hutang/piutang berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan data hutang/piutang",
      });
      console.error('Error adding debt/receivable:', error);
    },
  });

  return {
    debtReceivables,
    isLoading,
    addDebtReceivable
  };
};
