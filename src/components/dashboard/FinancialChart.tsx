
import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatRupiah } from "@/lib/formatter";

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface FinancialChartProps {
  data: ChartData[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
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

  return (
    <div className="h-[300px] w-full mt-4">
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
    </div>
  );
};

export default FinancialChart;
