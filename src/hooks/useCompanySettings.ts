
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCompanySettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['companySettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat pengaturan perusahaan",
        });
        throw error;
      }

      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<typeof settings>) => {
      const { error } = await supabase
        .from('company_settings')
        .update(newSettings)
        .eq('id', settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companySettings'] });
      toast({
        title: "Berhasil",
        description: "Pengaturan perusahaan berhasil diperbarui",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal memperbarui pengaturan perusahaan",
      });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
  };
};
