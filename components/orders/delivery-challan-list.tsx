"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Eye, Truck, FileText, Calendar, User, Package } from "lucide-react"

interface DeliveryChallan {
  id: string
  challanNumber: string
  orderNumber: string
  customerName: string
  driverName: string
  vehicleNumber: string
  status: "prepared" | "dispatched" | "in-transit" | "delivered" | "returned"
  dispatchDate: string
  expectedDelivery: string
  actualDelivery?: string
  itemCount: number
  totalQuantity: number
  notes?: string
}

const mockDeliveryChallans: DeliveryChallan[] = [
  {
    id: "1",
    challanNumber: "DC-2024-001",
    orderNumber: "ORD-2024-001",
    customerName: "Global Industries Ltd",
    driverName: "John Smith",
    vehicleNumber: "ABC-123",
    status: "delivered",
    dispatchDate: "2024-08-28",
    expectedDelivery: "2024-08-30",
    actualDelivery: "2024-08-29",
    itemCount: 8,
    totalQuantity: 150,
    notes: "Delivered successfully to warehouse",
  },
  {
    id: "2",
    challanNumber: "DC-2024-002",
    orderNumber: "ORD-2024-002",
    customerName: "Construction Ltd",
    driverName: "Mike Johnson",
    vehicleNumber: "XYZ-456",
    status: "in-transit",
    dispatchDate: "2024-08-29",
    expectedDelivery: "2024-08-31",
    itemCount: 20,
    totalQuantity: 500,
    notes: "Large delivery - requires crane",
  },
  {
    id: "3",
    challanNumber: "DC-2024-003",
    orderNumber: "ORD-2024-004",
    customerName: "Tech Solutions Inc",
    driverName: "Sarah Wilson",
    vehicleNumber: "DEF-789",
    status: "dispatched",
    dispatchDate: "2024-08-30",
    expectedDelivery: "2024-09-01",
    itemCount: 12,
    totalQuantity: 25,
    notes: "Fragile items - handle with care",
  },
  {
    id: "4",
    challanNumber: "DC-2024-004",
    orderNumber: "ORD-2024-005",
    customerName: "Retail Chain Co",
    driverName: "David Brown",
    vehicleNumber: "GHI-012",
    status: "prepared",
    dispatchDate: "2024-08-31",
    expectedDelivery: "2024-09-02",
    itemCount: 25,
    totalQuantity: 300,
  },
  {
    id: "5",
    challanNumber: "DC-2024-005",
    orderNumber: "ORD-2024-003",
    customerName: "Manufacturing Corp",
    driverName: "Lisa Davis",
    vehicleNumber: "JKL-345",
    status: "returned",
    dispatchDate: "2024-08-27",
    expectedDelivery: "2024-08-29",
    actualDelivery: "2024-08-28",
    itemCount: 5,
    totalQuantity: 10,
    notes: "Customer not available - returned to warehouse",
  },
]

interface DeliveryChallanListProps {
  onCreateNew: () => void
  onEdit: (challan: DeliveryChallan) => void
  onView: (challan: DeliveryChallan) => void
}

export function DeliveryChallanList({ onCreateNew, onEdit, onView }: DeliveryChallanListProps) {
  const [challans, setChallans] = useState<DeliveryChallan[]>(mockDeliveryChallans)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredChallans = challans.filter((challan) => {
    const matchesSearch =
      challan.challanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challan.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challan.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challan.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || challan.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: DeliveryChallan["status"]) => {
    switch (status) {
      case "prepared":
        return "bg-muted text-muted-foreground"
      case "dispatched":
        return "bg-primary text-primary-foreground"
      case "in-transit":
        return "bg-secondary text-secondary-foreground"
      case "delivered":
        return "bg-chart-1 text-white"
      case "returned":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const stats = {
    total: challans.length,
    prepared: challans.filter((c) => c.status === "prepared").length,
    dispatched: challans.filter((c) => c.status === "dispatched").length,
    inTransit: challans.filter((c) => c.status === "in-transit").length,
    delivered: challans.filter((c) => c.status === "delivered").length,
    returned: challans.filter((c) => c.status === "returned").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Delivery Challan Management</h2>
          <p className="text-muted-foreground">Track delivery challans and shipment status</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create Delivery Challan
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
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prepared</p>
                <p className="text-2xl font-bold">{stats.prepared}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-primary rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Dispatched</p>
                <p className="text-2xl font-bold">{stats.dispatched}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">{stats.inTransit}</p>
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
              <div className="h-4 w-4 bg-destructive rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Returned</p>
                <p className="text-2xl font-bold">{stats.returned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Delivery Challans ({filteredChallans.length})</CardTitle>
              <CardDescription>View and manage all delivery challan records</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search challans..."
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
                  <SelectItem value="prepared">Prepared</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challan Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Driver & Vehicle</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChallans.map((challan) => (
                <TableRow key={challan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{challan.challanNumber}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <FileText className="h-3 w-3" />
                        Order: {challan.orderNumber}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Dispatched: {challan.dispatchDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {challan.customerName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{challan.driverName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {challan.vehicleNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{challan.itemCount} items</div>
                      <div className="text-sm text-muted-foreground">Qty: {challan.totalQuantity}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(challan.status)}>
                      {challan.status.charAt(0).toUpperCase() + challan.status.slice(1).replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Expected: {challan.expectedDelivery}</div>
                      {challan.actualDelivery && (
                        <div className={challan.status === "delivered" ? "text-chart-1" : "text-destructive"}>
                          Actual: {challan.actualDelivery}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(challan)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(challan)} title="Edit">
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
