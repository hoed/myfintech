
import React, { useState } from "react";
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
import { useTheme } from "next-themes";

const Settings = () => {
  const { settings: companySettings, updateSettings, isLoading: companyLoading } = useCompanySettings();
  const { settings: appSettings, updateSetting, isLoading: appLoading } = useAppSettings();
  const { apiKeys, createApiKey, deleteApiKey, isLoading: apiKeysLoading } = useApiKeys();
  const [backups, setBackups] = useState<any[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleCompanyUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSettings = {
      company_name: formData.get('company-name')?.toString() || '',
      company_address: formData.get('company-address')?.toString() || '',
      company_phone: formData.get('company-phone')?.toString() || '',
      company_email: formData.get('company-email')?.toString() || '',
      company_tax_id: formData.get('company-tax-id')?.toString() || '',
    };
    updateSettings(newSettings);
  };

  const handleAppSettingChange = (key: string, value: any) => {
    updateSetting({ key, value });
    
    // Update theme when dark_mode setting changes
    if (key === 'dark_mode') {
      setTheme(value ? 'dark' : 'light');
    }
  };

  // Ensure theme is synced with appSettings when component mounts
  React.useEffect(() => {
    if (appSettings?.dark_mode !== undefined) {
      setTheme(appSettings.dark_mode ? 'dark' : 'light');
    }
  }, [appSettings?.dark_mode, setTheme]);

  const handleCreateApiKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    createApiKey({
      key_name: formData.get('key-name')?.toString() || '',
      service_type: formData.get('service-type')?.toString() || '',
    });
    (event.target as HTMLFormElement).reset();
  };

  const handleBackup = async () => {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        settings: companySettings || null,
        app_settings: appSettings || {}
      };

      const { error } = await supabase
        .from('backup_history')
        .insert({
          backup_name: `Backup_${new Date().toISOString().split('T')[0]}`,
          backup_data: backupData,
        });

      if (error) throw error;

      toast({
        title: "Backup Created",
        description: "Your data has been successfully backed up",
      });
      
      // Refresh backups list
      fetchBackups();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create backup",
      });
    }
  };

  const fetchBackups = async () => {
    setLoadingBackups(true);
    try {
      const { data, error } = await supabase
        .from('backup_history')
        .select('*')
        .order('backup_date', { ascending: false });

      if (error) throw error;
      setBackups(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch backups",
      });
    } finally {
      setLoadingBackups(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    try {
      const { data, error } = await supabase
        .from('backup_history')
        .select('backup_data')
        .eq('id', backupId)
        .single();

      if (error) throw error;
      
      const backupData = data.backup_data;
      
      // Restore company settings
      if (backupData.settings && backupData.settings.id) {
        await supabase
          .from('company_settings')
          .update({
            company_name: backupData.settings.company_name,
            company_address: backupData.settings.company_address,
            company_phone: backupData.settings.company_phone,
            company_email: backupData.settings.company_email,
            company_tax_id: backupData.settings.company_tax_id,
          })
          .eq('id', backupData.settings.id);
      }
      
      // Restore app settings
      if (backupData.app_settings) {
        // For each setting in the backup, update the existing setting or insert a new one
        for (const [key, value] of Object.entries(backupData.app_settings)) {
          const { data: existingSetting } = await supabase
            .from('app_settings')
            .select('id')
            .eq('setting_key', key)
            .maybeSingle();
            
          const stringValue = typeof value === 'object' ? JSON.stringify(value) : value?.toString() || '';
          
          if (existingSetting) {
            await supabase
              .from('app_settings')
              .update({ setting_value: stringValue })
              .eq('setting_key', key);
          } else {
            await supabase
              .from('app_settings')
              .insert({ setting_key: key, setting_value: stringValue });
          }
        }
      }
      
      toast({
        title: "Restore Completed",
        description: "Your data has been successfully restored",
      });
      
      // Refresh data
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to restore backup",
      });
    }
  };

  // Fetch backups when component mounts
  React.useEffect(() => {
    fetchBackups();
  }, []);

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
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Riwayat Backup</Label>
                  {loadingBackups ? (
                    <p className="text-sm text-muted-foreground">Memuat daftar backup...</p>
                  ) : backups.length > 0 ? (
                    <div className="space-y-2">
                      {backups.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{backup.backup_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(backup.backup_date).toLocaleString()}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRestore(backup.id)}
                          >
                            Restore
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada backup yang dibuat</p>
                  )}
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
