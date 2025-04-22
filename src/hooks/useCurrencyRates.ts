
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CurrencyRate {
  id: string;
  currency_from: string;
  currency_to: string;
  rate: number;
  updated_at: string;
}

export const useCurrencyRates = () => {
  const queryClient = useQueryClient();

  const { data: rates = [], isLoading } = useQuery({
    queryKey: ['currencyRates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data kurs mata uang",
        });
        throw error;
      }

      return data as CurrencyRate[];
    },
  });

  const updateCurrencyRates = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        'https://zgqzbncgcueagvqkzmtg.supabase.co/functions/v1/update-currency-rates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession()}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update currency rates');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencyRates'] });
      toast({
        title: "Success",
        description: "Kurs mata uang berhasil diperbarui",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal memperbarui kurs mata uang",
      });
    },
  });

  return {
    rates,
    isLoading,
    updateCurrencyRates: updateCurrencyRates.mutate,
  };
};
