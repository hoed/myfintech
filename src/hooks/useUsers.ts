
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to load users: ${error.message}`,
          });
          throw error;
        }

        return data as User[];
      } catch (error: any) {
        console.error('Error in users query:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load users: ${error.message || 'Unknown error'}`,
        });
        throw error;
      }
    },
  });

  const addUser = useMutation({
    mutationFn: async (newUser: { email: string, password: string, name: string, role: 'admin' | 'manager' | 'user' }) => {
      try {
        console.log('Adding user:', { ...newUser, password: '[REDACTED]' });
        
        // Create a new user in the users table
        const { data, error } = await supabase
          .from('users')
          .insert([{
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            is_active: true
          }])
          .select()
          .single();

        if (error) {
          console.error('Supabase error adding user:', error);
          throw new Error(error.message || 'Failed to add user');
        }
        
        if (!data) {
          throw new Error('No data returned from user creation');
        }
        
        console.log('User added successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error adding user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('User added successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil ditambahkan",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add user: ${error.message || 'Unknown error'}`,
      });
      console.error('Error adding user:', error);
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string, isActive: boolean }) => {
      try {
        console.log('Toggling user status:', { userId, isActive: !isActive });
        
        const { data, error } = await supabase
          .from('users')
          .update({ is_active: !isActive })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('Supabase error toggling user status:', error);
          throw new Error(error.message || 'Failed to toggle user status');
        }
        
        if (!data) {
          throw new Error('No data returned from user status update');
        }
        
        console.log('User status toggled successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error toggling user status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('User status toggled successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Berhasil",
        description: "Status pengguna berhasil diubah",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to toggle user status: ${error.message || 'Unknown error'}`,
      });
      console.error('Error toggling user status:', error);
    },
  });

  return {
    users,
    isLoading,
    addUser,
    toggleUserStatus
  };
};
