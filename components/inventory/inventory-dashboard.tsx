"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Edit, AlertTriangle, Package, BarChart3 } from "lucide-react"

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

const mockInventoryItems: InventoryItem[] = [
  {
    id: "1",
    productId: "1",
    productName: "Steel Rod 12mm",
    sku: "STL-ROD-12",
    category: "Construction Materials",
    currentStock: 85,
    minStockLevel: 100,
    maxStockLevel: 500,
    unit: "meter",
    costPrice: 45.5,
    sellingPrice: 65.0,
    location: "Warehouse A-1",
    lastUpdated: "2024-08-28",
    status: "low-stock",
    reorderPoint: 120,
    supplier: "Steel Works Ltd",
  },
  {
    id: "2",
    productId: "2",
    productName: "Cement Bag 50kg",
    sku: "CEM-BAG-50",
    category: "Construction Materials",
    currentStock: 250,
    minStockLevel: 50,
    maxStockLevel: 300,
    unit: "bag",
    costPrice: 12.0,
    sellingPrice: 18.0,
    location: "Warehouse B-2",
    lastUpdated: "2024-08-29",
    status: "in-stock",
    reorderPoint: 75,
    supplier: "Cement Co Ltd",
  },
  {
    id: "3",
    productId: "3",
    productName: "Office Chair Executive",
    sku: "OFF-CHR-EXE",
    category: "Office Furniture",
    currentStock: 0,
    minStockLevel: 10,
    maxStockLevel: 50,
    unit: "piece",
    costPrice: 150.0,
    sellingPrice: 250.0,
    location: "Warehouse C-1",
    lastUpdated: "2024-08-27",
    status: "out-of-stock",
    reorderPoint: 15,
    supplier: "Office Supplies Co",
  },
  {
    id: "4",
    productId: "4",
    productName: "Laptop Stand Aluminum",
    sku: "LAP-STD-ALU",
    category: "Electronics",
    currentStock: 45,
    minStockLevel: 15,
    maxStockLevel: 40,
    unit: "piece",
    costPrice: 35.0,
    sellingPrice: 55.0,
    location: "Warehouse C-2",
    lastUpdated: "2024-08-30",
    status: "overstocked",
    reorderPoint: 20,
    supplier: "Tech Equipment Ltd",
  },
  {
    id: "5",
    productId: "5",
    productName: "Paint Bucket 5L",
    sku: "PNT-BCK-5L",
    category: "Construction Materials",
    currentStock: 120,
    minStockLevel: 30,
    maxStockLevel: 150,
    unit: "bucket",
    costPrice: 25.0,
    sellingPrice: 40.0,
    location: "Warehouse A-3",
    lastUpdated: "2024-08-29",
    status: "in-stock",
    reorderPoint: 45,
    supplier: "Paint Co Ltd",
  },
]

interface InventoryDashboardProps {
  onAddStock: () => void
  onEditItem: (item: InventoryItem) => void
  onViewTransactions: (item: InventoryItem) => void
}

export function InventoryDashboard({ onAddStock, onEditItem, onViewTransactions }: InventoryDashboardProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return "bg-chart-1 text-white"
      case "low-stock":
        return "bg-secondary text-secondary-foreground"
      case "out-of-stock":
        return "bg-destructive text-destructive-foreground"
      case "overstocked":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStockPercentage = (item: InventoryItem) => {
    return Math.min((item.currentStock / item.maxStockLevel) * 100, 100)
  }

  const stats = {
    totalItems: inventoryItems.length,
    inStock: inventoryItems.filter((item) => item.status === "in-stock").length,
    lowStock: inventoryItems.filter((item) => item.status === "low-stock").length,
    outOfStock: inventoryItems.filter((item) => item.status === "out-of-stock").length,
    overstocked: inventoryItems.filter((item) => item.status === "overstocked").length,
    totalValue: inventoryItems.reduce((sum, item) => sum + item.currentStock * item.costPrice, 0),
  }

  const categories = [...new Set(inventoryItems.map((item) => item.category))]
  const lowStockItems = inventoryItems.filter((item) => item.status === "low-stock" || item.status === "out-of-stock")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Dashboard</h2>
          <p className="text-muted-foreground">Monitor stock levels and manage inventory</p>
        </div>
        <Button onClick={onAddStock}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock Movement
        </Button>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{lowStockItems.length} items</strong> require attention:{" "}
            {lowStockItems
              .slice(0, 3)
              .map((item) => item.productName)
              .join(", ")}
            {lowStockItems.length > 3 && ` and ${lowStockItems.length - 3} more`}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-chart-1 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">In Stock</p>
                <p className="text-2xl font-bold">{stats.inStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-secondary rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-destructive rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-accent rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Overstocked</p>
                <p className="text-2xl font-bold">{stats.overstocked}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-chart-1" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
              <CardDescription>Monitor stock levels and manage inventory items</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="overstocked">Overstocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const stockPercentage = getStockPercentage(item)
                const stockValue = item.currentStock * item.costPrice

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {item.productName}
                        </div>
                        <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                        <div className="text-sm text-muted-foreground">{item.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {item.currentStock} {item.unit}s
                          </span>
                          <span className="text-muted-foreground">{stockPercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={stockPercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                      {item.currentStock <= item.reorderPoint && (
                        <div className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Reorder needed
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.location}</div>
                      <div className="text-xs text-muted-foreground">Updated: {item.lastUpdated}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${stockValue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          @ ${item.costPrice}/{item.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.supplier}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewTransactions(item)}
                          title="View Transactions"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEditItem(item)} title="Edit Item">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
