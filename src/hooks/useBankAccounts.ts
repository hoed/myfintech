
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BankAccount } from "@/types";

export const useBankAccounts = () => {
  const { data: bankAccounts = [], isLoading } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('name');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data rekening bank",
        });
        throw error;
      }

      return data as BankAccount[];
    },
  });

  return { bankAccounts, isLoading };
};
