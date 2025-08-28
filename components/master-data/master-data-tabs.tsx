"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomersManagement } from "./customers"
import { VendorsManagement } from "./vendors"
import { ProductsManagement } from "./products"
import { Users, Building, Package, BookOpen } from "lucide-react"

export function MasterDataTabs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Master Data Management</h1>
        <p className="text-muted-foreground">
          Manage all your core business data including customers, vendors, products, and ledgers.
        </p>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="ledgers" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Ledgers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <CustomersManagement />
        </TabsContent>

        <TabsContent value="vendors">
          <VendorsManagement />
        </TabsContent>

        <TabsContent value="products">
          <ProductsManagement />
        </TabsContent>

        <TabsContent value="ledgers">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Ledger Management</h3>
            <p className="text-muted-foreground">Coming soon - Manage your accounting ledgers</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
