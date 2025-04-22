
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

  const { data: rates = [], isLoading, error, refetch } = useQuery({
    queryKey: ['currencyRates'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('currency_rates')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        return data as CurrencyRate[];
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data kurs mata uang",
        });
        throw err;
      }
    },
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const updateCurrencyRatesMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(
          'https://zgqzbncgcueagvqkzmtg.supabase.co/functions/v1/update-currency-rates',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Network error' }));
          throw new Error(errorData.message || `Failed to update currency rates: ${response.status}`);
        }

        return response.json();
      } catch (err: any) {
        console.error("Currency rates update error:", err);
        throw new Error(err.message || 'Failed to update currency rates');
      }
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
      // Automatically retry after 2 seconds for certain errors
      if (error.message.includes('Network error') || error.message.includes('timeout')) {
        setTimeout(() => {
          toast({
            title: "Retrying",
            description: "Mencoba memperbarui kurs kembali...",
          });
          // Use the mutate function from updateCurrencyRatesMutation
          updateCurrencyRatesMutation.mutate();
        }, 2000);
      }
    },
    retry: 3, // Retry failed mutations up to 3 times
  });

  // Function to handle any errors and retry loading data
  const retryLoadRates = () => {
    if (error) {
      refetch();
    }
  };

  return {
    rates,
    isLoading,
    error,
    retryLoadRates,
    updateCurrencyRates: () => updateCurrencyRatesMutation.mutate(),
  };
};
