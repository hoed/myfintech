
import React from "react";
import { formatRupiah } from "@/lib/formatter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dummy data for now - will be replaced with actual data from Supabase
const dummyProducts = [
  {
    id: "1",
    name: "Produk A",
    sku: "SKU-001",
    category: "Barang Dagang",
    stock: 150,
    buy_price: 50000,
    sell_price: 75000,
    supplier: "PT Supplier Utama",
  },
  {
    id: "2",
    name: "Produk B",
    sku: "SKU-002",
    category: "Barang Dagang",
    stock: 75,
    buy_price: 100000,
    sell_price: 150000,
    supplier: "PT Supplier Utama",
  },
  {
    id: "3",
    name: "Produk C",
    sku: "SKU-003",
    category: "Barang Jadi",
    stock: 200,
    buy_price: 25000,
    sell_price: 40000,
    supplier: "PT Distributor Jaya",
  },
  {
    id: "4",
    name: "Produk D",
    sku: "SKU-004",
    category: "Barang Dagang",
    stock: 50,
    buy_price: 200000,
    sell_price: 300000,
    supplier: "PT Distributor Jaya",
  },
  {
    id: "5",
    name: "Produk E",
    sku: "SKU-005",
    category: "Barang Jadi",
    stock: 100,
    buy_price: 75000,
    sell_price: 125000,
    supplier: "PT Supplier Utama",
  },
];

const InventoryProductList: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Daftar Produk</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Harga Beli</TableHead>
            <TableHead>Harga Jual</TableHead>
            <TableHead>Margin</TableHead>
            <TableHead>Supplier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyProducts.map((product) => {
            const margin = product.sell_price - product.buy_price;
            const marginPercentage = ((margin / product.buy_price) * 100).toFixed(1);
            
            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <span className={product.stock < 100 ? "text-orange-500" : "text-green-500"}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>{formatRupiah(product.buy_price)}</TableCell>
                <TableCell>{formatRupiah(product.sell_price)}</TableCell>
                <TableCell className="text-success">{marginPercentage}%</TableCell>
                <TableCell>{product.supplier}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryProductList;
