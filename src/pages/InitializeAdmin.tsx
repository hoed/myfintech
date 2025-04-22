
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const InitializeAdmin = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const createAdminUser = async () => {
    setStatus("loading");
    try {
      // Create admin user
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Admin',
            role: 'admin'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Set email as confirmed
      await supabase.auth.admin.updateUserById(
        data?.user?.id || '',
        { email_confirm: true }
      );
      
      setStatus("success");
    } catch (err: any) {
      console.error("Error creating admin user:", err);
      setError(err.message || "Failed to create admin user");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Initialize Admin User</CardTitle>
          <CardDescription>
            Setting up admin user for the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "idle" && (
            <Button onClick={createAdminUser} className="w-full">
              Create Admin User
            </Button>
          )}
          {status === "loading" && <p>Creating admin user...</p>}
          {status === "success" && (
            <div className="text-center">
              <p className="text-green-600 mb-4">Admin user has been created successfully!</p>
              <p><strong>Email:</strong> admin@example.com</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          )}
          {status === "error" && (
            <p className="text-red-600">Error: {error}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => window.location.href = "/login"}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InitializeAdmin;
