
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Report } from "@/types";

export const useReports = () => {
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data laporan",
        });
        throw error;
      }

      // Accept missing reportType for legacy compatibility
      return (data as any[]).map((r) => ({
        ...r,
        reportType: r.reportType || undefined,
      }));
    },
  });

  const addReport = useMutation({
    mutationFn: async (newReport: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'profit'>) => {
      const { data, error } = await supabase
        .from('reports')
        .insert([newReport])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Berhasil",
        description: "Laporan berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan laporan",
      });
      console.error('Error adding report:', error);
    },
  });

  return {
    reports,
    isLoading,
    addReport
  };
};
