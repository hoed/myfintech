
import React, { useState } from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatRupiah } from "@/lib/formatter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface FinancialChartProps {
  dailyData: ChartData[];
  monthlyData: ChartData[];
  yearlyData: ChartData[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ dailyData, monthlyData, yearlyData }) => {
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm text-success">
            Pendapatan: {formatRupiah(payload[0].value)}
          </p>
          <p className="text-sm text-danger">
            Pengeluaran: {formatRupiah(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = (data: ChartData[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis 
          tickFormatter={(value) => 
            new Intl.NumberFormat('id-ID', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value)
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="income" name="Pendapatan" fill="#34A853" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Pengeluaran" fill="#EA4335" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div>
      <Tabs value={period} onValueChange={(value) => setPeriod(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Harian (7 Hari)</TabsTrigger>
          <TabsTrigger value="monthly">Bulanan (6 Bulan)</TabsTrigger>
          <TabsTrigger value="yearly">Tahunan (5 Tahun)</TabsTrigger>
        </TabsList>
        <div className="h-[300px] w-full">
          <TabsContent value="daily" className="h-full">
            {renderChart(dailyData)}
          </TabsContent>
          <TabsContent value="monthly" className="h-full">
            {renderChart(monthlyData)}
          </TabsContent>
          <TabsContent value="yearly" className="h-full">
            {renderChart(yearlyData)}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FinancialChart;
