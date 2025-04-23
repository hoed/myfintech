
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Report } from "@/types";

export const useReports = () => {
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching reports:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to load reports: ${error.message}`,
          });
          throw error;
        }

        // Accept missing reportType for legacy compatibility
        return (data as any[]).map((r) => ({
          ...r,
          reportType: r.reportType || "monthly", // Default to monthly for legacy data
        }));
      } catch (error: any) {
        console.error('Error in reports query:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load reports: ${error.message || 'Unknown error'}`,
        });
        throw error;
      }
    },
  });

  const addReport = useMutation({
    mutationFn: async (newReport: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'profit'>) => {
      try {
        console.log('Adding report:', newReport);
        // Calculate profit based on income and expense
        const calculatedProfit = newReport.income - newReport.expense;
        
        const reportData = {
          ...newReport,
          profit: calculatedProfit
        };
        
        const { data, error } = await supabase
          .from('reports')
          .insert([reportData])
          .select()
          .single();

        if (error) {
          console.error('Supabase error adding report:', error);
          throw new Error(error.message || 'Failed to add report');
        }
        
        if (!data) {
          throw new Error('No data returned from report creation');
        }
        
        console.log('Report added successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Error adding report:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Report added successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Berhasil",
        description: "Laporan berhasil ditambahkan",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add report: ${error.message || 'Unknown error'}`,
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
