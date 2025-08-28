"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, ArrowUp, ArrowDown, Package, FileText, Calendar, User } from "lucide-react"

interface StockTransaction {
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

const mockTransactions: StockTransaction[] = [
  {
    id: "1",
    productId: "1",
    productName: "Steel Rod 12mm",
    sku: "STL-ROD-12",
    type: "purchase",
    quantity: 200,
    unit: "meter",
    unitPrice: 45.5,
    totalValue: 9100,
    balanceAfter: 285,
    reference: "PO-2024-001",
    notes: "Bulk purchase from Steel Works Ltd",
    createdBy: "John Admin",
    createdAt: "2024-08-25",
    location: "Warehouse A-1",
  },
  {
    id: "2",
    productId: "1",
    productName: "Steel Rod 12mm",
    sku: "STL-ROD-12",
    type: "sale",
    quantity: -150,
    unit: "meter",
    unitPrice: 65.0,
    totalValue: -9750,
    balanceAfter: 135,
    reference: "ORD-2024-001",
    notes: "Sale to Global Industries Ltd",
    createdBy: "Sales User",
    createdAt: "2024-08-27",
    location: "Warehouse A-1",
  },
  {
    id: "3",
    productId: "1",
    productName: "Steel Rod 12mm",
    sku: "STL-ROD-12",
    type: "sale",
    quantity: -50,
    unit: "meter",
    unitPrice: 65.0,
    totalValue: -3250,
    balanceAfter: 85,
    reference: "ORD-2024-003",
    notes: "Sale to Construction Ltd",
    createdBy: "Sales User",
    createdAt: "2024-08-28",
    location: "Warehouse A-1",
  },
  {
    id: "4",
    productId: "2",
    productName: "Cement Bag 50kg",
    sku: "CEM-BAG-50",
    type: "purchase",
    quantity: 300,
    unit: "bag",
    unitPrice: 12.0,
    totalValue: 3600,
    balanceAfter: 300,
    reference: "PO-2024-002",
    notes: "Monthly stock replenishment",
    createdBy: "Procurement User",
    createdAt: "2024-08-26",
    location: "Warehouse B-2",
  },
  {
    id: "5",
    productId: "2",
    productName: "Cement Bag 50kg",
    sku: "CEM-BAG-50",
    type: "sale",
    quantity: -50,
    unit: "bag",
    unitPrice: 18.0,
    totalValue: -900,
    balanceAfter: 250,
    reference: "ORD-2024-002",
    notes: "Sale to Construction Ltd",
    createdBy: "Sales User",
    createdAt: "2024-08-29",
    location: "Warehouse B-2",
  },
  {
    id: "6",
    productId: "3",
    productName: "Office Chair Executive",
    sku: "OFF-CHR-EXE",
    type: "sale",
    quantity: -10,
    unit: "piece",
    unitPrice: 250.0,
    totalValue: -2500,
    balanceAfter: 0,
    reference: "ORD-2024-004",
    notes: "Complete stock sold to Tech Solutions Inc",
    createdBy: "Sales User",
    createdAt: "2024-08-27",
    location: "Warehouse C-1",
  },
  {
    id: "7",
    productId: "4",
    productName: "Laptop Stand Aluminum",
    sku: "LAP-STD-ALU",
    type: "adjustment",
    quantity: 5,
    unit: "piece",
    unitPrice: 35.0,
    totalValue: 175,
    balanceAfter: 45,
    reference: "ADJ-2024-001",
    notes: "Stock count adjustment - found additional items",
    createdBy: "Warehouse Manager",
    createdAt: "2024-08-30",
    location: "Warehouse C-2",
  },
  {
    id: "8",
    productId: "5",
    productName: "Paint Bucket 5L",
    sku: "PNT-BCK-5L",
    type: "return",
    quantity: 20,
    unit: "bucket",
    unitPrice: 40.0,
    totalValue: 800,
    balanceAfter: 120,
    reference: "RET-2024-001",
    notes: "Customer return - defective items",
    createdBy: "Returns Handler",
    createdAt: "2024-08-29",
    location: "Warehouse A-3",
  },
]

interface StockTransactionsProps {
  onAddTransaction: () => void
}

export function StockTransactions({ onAddTransaction }: StockTransactionsProps) {
  const [transactions, setTransactions] = useState<StockTransaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [productFilter, setProductFilter] = useState<string>("all")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesProduct = productFilter === "all" || transaction.productId === productFilter
    return matchesSearch && matchesType && matchesProduct
  })

  const getTypeColor = (type: StockTransaction["type"]) => {
    switch (type) {
      case "purchase":
        return "bg-chart-1 text-white"
      case "sale":
        return "bg-primary text-primary-foreground"
      case "adjustment":
        return "bg-secondary text-secondary-foreground"
      case "return":
        return "bg-accent text-accent-foreground"
      case "transfer":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: StockTransaction["type"]) => {
    switch (type) {
      case "purchase":
      case "return":
      case "adjustment":
        return <ArrowUp className="h-3 w-3" />
      case "sale":
      case "transfer":
        return <ArrowDown className="h-3 w-3" />
      default:
        return <Package className="h-3 w-3" />
    }
  }

  const stats = {
    totalTransactions: transactions.length,
    purchases: transactions.filter((t) => t.type === "purchase").length,
    sales: transactions.filter((t) => t.type === "sale").length,
    adjustments: transactions.filter((t) => t.type === "adjustment").length,
    returns: transactions.filter((t) => t.type === "return").length,
    totalValue: transactions.reduce((sum, t) => sum + Math.abs(t.totalValue), 0),
  }

  const uniqueProducts = [...new Set(transactions.map((t) => ({ id: t.productId, name: t.productName })))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stock Transactions</h2>
          <p className="text-muted-foreground">Track all inventory movements and transactions</p>
        </div>
        <Button onClick={onAddTransaction}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-chart-1" />
              <div>
                <p className="text-sm text-muted-foreground">Purchases</p>
                <p className="text-2xl font-bold">{stats.purchases}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sales</p>
                <p className="text-2xl font-bold">{stats.sales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Adjustments</p>
                <p className="text-2xl font-bold">{stats.adjustments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Returns</p>
                <p className="text-2xl font-bold">{stats.returns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-chart-1 rounded-full" />
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
              <CardTitle>Transaction History ({filteredTransactions.length})</CardTitle>
              <CardDescription>View all stock movements and inventory transactions</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {uniqueProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
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
                <TableHead>Transaction</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Balance After</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.productName}</div>
                      <div className="text-sm text-muted-foreground">SKU: {transaction.sku}</div>
                      <div className="text-sm text-muted-foreground">{transaction.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(transaction.type)}>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(transaction.type)}
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${transaction.quantity > 0 ? "text-chart-1" : "text-destructive"}`}>
                      {transaction.quantity > 0 ? "+" : ""}
                      {transaction.quantity} {transaction.unit}s
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @ ${transaction.unitPrice}/{transaction.unit}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${transaction.totalValue > 0 ? "text-chart-1" : "text-destructive"}`}>
                      {transaction.totalValue > 0 ? "+" : ""}${transaction.totalValue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {transaction.balanceAfter} {transaction.unit}s
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {transaction.reference}
                      </div>
                      {transaction.notes && <div className="text-sm text-muted-foreground">{transaction.notes}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {transaction.createdAt}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {transaction.createdBy}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
