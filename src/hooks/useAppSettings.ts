
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
          if (typeof curr.setting_value === 'string') {
            // Handle boolean values stored as strings
            if (curr.setting_value === 'true') {
              value = true;
            } else if (curr.setting_value === 'false') {
              value = false;
            } else {
              // Try JSON parse for other values
              value = JSON.parse(curr.setting_value);
            }
          } else {
            value = curr.setting_value;
          }
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
      console.log(`Updating setting ${key} to ${value}`);
      
      // Convert value to string for storage if it's an object or boolean
      const stringValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : String(value);
      
      const { data: existingRecord, error: fetchError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', key)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Error checking existing record:", fetchError);
        throw fetchError;
      }
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from('app_settings')
          .update({ setting_value: stringValue })
          .eq('setting_key', key);
      } else {
        // Insert new record
        result = await supabase
          .from('app_settings')
          .insert({ setting_key: key, setting_value: stringValue });
      }
      
      if (result.error) {
        console.error("Error updating/inserting setting:", result.error);
        throw result.error;
      }
      
      return { key, value };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil diperbarui",
      });
      console.log(`Successfully updated setting ${data.key} to ${data.value}`);
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
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
