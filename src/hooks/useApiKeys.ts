
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ApiKey {
  id: string;
  key_name: string;
  key_value: string;
  service_type: string;
  is_active: boolean | null;
  created_at: string | null;
  expires_at: string | null;
}

export const useApiKeys = () => {
  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat API keys",
        });
        throw error;
      }

      return data as ApiKey[];
    },
  });

  const createApiKey = useMutation({
    mutationFn: async (values: { key_name: string; service_type: string }) => {
      const key_value = crypto.randomUUID();
      const { error } = await supabase
        .from('api_keys')
        .insert({ ...values, key_value });

      if (error) throw error;
      return key_value;
    },
    onSuccess: (key_value) => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({
        title: "API Key Created",
        description: `Your new API key is: ${key_value}. Please save it now as you won't be able to see it again.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create API key",
      });
    },
  });

  const deleteApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast({
        title: "Berhasil",
        description: "API key berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus API key",
      });
    },
  });

  return {
    apiKeys,
    isLoading,
    createApiKey: createApiKey.mutate,
    deleteApiKey: deleteApiKey.mutate,
  };
};
