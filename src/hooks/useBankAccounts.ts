
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BankAccount } from "@/types";

export const useBankAccounts = () => {
  const queryClient = useQueryClient();
  
  const { data: bankAccounts = [], isLoading } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('bank_accounts')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching bank accounts:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to load bank accounts: ${error.message}`,
          });
          throw error;
        }

        return data as BankAccount[];
      } catch (error: any) {
        console.error('Error in bankAccounts query:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load bank accounts: ${error.message || 'Unknown error'}`,
        });
        throw error;
      }
    },
  });

  const addBankAccount = useMutation({
    mutationFn: async (newAccount: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        console.log('Adding bank account:', newAccount);
        const { data, error } = await supabase
          .from('bank_accounts')
          .insert([newAccount])
          .select()
          .single();

        if (error) {
          console.error('Supabase error adding bank account:', error);
          throw new Error(error.message || 'Failed to add bank account');
        }
        
        if (!data) {
          throw new Error('No data returned from bank account creation');
        }
        
        console.log('Bank account added successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error adding bank account:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Bank account added successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast({
        title: "Berhasil",
        description: "Rekening bank berhasil ditambahkan",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Gagal menambahkan rekening bank: ${error.message || 'Unknown error'}`,
      });
      console.error('Error adding bank account:', error);
    },
  });

  return { bankAccounts, isLoading, addBankAccount };
};
