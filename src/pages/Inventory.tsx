
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import InventoryProductList from "@/components/inventory/InventoryProductList";
import InventoryAssetList from "@/components/inventory/InventoryAssetList";
import InventoryProductForm from "@/components/inventory/InventoryProductForm";
import InventoryAssetForm from "@/components/inventory/InventoryAssetForm";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventaris</h1>
            <p className="text-muted-foreground mt-1">
              Kelola produk, aset, dan barang perusahaan
            </p>
          </div>
          <Button 
            className="flex items-center gap-2" 
            onClick={() => activeTab === "products" ? setIsProductFormOpen(true) : setIsAssetFormOpen(true)}
          >
            <Plus size={16} />
            <span>Tambah {activeTab === "products" ? "Produk" : "Aset"}</span>
          </Button>
        </div>

        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="assets">Aset</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <InventoryProductList />
            </div>
          </TabsContent>
          <TabsContent value="assets" className="mt-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <InventoryAssetList />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Dialogs */}
      <InventoryProductForm 
        isOpen={isProductFormOpen} 
        onOpenChange={setIsProductFormOpen} 
      />

      <InventoryAssetForm 
        isOpen={isAssetFormOpen} 
        onOpenChange={setIsAssetFormOpen} 
      />
    </MainLayout>
  );
};

export default Inventory;
