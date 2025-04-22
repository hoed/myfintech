
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan Sistem</h1>
          <p className="text-muted-foreground mt-1">
            Kelola konfigurasi dan preferensi sistem keuangan
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Umum</TabsTrigger>
            <TabsTrigger value="company">Informasi Perusahaan</TabsTrigger>
            <TabsTrigger value="currency">Mata Uang</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>
                  Konfigurasi umum untuk sistem keuangan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-backup" />
                  <Label htmlFor="auto-backup">Backup Otomatis</Label>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="date-format">Format Tanggal</Label>
                  <Select defaultValue="dd-MM-yyyy">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih format tanggal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-MM-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="MM-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" />
                  <Label htmlFor="dark-mode">Mode Gelap</Label>
                </div>
                <Button>Simpan Pengaturan</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Perusahaan</CardTitle>
                <CardDescription>
                  Detail perusahaan untuk dokumen dan laporan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nama Perusahaan</Label>
                  <Input id="company-name" placeholder="PT Sukses Makmur" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Alamat</Label>
                  <Input id="company-address" placeholder="Jl. Jenderal Sudirman No. 123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telepon</Label>
                  <Input id="company-phone" placeholder="+62 21 12345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input id="company-email" type="email" placeholder="info@perusahaan.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-tax-id">NPWP</Label>
                  <Input id="company-tax-id" placeholder="01.234.567.8-012.345" />
                </div>
                <Button>Simpan Informasi Perusahaan</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="currency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Mata Uang</CardTitle>
                <CardDescription>
                  Konfigurasi mata uang dan kurs tukar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Mata Uang Utama</Label>
                  <Select defaultValue="IDR">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata uang utama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="exchange-rate">Kurs USD ke IDR</Label>
                  <div className="flex gap-2">
                    <Input id="exchange-rate" placeholder="15,000" />
                    <Button variant="outline">Update Kurs</Button>
                  </div>
                </div>
                <Button>Simpan Pengaturan Mata Uang</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>
                  Kelola backup dan restore data sistem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Backup Manual</Label>
                  <div className="flex gap-2">
                    <Button variant="outline">Backup Data Sekarang</Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Restore dari Backup</Label>
                  <div className="flex gap-2">
                    <Input id="restore-file" type="file" />
                    <Button variant="outline">Restore</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
