"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Package, DollarSign } from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  description: string
  category: string
  unit: string
  costPrice: number
  sellingPrice: number
  stockQuantity: number
  minStockLevel: number
  status: "active" | "inactive" | "discontinued"
  createdAt: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Steel Rod 12mm",
    sku: "STL-ROD-12",
    description: "High-grade steel reinforcement rod, 12mm diameter",
    category: "Construction Materials",
    unit: "meter",
    costPrice: 45.5,
    sellingPrice: 65.0,
    stockQuantity: 500,
    minStockLevel: 100,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Cement Bag 50kg",
    sku: "CEM-BAG-50",
    description: "Portland cement, 50kg bag",
    category: "Construction Materials",
    unit: "bag",
    costPrice: 12.0,
    sellingPrice: 18.0,
    stockQuantity: 200,
    minStockLevel: 50,
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Office Chair Executive",
    sku: "OFF-CHR-EXE",
    description: "Ergonomic executive office chair with lumbar support",
    category: "Office Furniture",
    unit: "piece",
    costPrice: 150.0,
    sellingPrice: 250.0,
    stockQuantity: 25,
    minStockLevel: 10,
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Laptop Stand Aluminum",
    sku: "LAP-STD-ALU",
    description: "Adjustable aluminum laptop stand",
    category: "Electronics",
    unit: "piece",
    costPrice: 35.0,
    sellingPrice: 55.0,
    stockQuantity: 5,
    minStockLevel: 15,
    status: "discontinued",
    createdAt: "2024-01-10",
  },
]

const productCategories = [
  "Construction Materials",
  "Office Furniture",
  "Electronics",
  "Raw Materials",
  "Tools & Equipment",
  "Services",
  "Other",
]

const units = ["piece", "meter", "kilogram", "bag", "box", "liter", "square meter", "cubic meter", "ton", "hour"]

export function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    unit: "",
    costPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    minStockLevel: "",
    status: "active" as "active" | "inactive" | "discontinued",
  })

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...formData,
                costPrice: Number.parseFloat(formData.costPrice),
                sellingPrice: Number.parseFloat(formData.sellingPrice),
                stockQuantity: Number.parseInt(formData.stockQuantity),
                minStockLevel: Number.parseInt(formData.minStockLevel),
              }
            : product,
        ),
      )
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        costPrice: Number.parseFloat(formData.costPrice),
        sellingPrice: Number.parseFloat(formData.sellingPrice),
        stockQuantity: Number.parseInt(formData.stockQuantity),
        minStockLevel: Number.parseInt(formData.minStockLevel),
        createdAt: new Date().toISOString().split("T")[0],
      }
      setProducts([...products, newProduct])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "",
      unit: "",
      costPrice: "",
      sellingPrice: "",
      stockQuantity: "",
      minStockLevel: "",
      status: "active",
    })
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      unit: product.unit,
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      stockQuantity: product.stockQuantity.toString(),
      minStockLevel: product.minStockLevel.toString(),
      status: product.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  const getStockStatus = (product: Product) => {
    if (product.stockQuantity <= 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (product.stockQuantity <= product.minStockLevel) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product information" : "Enter product details to add to your catalog"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price ($)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive" | "discontinued") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
              <CardDescription>View and manage your product catalog</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
                  {productCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
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
                <TableHead>Category</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product)
                const margin = (((product.sellingPrice - product.costPrice) / product.costPrice) * 100).toFixed(1)

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {product.name}
                        </div>
                        <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">per {product.unit}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-medium">${product.sellingPrice}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Cost: ${product.costPrice} ({margin}% margin)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {product.stockQuantity} {product.unit}s
                        </div>
                        <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                        <div className="text-sm text-muted-foreground">Min: {product.minStockLevel}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active"
                            ? "default"
                            : product.status === "inactive"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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
