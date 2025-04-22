
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.admin.listUsers();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data pengguna",
        });
        throw error;
      }

      return data.users.map(user => ({
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
        email: user.email || '',
        role: user.user_metadata?.role || 'user',
        avatar: user.user_metadata?.avatar,
        is_active: !user.banned,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      })) as User[];
    },
  });

  const addUser = useMutation({
    mutationFn: async (newUser: { email: string, password: string, name: string, role: string }) => {
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
          name: newUser.name,
          role: newUser.role
        },
        email_confirm: true
      });

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
      // Use a different approach to ban/unban users
      const { data, error } = isActive 
        ? await supabase.auth.admin.updateUserById(userId, { ban_duration: '0 seconds' })
        : await supabase.auth.admin.updateUserById(userId, { ban_duration: '100 years' });

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
