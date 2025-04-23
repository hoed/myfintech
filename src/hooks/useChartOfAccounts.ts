
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Account } from "@/types";

export const useChartOfAccounts = () => {
  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ['chartOfAccounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .order('code');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data akun",
        });
        throw error;
      }

      return data as Account[];
    },
  });

  return { accounts, isLoading };
};
