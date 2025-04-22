
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AppSettings {
  auto_backup?: boolean;
  date_format?: string;
  dark_mode?: boolean;
  default_currency?: string;
  [key: string]: any; // This allows the object to have any string as a key, making it compatible with Json
}

export const useAppSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings = {} as AppSettings, isLoading } = useQuery({
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

      // Convert the array of settings to an object
      return data.reduce((acc, curr) => {
        let value;
        try {
          // Try to parse the value as JSON
          value = typeof curr.setting_value === 'string' 
            ? JSON.parse(curr.setting_value.toString()) 
            : curr.setting_value;
        } catch (e) {
          // If parsing fails, use the raw value
          value = curr.setting_value;
        }
        
        return {
          ...acc,
          [curr.setting_key]: value
        };
      }, {} as AppSettings);
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      // Convert value to string for storage if it's an object or boolean
      const stringValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : JSON.stringify(value);
      
      const { error } = await supabase
        .from('app_settings')
        .update({ setting_value: stringValue })
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
