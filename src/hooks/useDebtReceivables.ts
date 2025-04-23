
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DebtReceivable } from "@/types";

export const useDebtReceivables = () => {
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

  return { debtReceivables, isLoading };
};
