
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Calendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kalender Keuangan</h1>
          <p className="text-muted-foreground mt-1">
            Jadwal pembayaran dan aktivitas keuangan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Kalender</CardTitle>
              <CardDescription>Pilih tanggal untuk melihat jadwal</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mx-auto"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Jadwal Keuangan</CardTitle>
              <CardDescription>
                Aktivitas keuangan untuk tanggal yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-10 text-center text-muted-foreground">
                Belum ada jadwal keuangan untuk tanggal ini
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
