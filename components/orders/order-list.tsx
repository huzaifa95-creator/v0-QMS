"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Eye, Truck, FileText, Calendar, DollarSign, User, Package } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  quotationNumber: string
  customerName: string
  customerEmail: string
  title: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  totalAmount: number
  orderDate: string
  expectedDelivery: string
  actualDelivery?: string
  itemCount: number
  priority: "low" | "medium" | "high" | "urgent"
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    quotationNumber: "QUO-2024-002",
    customerName: "Global Industries Ltd",
    customerEmail: "info@global.com",
    title: "Steel Supply Contract",
    status: "processing",
    totalAmount: 125000,
    orderDate: "2024-08-25",
    expectedDelivery: "2024-09-15",
    itemCount: 8,
    priority: "high",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    quotationNumber: "QUO-2024-006",
    customerName: "Construction Ltd",
    customerEmail: "projects@construction.com",
    title: "Building Materials Order",
    status: "confirmed",
    totalAmount: 89000,
    orderDate: "2024-08-26",
    expectedDelivery: "2024-09-10",
    itemCount: 20,
    priority: "medium",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    quotationNumber: "QUO-2024-007",
    customerName: "Manufacturing Corp",
    customerEmail: "orders@manufacturing.com",
    title: "Equipment Purchase",
    status: "shipped",
    totalAmount: 45000,
    orderDate: "2024-08-20",
    expectedDelivery: "2024-08-30",
    actualDelivery: "2024-08-28",
    itemCount: 5,
    priority: "low",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    quotationNumber: "QUO-2024-008",
    customerName: "Tech Solutions Inc",
    customerEmail: "hello@techsol.com",
    title: "Office Setup Order",
    status: "delivered",
    totalAmount: 28500,
    orderDate: "2024-08-15",
    expectedDelivery: "2024-08-25",
    actualDelivery: "2024-08-24",
    itemCount: 12,
    priority: "medium",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    quotationNumber: "QUO-2024-009",
    customerName: "Retail Chain Co",
    customerEmail: "procurement@retail.com",
    title: "Inventory Restock",
    status: "pending",
    totalAmount: 67000,
    orderDate: "2024-08-27",
    expectedDelivery: "2024-09-20",
    itemCount: 25,
    priority: "urgent",
  },
]

interface OrderListProps {
  onCreateNew: () => void
  onEdit: (order: Order) => void
  onView: (order: Order) => void
}

export function OrderList({ onCreateNew, onEdit, onView }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-muted text-muted-foreground"
      case "confirmed":
        return "bg-primary text-primary-foreground"
      case "processing":
        return "bg-secondary text-secondary-foreground"
      case "shipped":
        return "bg-accent text-accent-foreground"
      case "delivered":
        return "bg-chart-1 text-white"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: Order["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-muted text-muted-foreground"
      case "medium":
        return "bg-secondary text-secondary-foreground"
      case "high":
        return "bg-accent text-accent-foreground"
      case "urgent":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-muted-foreground">Track and manage customer orders and fulfillment</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-secondary rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{stats.processing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">{stats.shipped}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-chart-1 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{stats.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-chart-1" />
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
              <CardTitle>Orders ({filteredOrders.length})</CardTitle>
              <CardDescription>View and manage all order records</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">{order.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <FileText className="h-3 w-3" />
                        From: {order.quotationNumber}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Ordered: {order.orderDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {order.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${order.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{order.itemCount} items</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Expected: {order.expectedDelivery}</div>
                      {order.actualDelivery && <div className="text-chart-1">Actual: {order.actualDelivery}</div>}
                      {order.status === "shipped" && !order.actualDelivery && (
                        <div className="text-accent">In Transit</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(order)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(order)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
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
