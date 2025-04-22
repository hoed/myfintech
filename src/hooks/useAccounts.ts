
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Account } from "@/types";

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
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

  const addAccount = useMutation({
    mutationFn: async (newAccount: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .insert([newAccount])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Berhasil",
        description: "Akun berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan akun",
      });
      console.error('Error adding account:', error);
    },
  });

  return {
    accounts,
    isLoading,
    addAccount
  };
};
