"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Eye, Building, FileText, Calendar, DollarSign, Paperclip } from "lucide-react"

interface PurchaseOrder {
  id: string
  poNumber: string
  vendorName: string
  vendorEmail: string
  title: string
  status: "draft" | "sent" | "acknowledged" | "fulfilled" | "cancelled"
  totalAmount: number
  orderDate: string
  expectedDelivery: string
  actualDelivery?: string
  itemCount: number
  attachments: number
  linkedOrderNumber?: string
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    vendorName: "Steel Works Ltd",
    vendorEmail: "sales@steelworks.com",
    title: "Steel Rod Supply",
    status: "acknowledged",
    totalAmount: 45000,
    orderDate: "2024-08-26",
    expectedDelivery: "2024-09-10",
    itemCount: 5,
    attachments: 2,
    linkedOrderNumber: "ORD-2024-001",
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    vendorName: "Logistics Express",
    vendorEmail: "info@logexpress.com",
    title: "Transportation Services",
    status: "sent",
    totalAmount: 12000,
    orderDate: "2024-08-27",
    expectedDelivery: "2024-09-05",
    itemCount: 3,
    attachments: 1,
    linkedOrderNumber: "ORD-2024-002",
  },
  {
    id: "3",
    poNumber: "PO-2024-003",
    vendorName: "Office Supplies Co",
    vendorEmail: "orders@officesupplies.com",
    title: "Office Equipment",
    status: "fulfilled",
    totalAmount: 8500,
    orderDate: "2024-08-20",
    expectedDelivery: "2024-08-30",
    actualDelivery: "2024-08-29",
    itemCount: 12,
    attachments: 3,
    linkedOrderNumber: "ORD-2024-004",
  },
  {
    id: "4",
    poNumber: "PO-2024-004",
    vendorName: "Construction Materials Inc",
    vendorEmail: "sales@construction.com",
    title: "Building Materials",
    status: "draft",
    totalAmount: 67000,
    orderDate: "2024-08-28",
    expectedDelivery: "2024-09-15",
    itemCount: 20,
    attachments: 0,
    linkedOrderNumber: "ORD-2024-002",
  },
  {
    id: "5",
    poNumber: "PO-2024-005",
    vendorName: "Tech Equipment Ltd",
    vendorEmail: "procurement@techequip.com",
    title: "IT Hardware",
    status: "cancelled",
    totalAmount: 25000,
    orderDate: "2024-08-25",
    expectedDelivery: "2024-09-08",
    itemCount: 8,
    attachments: 1,
  },
]

interface PurchaseOrderListProps {
  onCreateNew: () => void
  onEdit: (po: PurchaseOrder) => void
  onView: (po: PurchaseOrder) => void
}

export function PurchaseOrderList({ onCreateNew, onEdit, onView }: PurchaseOrderListProps) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (po.linkedOrderNumber && po.linkedOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || po.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: PurchaseOrder["status"]) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground"
      case "sent":
        return "bg-primary text-primary-foreground"
      case "acknowledged":
        return "bg-secondary text-secondary-foreground"
      case "fulfilled":
        return "bg-chart-1 text-white"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const stats = {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter((po) => po.status === "draft").length,
    sent: purchaseOrders.filter((po) => po.status === "sent").length,
    acknowledged: purchaseOrders.filter((po) => po.status === "acknowledged").length,
    fulfilled: purchaseOrders.filter((po) => po.status === "fulfilled").length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Purchase Order Management</h2>
          <p className="text-muted-foreground">Manage purchase orders and vendor procurement</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create Purchase Order
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
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-primary rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-secondary rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold">{stats.acknowledged}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-chart-1 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Fulfilled</p>
                <p className="text-2xl font-bold">{stats.fulfilled}</p>
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
              <CardTitle>Purchase Orders ({filteredPOs.length})</CardTitle>
              <CardDescription>View and manage all purchase order records</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search purchase orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
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
                <TableHead>Purchase Order</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPOs.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{po.poNumber}</div>
                      <div className="text-sm text-muted-foreground">{po.title}</div>
                      {po.linkedOrderNumber && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <FileText className="h-3 w-3" />
                          Linked: {po.linkedOrderNumber}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Ordered: {po.orderDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {po.vendorName}
                      </div>
                      <div className="text-sm text-muted-foreground">{po.vendorEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${po.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{po.itemCount} items</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(po.status)}>
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Expected: {po.expectedDelivery}</div>
                      {po.actualDelivery && <div className="text-chart-1">Actual: {po.actualDelivery}</div>}
                      {po.status === "acknowledged" && !po.actualDelivery && (
                        <div className="text-secondary">In Progress</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{po.attachments}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(po)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(po)} title="Edit">
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
