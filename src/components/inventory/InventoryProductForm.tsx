
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface InventoryProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const InventoryProductForm: React.FC<InventoryProductFormProps> = ({ isOpen, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "barang_dagang",
    stock: 0,
    buy_price: 0,
    sell_price: 0,
    supplier: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.sku || !formData.supplier || formData.buy_price <= 0) {
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "Silakan isi semua field yang wajib diisi",
      });
      return;
    }

    // For now, just show a success toast
    // In a real implementation, this would send data to the server
    toast({
      title: "Berhasil",
      description: "Produk berhasil ditambahkan",
    });

    // Reset form and close
    setFormData({
      name: "",
      sku: "",
      category: "barang_dagang",
      stock: 0,
      buy_price: 0,
      sell_price: 0,
      supplier: "",
      description: "",
    });
    
    onOpenChange(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseInt(value.replace(/[^\d]/g, ''), 10) : 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Produk <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama produk"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sku">SKU <span className="text-destructive">*</span></Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU-001"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Kategori</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="barang_dagang">Barang Dagang</SelectItem>
                <SelectItem value="barang_jadi">Barang Jadi</SelectItem>
                <SelectItem value="bahan_baku">Bahan Baku</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock">Stok Awal</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleNumberChange}
              min={0}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="buy_price">Harga Beli <span className="text-destructive">*</span></Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="buy_price"
                name="buy_price"
                className="pl-10"
                value={formData.buy_price ? formatCurrency(formData.buy_price) : ''}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sell_price">Harga Jual</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="sell_price"
                name="sell_price"
                className="pl-10"
                value={formData.sell_price ? formatCurrency(formData.sell_price) : ''}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supplier">Supplier <span className="text-destructive">*</span></Label>
            <Input
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Nama supplier"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi produk (opsional)"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryProductForm;
