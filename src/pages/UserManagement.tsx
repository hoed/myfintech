
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/lib/formatter";
import { User } from "@/types";
import { Plus, Search, Trash, Edit, UserCog } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const UserManagement = () => {
  // Sample data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Ahmad Fauzi",
      email: "ahmad.fauzi@keuangan.id",
      role: "admin",
      isActive: true,
      createdAt: "2023-01-01",
      updatedAt: "2023-04-20",
    },
    {
      id: "2",
      name: "Budi Santoso",
      email: "budi.santoso@keuangan.id",
      role: "manager",
      isActive: true,
      createdAt: "2023-01-15",
      updatedAt: "2023-04-19",
    },
    {
      id: "3",
      name: "Citra Dewi",
      email: "citra.dewi@keuangan.id",
      role: "user",
      isActive: true,
      createdAt: "2023-02-01",
      updatedAt: "2023-04-18",
    },
    {
      id: "4",
      name: "Deni Pratama",
      email: "deni.pratama@keuangan.id",
      role: "user",
      isActive: false,
      createdAt: "2023-02-15",
      updatedAt: "2023-04-17",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("semua");
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "manager" | "user",
  });

  const roleLabels: Record<string, string> = {
    admin: "Administrator",
    manager: "Manajer",
    user: "Pengguna",
  };

  const handleAddUser = () => {
    const user: User = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUsers([...users, user]);
    setIsNewUserOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "user",
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive, updatedAt: new Date().toISOString() } : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterRole === "semua") {
      return matchesSearch;
    } else {
      return matchesSearch && user.role === filterRole;
    }
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
            <p className="text-muted-foreground mt-1">
              Kelola pengguna dan hak akses sistem
            </p>
          </div>
          <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Tambah Pengguna</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pengguna Baru</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Peran</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value as "admin" | "manager" | "user" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manajer</SelectItem>
                      <SelectItem value="user">Pengguna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddUser} className="mt-2">Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna berdasarkan nama atau email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Peran</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="manager">Manajer</SelectItem>
              <SelectItem value="user">Pengguna</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Tidak ada pengguna yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" 
                            ? "default" 
                            : user.role === "manager" 
                            ? "outline" 
                            : "secondary"
                        }
                      >
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={user.isActive}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                        />
                        <span className={user.isActive ? "text-success" : "text-muted-foreground"}>
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <UserCog size={16} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
