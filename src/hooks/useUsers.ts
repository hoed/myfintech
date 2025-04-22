
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Instead of using admin.listUsers which requires special privileges,
      // we'll get users from a regular table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data pengguna",
        });
        throw error;
      }

      return data as User[];
    },
  });

  const addUser = useMutation({
    mutationFn: async (newUser: { email: string, password: string, name: string, role: string }) => {
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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan pengguna",
      });
      console.error('Error adding user:', error);
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string, isActive: boolean }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ is_active: !isActive })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Berhasil",
        description: "Status pengguna berhasil diubah",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengubah status pengguna",
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
