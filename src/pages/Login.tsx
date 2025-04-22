
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/layout/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Berhasil Login",
        description: "Selamat datang kembali!",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Login",
        description: error.message || "Terjadi kesalahan saat login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-full p-3">
                <DollarSign size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Keuangan Mandiri</CardTitle>
            <CardDescription>
              Masuk ke akun Anda untuk mengakses sistem keuangan.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Sedang Login..." : "Login"}
              </Button>
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  className="text-sm" 
                  onClick={() => navigate("/initialize-admin")}
                >
                  Initialize Admin
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
