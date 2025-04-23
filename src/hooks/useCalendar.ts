
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/types";

export const useCalendar = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['calendarTransactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('date, description, amount, type')
        .order('date');

      if (error) {
        toast({
          variant: "destructive", 
          title: "Error",
          description: "Gagal memuat data kalender",
        });
        throw error;
      }

      return data || [];
    },
  });

  return { transactions, isLoading };
};
