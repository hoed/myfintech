
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAppSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat pengaturan aplikasi",
        });
        throw error;
      }

      return data.reduce((acc, curr) => ({
        ...acc,
        [curr.setting_key]: JSON.parse(curr.setting_value)
      }), {});
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ setting_value: JSON.stringify(value) })
        .eq('setting_key', key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil diperbarui",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal memperbarui pengaturan",
      });
    },
  });

  return {
    settings,
    isLoading,
    updateSetting: updateSetting.mutate,
  };
};
