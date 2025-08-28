"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { InventoryDashboard } from "./inventory-dashboard"
import { StockTransactions } from "./stock-transactions"
import { Package, BarChart3 } from "lucide-react"

interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  category: string
  currentStock: number
  minStockLevel: number
  maxStockLevel: number
  unit: string
  costPrice: number
  sellingPrice: number
  location: string
  lastUpdated: string
  status: "in-stock" | "low-stock" | "out-of-stock" | "overstocked"
  reorderPoint: number
  supplier: string
}

interface StockMovement {
  type: "purchase" | "sale" | "adjustment" | "return" | "transfer"
  productId: string
  quantity: number
  unitPrice: number
  reference: string
  notes: string
  location: string
}

interface Transaction {
  id: string
  productId: string
  productName: string
  sku: string
  type: "purchase" | "sale" | "adjustment" | "return" | "transfer"
  quantity: number
  unit: string
  unitPrice: number
  totalValue: number
  balanceAfter: number
  reference: string
  notes?: string
  createdBy: string
  createdAt: string
  location: string
}

export function InventoryManagement() {
  const [isStockMovementOpen, setIsStockMovementOpen] = useState(false)
  const [isEditItemOpen, setIsEditItemOpen] = useState(false)
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [isViewTransactionsOpen, setIsViewTransactionsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [viewingTransactionsFor, setViewingTransactionsFor] = useState<InventoryItem | null>(null)

  const [stockMovementData, setStockMovementData] = useState<StockMovement>({
    type: "purchase",
    productId: "",
    quantity: 0,
    unitPrice: 0,
    reference: "",
    notes: "",
    location: "",
  })

  const [editItemData, setEditItemData] = useState<Partial<InventoryItem>>({})

  const [newTransactionData, setNewTransactionData] = useState({
    productId: "",
    type: "purchase",
    quantity: 0,
    unitPrice: 0,
    reference: "",
    notes: "",
    location: "",
  })

  const handleAddStock = () => {
    setStockMovementData({
      type: "purchase",
      productId: "",
      quantity: 0,
      unitPrice: 0,
      reference: "",
      notes: "",
      location: "",
    })
    setIsStockMovementOpen(true)
  }

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setEditItemData({
      productName: item.productName,
      sku: item.sku,
      category: item.category,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel,
      reorderPoint: item.reorderPoint,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      location: item.location,
      supplier: item.supplier,
    })
    setIsEditItemOpen(true)
  }

  const handleViewTransactions = (item: InventoryItem) => {
    setViewingTransactionsFor(item)
    setIsViewTransactionsOpen(true)
  }

  const handleAddTransaction = () => {
    setNewTransactionData({
      productId: "",
      type: "purchase",
      quantity: 0,
      unitPrice: 0,
      reference: "",
      notes: "",
      location: "",
    })
    setIsTransactionOpen(true)
  }

  const handleSubmitStockMovement = () => {
    if (!stockMovementData.productId || !stockMovementData.quantity || !stockMovementData.reference) {
      alert("Please fill in all required fields")
      return
    }

    console.log("Creating stock movement:", stockMovementData)
    // In a real app, this would make an API call
    alert(
      `Stock movement created successfully!\nType: ${stockMovementData.type}\nQuantity: ${stockMovementData.quantity}\nReference: ${stockMovementData.reference}`,
    )
    setIsStockMovementOpen(false)
  }

  const handleSubmitEditItem = () => {
    if (!editItemData.productName || !editItemData.sku) {
      alert("Please fill in all required fields")
      return
    }

    console.log("Updating inventory item:", selectedItem?.id, editItemData)
    // In a real app, this would make an API call
    alert(`Inventory item updated successfully!\nProduct: ${editItemData.productName}\nSKU: ${editItemData.sku}`)
    setIsEditItemOpen(false)
  }

  const handleSubmitTransaction = () => {
    if (!newTransactionData.productId || !newTransactionData.quantity || !newTransactionData.reference) {
      alert("Please fill in all required fields")
      return
    }

    console.log("Creating transaction:", newTransactionData)
    // In a real app, this would make an API call
    alert(
      `Transaction created successfully!\nType: ${newTransactionData.type}\nQuantity: ${newTransactionData.quantity}\nReference: ${newTransactionData.reference}`,
    )
    setIsTransactionOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory Tracking</h1>
        <p className="text-muted-foreground">
          Monitor stock levels, track inventory movements, and manage warehouse operations.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Dashboard
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Stock Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <InventoryDashboard
            onAddStock={handleAddStock}
            onEditItem={handleEditItem}
            onViewTransactions={handleViewTransactions}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <StockTransactions onAddTransaction={handleAddTransaction} />
        </TabsContent>
      </Tabs>

      {/* Stock Movement Dialog */}
      <Dialog open={isStockMovementOpen} onOpenChange={setIsStockMovementOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Stock Movement</DialogTitle>
            <DialogDescription>Record a new inventory movement or adjustment</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Movement Type</Label>
              <Select
                value={stockMovementData.type}
                onValueChange={(value: any) => setStockMovementData({ ...stockMovementData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={stockMovementData.productId}
                onValueChange={(value) => setStockMovementData({ ...stockMovementData, productId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Steel Rod 12mm</SelectItem>
                  <SelectItem value="2">Cement Bag 50kg</SelectItem>
                  <SelectItem value="3">Office Chair Executive</SelectItem>
                  <SelectItem value="4">Laptop Stand Aluminum</SelectItem>
                  <SelectItem value="5">Paint Bucket 5L</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={stockMovementData.quantity}
                onChange={(e) => setStockMovementData({ ...stockMovementData, quantity: Number(e.target.value) })}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Price</Label>
              <Input
                type="number"
                step="0.01"
                value={stockMovementData.unitPrice}
                onChange={(e) => setStockMovementData({ ...stockMovementData, unitPrice: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Reference</Label>
              <Input
                value={stockMovementData.reference}
                onChange={(e) => setStockMovementData({ ...stockMovementData, reference: e.target.value })}
                placeholder="PO-2024-001, ORD-2024-001, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={stockMovementData.location}
                onChange={(e) => setStockMovementData({ ...stockMovementData, location: e.target.value })}
                placeholder="Warehouse A-1"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={stockMovementData.notes}
                onChange={(e) => setStockMovementData({ ...stockMovementData, notes: e.target.value })}
                placeholder="Additional notes or comments"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsStockMovementOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitStockMovement}>Create Movement</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>Update inventory item details and settings</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                value={editItemData.productName || ""}
                onChange={(e) => setEditItemData({ ...editItemData, productName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={editItemData.sku || ""}
                onChange={(e) => setEditItemData({ ...editItemData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={editItemData.category || ""}
                onChange={(e) => setEditItemData({ ...editItemData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Input
                value={editItemData.supplier || ""}
                onChange={(e) => setEditItemData({ ...editItemData, supplier: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Min Stock Level</Label>
              <Input
                type="number"
                value={editItemData.minStockLevel || ""}
                onChange={(e) => setEditItemData({ ...editItemData, minStockLevel: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Stock Level</Label>
              <Input
                type="number"
                value={editItemData.maxStockLevel || ""}
                onChange={(e) => setEditItemData({ ...editItemData, maxStockLevel: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Reorder Point</Label>
              <Input
                type="number"
                value={editItemData.reorderPoint || ""}
                onChange={(e) => setEditItemData({ ...editItemData, reorderPoint: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={editItemData.location || ""}
                onChange={(e) => setEditItemData({ ...editItemData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cost Price</Label>
              <Input
                type="number"
                step="0.01"
                value={editItemData.costPrice || ""}
                onChange={(e) => setEditItemData({ ...editItemData, costPrice: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Selling Price</Label>
              <Input
                type="number"
                step="0.01"
                value={editItemData.sellingPrice || ""}
                onChange={(e) => setEditItemData({ ...editItemData, sellingPrice: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditItemOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEditItem}>Update Item</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Record a new inventory transaction</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select
                value={newTransactionData.type}
                onValueChange={(value: any) => setNewTransactionData({ ...newTransactionData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={newTransactionData.productId}
                onValueChange={(value) => setNewTransactionData({ ...newTransactionData, productId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Steel Rod 12mm</SelectItem>
                  <SelectItem value="2">Cement Bag 50kg</SelectItem>
                  <SelectItem value="3">Office Chair Executive</SelectItem>
                  <SelectItem value="4">Laptop Stand Aluminum</SelectItem>
                  <SelectItem value="5">Paint Bucket 5L</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={newTransactionData.quantity}
                onChange={(e) => setNewTransactionData({ ...newTransactionData, quantity: Number(e.target.value) })}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Price</Label>
              <Input
                type="number"
                step="0.01"
                value={newTransactionData.unitPrice}
                onChange={(e) => setNewTransactionData({ ...newTransactionData, unitPrice: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Reference</Label>
              <Input
                value={newTransactionData.reference}
                onChange={(e) => setNewTransactionData({ ...newTransactionData, reference: e.target.value })}
                placeholder="PO-2024-001, ORD-2024-001, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={newTransactionData.location}
                onChange={(e) => setNewTransactionData({ ...newTransactionData, location: e.target.value })}
                placeholder="Warehouse A-1"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={newTransactionData.notes}
                onChange={(e) => setNewTransactionData({ ...newTransactionData, notes: e.target.value })}
                placeholder="Additional notes or comments"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsTransactionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTransaction}>Create Transaction</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Transactions Dialog */}
      <Dialog open={isViewTransactionsOpen} onOpenChange={setIsViewTransactionsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              {viewingTransactionsFor && `Viewing transactions for ${viewingTransactionsFor.productName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Transaction history for {viewingTransactionsFor?.productName} would be displayed here.
              <br />
              This would show all stock movements, purchases, sales, and adjustments for this specific product.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsViewTransactionsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
