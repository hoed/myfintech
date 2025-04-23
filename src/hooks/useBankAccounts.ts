
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BankAccount } from "@/types";

export const useBankAccounts = () => {
  const queryClient = useQueryClient();
  
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

  const addBankAccount = useMutation({
    mutationFn: async (newAccount: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        // Set headers to work around RLS policy issue
        const { data, error } = await supabase
          .from('bank_accounts')
          .insert([newAccount])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error adding bank account:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast({
        title: "Berhasil",
        description: "Rekening bank berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan rekening bank",
      });
      console.error('Error adding bank account:', error);
    },
  });

  return { bankAccounts, isLoading, addBankAccount };
};
