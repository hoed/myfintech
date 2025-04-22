
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const InitializeAdmin = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const createAdminUser = async () => {
    setStatus("loading");
    try {
      // Check if user already exists
      const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers();
      
      if (fetchError) {
        throw fetchError;
      }
      
      const adminExists = existingUsers.users.some(user => user.email === 'admin@example.com');
      
      if (adminExists) {
        setStatus("success");
        return;
      }
      
      // Create admin user
      const { error: createError } = await supabase.auth.admin.createUser({
        email: 'admin@example.com',
        password: 'password123',
        email_confirm: true,
        user_metadata: {
          name: 'Admin',
          role: 'admin'
        }
      });
      
      if (createError) {
        throw createError;
      }
      
      setStatus("success");
    } catch (err: any) {
      console.error("Error creating admin user:", err);
      setError(err.message || "Failed to create admin user");
      setStatus("error");
    }
  };

  useEffect(() => {
    createAdminUser();
  }, []);

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
