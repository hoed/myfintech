
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCurrencyRates = () => {
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

      return data;
    },
  });

  return {
    rates,
    isLoading
  };
};
