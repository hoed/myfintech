
import React from "react";
import { formatRupiah, formatDate } from "@/lib/formatter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dummy data for now - will be replaced with actual data from Supabase
const dummyAssets = [
  {
    id: "1",
    name: "Komputer PC",
    category: "Tetap",
    sub_category: "Elektronik",
    acquisition_date: "2023-01-15",
    acquisition_cost: 12000000,
    current_value: 9000000,
    location: "Kantor Pusat",
    condition: "Baik",
  },
  {
    id: "2",
    name: "Mesin Fotokopi",
    category: "Tetap",
    sub_category: "Elektronik",
    acquisition_date: "2022-08-20",
    acquisition_cost: 30000000,
    current_value: 25000000,
    location: "Kantor Pusat",
    condition: "Baik",
  },
  {
    id: "3",
    name: "Kendaraan Operasional",
    category: "Tetap",
    sub_category: "Kendaraan",
    acquisition_date: "2022-04-10",
    acquisition_cost: 250000000,
    current_value: 200000000,
    location: "Kantor Pusat",
    condition: "Baik",
  },
  {
    id: "4",
    name: "Peralatan Kantor",
    category: "Tidak Tetap",
    sub_category: "Furniture",
    acquisition_date: "2023-03-05",
    acquisition_cost: 15000000,
    current_value: 14000000,
    location: "Kantor Cabang",
    condition: "Baik",
  },
  {
    id: "5",
    name: "Server",
    category: "Tetap",
    sub_category: "Elektronik",
    acquisition_date: "2022-10-12",
    acquisition_cost: 50000000,
    current_value: 40000000,
    location: "Kantor Pusat",
    condition: "Baik",
  },
];

const InventoryAssetList: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Daftar Aset</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Aset</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Sub Kategori</TableHead>
            <TableHead>Tanggal Perolehan</TableHead>
            <TableHead>Nilai Perolehan</TableHead>
            <TableHead>Nilai Sekarang</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Kondisi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyAssets.map((asset) => {
            const depreciationPercentage = 
              ((asset.acquisition_cost - asset.current_value) / asset.acquisition_cost * 100).toFixed(1);
            
            return (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>
                  <Badge variant={asset.category === "Tetap" ? "default" : "secondary"}>
                    {asset.category}
                  </Badge>
                </TableCell>
                <TableCell>{asset.sub_category}</TableCell>
                <TableCell>{formatDate(asset.acquisition_date)}</TableCell>
                <TableCell>{formatRupiah(asset.acquisition_cost)}</TableCell>
                <TableCell>{formatRupiah(asset.current_value)}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>
                  <span className={
                    asset.condition === "Baik" 
                      ? "text-green-500" 
                      : asset.condition === "Rusak Ringan"
                        ? "text-orange-500"
                        : "text-destructive"
                  }>
                    {asset.condition}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (Depresiasi {depreciationPercentage}%)
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryAssetList;
