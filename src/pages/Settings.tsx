
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
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useAppSettings, AppSettings } from "@/hooks/useAppSettings";
import { useApiKeys } from "@/hooks/useApiKeys";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { settings: companySettings, updateSettings, isLoading: companyLoading } = useCompanySettings();
  const { settings: appSettings, updateSetting, isLoading: appLoading } = useAppSettings();
  const { apiKeys, createApiKey, deleteApiKey, isLoading: apiKeysLoading } = useApiKeys();

  const handleCompanyUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSettings = {
      company_name: String(formData.get('company-name') || ''),
      company_address: String(formData.get('company-address') || ''),
      company_phone: String(formData.get('company-phone') || ''),
      company_email: String(formData.get('company-email') || ''),
      company_tax_id: String(formData.get('company-tax-id') || ''),
    };
    updateSettings(newSettings);
  };

  const handleAppSettingChange = (key: string, value: any) => {
    updateSetting({ key, value });
  };

  const handleCreateApiKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    createApiKey({
      key_name: String(formData.get('key-name') || ''),
      service_type: String(formData.get('service-type') || ''),
    });
    (event.target as HTMLFormElement).reset();
  };

  const handleBackup = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_history')
        .insert({
          backup_name: `Backup_${new Date().toISOString()}`,
          backup_data: {
            timestamp: new Date().toISOString(),
            settings: companySettings,
            app_settings: appSettings,
          },
        });

      if (error) throw error;

      toast({
        title: "Backup Created",
        description: "Your data has been successfully backed up",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create backup",
      });
    }
  };

  if (companyLoading || appLoading || apiKeysLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

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
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
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
                  <Switch 
                    id="auto-backup" 
                    checked={appSettings?.auto_backup || false}
                    onCheckedChange={(checked) => handleAppSettingChange('auto_backup', checked)}
                  />
                  <Label htmlFor="auto-backup">Backup Otomatis</Label>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="date-format">Format Tanggal</Label>
                  <Select 
                    value={appSettings?.date_format || "dd-MM-yyyy"}
                    onValueChange={(value) => handleAppSettingChange('date_format', value)}
                  >
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
                  <Switch 
                    id="dark-mode" 
                    checked={appSettings?.dark_mode || false}
                    onCheckedChange={(checked) => handleAppSettingChange('dark_mode', checked)}
                  />
                  <Label htmlFor="dark-mode">Mode Gelap</Label>
                </div>
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
              <CardContent>
                <form onSubmit={handleCompanyUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nama Perusahaan</Label>
                    <Input 
                      id="company-name" 
                      name="company-name" 
                      placeholder="PT Sukses Makmur" 
                      defaultValue={companySettings?.company_name || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Alamat</Label>
                    <Input 
                      id="company-address" 
                      name="company-address" 
                      placeholder="Jl. Jenderal Sudirman No. 123" 
                      defaultValue={companySettings?.company_address || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Telepon</Label>
                    <Input 
                      id="company-phone" 
                      name="company-phone" 
                      placeholder="+62 21 12345678" 
                      defaultValue={companySettings?.company_phone || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input 
                      id="company-email" 
                      name="company-email" 
                      type="email" 
                      placeholder="info@perusahaan.com" 
                      defaultValue={companySettings?.company_email || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-tax-id">NPWP</Label>
                    <Input 
                      id="company-tax-id" 
                      name="company-tax-id" 
                      placeholder="01.234.567.8-012.345" 
                      defaultValue={companySettings?.company_tax_id || ''}
                    />
                  </div>
                  <Button type="submit">Simpan Informasi Perusahaan</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Kelola API keys untuk integrasi sistem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleCreateApiKey} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Nama API Key</Label>
                    <Input id="key-name" name="key-name" placeholder="e.g., Inventory Integration" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Tipe Service</Label>
                    <Select name="service-type" defaultValue="inventory">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="accounting">Accounting</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Generate API Key</Button>
                </form>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium">API Keys Aktif</h3>
                  {apiKeys && apiKeys.length > 0 ? (
                    apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{key.key_name}</p>
                          <p className="text-sm text-muted-foreground">{key.service_type}</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteApiKey(key.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada API key yang dibuat</p>
                  )}
                </div>
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
                    <Button variant="outline" onClick={handleBackup}>
                      Backup Data Sekarang
                    </Button>
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
