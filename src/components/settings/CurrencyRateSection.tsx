
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { format } from "date-fns";

export const CurrencyRateSection = () => {
  const { rates, isLoading, updateCurrencyRates } = useCurrencyRates();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kurs Mata Uang</CardTitle>
        <CardDescription>
          Kelola kurs mata uang untuk konversi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Terakhir diperbarui: {rates.length > 0 
              ? format(new Date(rates[0].updated_at), 'dd MMM yyyy HH:mm') 
              : 'Tidak ada data'}
          </p>
          <Button 
            variant="outline" 
            onClick={() => updateCurrencyRates()}
            disabled={isLoading}
          >
            Perbarui Kurs Sekarang
          </Button>
        </div>
        
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat data kurs...</p>
        ) : rates.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Dari</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Ke</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Nilai</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {rates.map((rate) => (
                  <tr key={rate.id}>
                    <td className="px-4 py-2 text-sm">{rate.currency_from}</td>
                    <td className="px-4 py-2 text-sm">{rate.currency_to}</td>
                    <td className="px-4 py-2 text-sm">{rate.rate.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 6 
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada data kurs yang tersedia</p>
        )}
      </CardContent>
    </Card>
  );
};
