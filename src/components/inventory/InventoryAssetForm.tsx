
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InventoryAssetFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const InventoryAssetForm: React.FC<InventoryAssetFormProps> = ({ isOpen, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "tetap",
    sub_category: "elektronik",
    acquisition_date: new Date(),
    acquisition_cost: 0,
    current_value: 0,
    location: "Kantor Pusat",
    condition: "baik",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || formData.acquisition_cost <= 0) {
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "Silakan isi semua field yang wajib diisi",
      });
      return;
    }

    // For now, just show a success toast
    toast({
      title: "Berhasil",
      description: "Aset berhasil ditambahkan",
    });

    // Reset form and close
    setFormData({
      name: "",
      category: "tetap",
      sub_category: "elektronik",
      acquisition_date: new Date(),
      acquisition_cost: 0,
      current_value: 0,
      location: "Kantor Pusat",
      condition: "baik",
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
          <DialogTitle>Tambah Aset Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Aset <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama aset"
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
                <SelectItem value="tetap">Aset Tetap</SelectItem>
                <SelectItem value="tidak_tetap">Aset Tidak Tetap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sub_category">Sub Kategori</Label>
            <Select 
              value={formData.sub_category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, sub_category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih sub kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elektronik">Elektronik</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="kendaraan">Kendaraan</SelectItem>
                <SelectItem value="properti">Properti</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="acquisition_date">Tanggal Perolehan</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="acquisition_date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.acquisition_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.acquisition_date ? format(formData.acquisition_date, "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.acquisition_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, acquisition_date: date || new Date() }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="acquisition_cost">Nilai Perolehan <span className="text-destructive">*</span></Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="acquisition_cost"
                name="acquisition_cost"
                className="pl-10"
                value={formData.acquisition_cost ? formatCurrency(formData.acquisition_cost) : ''}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="current_value">Nilai Sekarang</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">Rp</span>
              <Input
                id="current_value"
                name="current_value"
                className="pl-10"
                value={formData.current_value ? formatCurrency(formData.current_value) : ''}
                onChange={handleNumberChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Lokasi</Label>
            <Select 
              value={formData.location} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kantor Pusat">Kantor Pusat</SelectItem>
                <SelectItem value="Kantor Cabang">Kantor Cabang</SelectItem>
                <SelectItem value="Gudang">Gudang</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="condition">Kondisi</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kondisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baik">Baik</SelectItem>
                <SelectItem value="rusak_ringan">Rusak Ringan</SelectItem>
                <SelectItem value="rusak_berat">Rusak Berat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi aset (opsional)"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryAssetForm;
