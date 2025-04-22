
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground mt-1">
            Konfigurasi aplikasi keuangan
          </p>
        </div>

        <Tabs defaultValue="umum" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="umum">Umum</TabsTrigger>
            <TabsTrigger value="perusahaan">Perusahaan</TabsTrigger>
            <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="umum">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>
                  Konfigurasi dasar aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Mata Uang Utama</Label>
                    <Input id="currency" value="IDR - Indonesian Rupiah" readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format Tanggal</Label>
                    <Input id="dateFormat" value="DD/MM/YYYY" readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Tahun Fiskal</Label>
                    <Input id="fiscalYear" value="Januari - Desember" readOnly />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Mode Gelap</Label>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan tampilan gelap
                      </p>
                    </div>
                    <Switch id="darkMode" />
                  </div>
                </div>
                <Button>Simpan Perubahan</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="perusahaan">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Perusahaan</CardTitle>
                <CardDescription>
                  Detail perusahaan untuk laporan dan dokumen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nama Perusahaan</Label>
                    <Input id="companyName" placeholder="PT Maju Jaya" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input id="address" placeholder="Jl. Sudirman No. 123, Jakarta" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telepon</Label>
                      <Input id="phone" placeholder="021-12345678" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="info@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxId">NPWP</Label>
                    <Input id="taxId" placeholder="12.345.678.9-123.000" />
                  </div>
                </div>
                <Button>Simpan Perubahan</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifikasi">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Notifikasi</CardTitle>
                <CardDescription>
                  Atur notifikasi dan pengingat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifikasi Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Kirim notifikasi melalui email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Pengingat Jatuh Tempo</Label>
                      <p className="text-sm text-muted-foreground">
                        Ingatkan tentang hutang atau piutang yang akan jatuh tempo
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifikasi Transaksi</Label>
                      <p className="text-sm text-muted-foreground">
                        Dapatkan notifikasi saat ada transaksi baru
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button>Simpan Perubahan</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
