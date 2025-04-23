
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Account } from "@/types";

export const useChartOfAccounts = () => {
  const queryClient = useQueryClient();
  
  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ['chartOfAccounts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('chart_of_accounts')
          .select('*')
          .order('code');

        if (error) {
          console.error('Error fetching accounts:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to load accounts: ${error.message}`,
          });
          throw error;
        }

        return data as Account[];
      } catch (error: any) {
        console.error('Error in accounts query:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load accounts: ${error.message || 'Unknown error'}`,
        });
        throw error;
      }
    },
  });

  const addAccount = useMutation({
    mutationFn: async (newAccount: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        console.log('Adding account:', newAccount);
        
        const { data, error } = await supabase
          .from('chart_of_accounts')
          .insert([newAccount])
          .select()
          .single();

        if (error) {
          console.error('Supabase error adding account:', error);
          throw new Error(error.message || 'Failed to add account');
        }
        
        if (!data) {
          throw new Error('No data returned from account creation');
        }
        
        console.log('Account added successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error adding account:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Account added successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      toast({
        title: "Berhasil",
        description: "Akun berhasil ditambahkan",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add account: ${error.message || 'Unknown error'}`,
      });
      console.error('Error adding account:', error);
    },
  });

  const updateAccount = useMutation({
    mutationFn: async (account: Account) => {
      try {
        console.log('Updating account:', account);
        
        const { data, error } = await supabase
          .from('chart_of_accounts')
          .update(account)
          .eq('id', account.id)
          .select()
          .single();

        if (error) {
          console.error('Supabase error updating account:', error);
          throw new Error(error.message || 'Failed to update account');
        }
        
        if (!data) {
          throw new Error('No data returned from account update');
        }
        
        console.log('Account updated successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error updating account:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Account updated successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      toast({
        title: "Berhasil",
        description: "Akun berhasil diperbarui",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update account: ${error.message || 'Unknown error'}`,
      });
      console.error('Error updating account:', error);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log('Deleting account:', id);
        
        const { error } = await supabase
          .from('chart_of_accounts')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase error deleting account:', error);
          throw new Error(error.message || 'Failed to delete account');
        }
        
        console.log('Account deleted successfully');
        return id;
      } catch (error: any) {
        console.error('Error deleting account:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Account deleted successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] });
      toast({
        title: "Berhasil",
        description: "Akun berhasil dihapus",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete account: ${error.message || 'Unknown error'}`,
      });
      console.error('Error deleting account:', error);
    },
  });

  return { accounts, isLoading, addAccount, updateAccount, deleteAccount };
};
