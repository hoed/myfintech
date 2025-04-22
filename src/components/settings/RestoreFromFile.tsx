
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RestoreFromFile = () => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith('.sql')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid SQL file",
      });
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const sqlContent = e.target?.result;
        if (typeof sqlContent !== 'string') return;

        const { error } = await supabase.rpc('restore_from_sql', {
          sql_content: sqlContent
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Database restored successfully",
        });
      };
      reader.readAsText(file);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to restore database",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Restore from File</CardTitle>
        <CardDescription>
          Upload a SQL backup file to restore the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="sql-file">SQL Backup File</Label>
            <Input
              id="sql-file"
              type="file"
              accept=".sql"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
