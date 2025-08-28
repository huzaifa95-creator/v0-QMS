"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Truck, FileText, Search, Plus, Eye, Edit, Download } from "lucide-react"

interface DeliveryRecord {
  id: string
  deliveryNumber: string
  orderNumber: string
  customerName: string
  status: "pending" | "in-transit" | "delivered" | "failed"
  deliveryDate: string
  driverName: string
  vehicleNumber: string
  totalAmount: number
  itemCount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  orderNumber: string
  customerName: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  invoiceDate: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  balanceAmount: number
}

export function DeliveryInvoicingDashboard() {
  const [isCreateDeliveryOpen, setIsCreateDeliveryOpen] = useState(false)
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const deliveries: DeliveryRecord[] = [
    {
      id: "1",
      deliveryNumber: "DEL-2024-001",
      orderNumber: "ORD-2024-001",
      customerName: "ABC Construction Ltd",
      status: "delivered",
      deliveryDate: "2024-01-15",
      driverName: "John Smith",
      vehicleNumber: "ABC-123",
      totalAmount: 15000,
      itemCount: 5,
    },
    {
      id: "2",
      deliveryNumber: "DEL-2024-002",
      orderNumber: "ORD-2024-002",
      customerName: "XYZ Industries",
      status: "in-transit",
      deliveryDate: "2024-01-16",
      driverName: "Mike Johnson",
      vehicleNumber: "XYZ-456",
      totalAmount: 8500,
      itemCount: 3,
    },
  ]

  const invoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      orderNumber: "ORD-2024-001",
      customerName: "ABC Construction Ltd",
      status: "paid",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-14",
      totalAmount: 15000,
      paidAmount: 15000,
      balanceAmount: 0,
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      orderNumber: "ORD-2024-002",
      customerName: "XYZ Industries",
      status: "sent",
      invoiceDate: "2024-01-16",
      dueDate: "2024-02-15",
      totalAmount: 8500,
      paidAmount: 0,
      balanceAmount: 8500,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "paid":
        return "default"
      case "in-transit":
      case "sent":
        return "secondary"
      case "pending":
      case "draft":
        return "outline"
      case "failed":
      case "overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Delivery & Invoicing</h1>
        <p className="text-muted-foreground">Manage deliveries, track shipments, and handle customer invoicing.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">$45,200 total value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,400</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$23,500</div>
            <p className="text-xs text-muted-foreground">5 overdue invoices</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deliveries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deliveries" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Deliveries
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Delivery Management</CardTitle>
                  <CardDescription>Track and manage order deliveries</CardDescription>
                </div>
                <Button onClick={() => setIsCreateDeliveryOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Delivery
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search deliveries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Delivery #</th>
                      <th className="text-left py-2">Order #</th>
                      <th className="text-left py-2">Customer</th>
                      <th className="text-left py-2">Driver</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Delivery Date</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id} className="border-b">
                        <td className="py-2 font-medium">{delivery.deliveryNumber}</td>
                        <td className="py-2">{delivery.orderNumber}</td>
                        <td className="py-2">{delivery.customerName}</td>
                        <td className="py-2">{delivery.driverName}</td>
                        <td className="py-2">
                          <Badge variant={getStatusColor(delivery.status)}>{delivery.status}</Badge>
                        </td>
                        <td className="py-2">{delivery.deliveryDate}</td>
                        <td className="text-right py-2">${delivery.totalAmount.toLocaleString()}</td>
                        <td className="text-right py-2">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>Create and manage customer invoices</CardDescription>
                </div>
                <Button onClick={() => setIsCreateInvoiceOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Invoice #</th>
                      <th className="text-left py-2">Order #</th>
                      <th className="text-left py-2">Customer</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Invoice Date</th>
                      <th className="text-left py-2">Due Date</th>
                      <th className="text-right py-2">Total Amount</th>
                      <th className="text-right py-2">Balance</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b">
                        <td className="py-2 font-medium">{invoice.invoiceNumber}</td>
                        <td className="py-2">{invoice.orderNumber}</td>
                        <td className="py-2">{invoice.customerName}</td>
                        <td className="py-2">
                          <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </td>
                        <td className="py-2">{invoice.invoiceDate}</td>
                        <td className="py-2">{invoice.dueDate}</td>
                        <td className="text-right py-2">${invoice.totalAmount.toLocaleString()}</td>
                        <td className="text-right py-2">${invoice.balanceAmount.toLocaleString()}</td>
                        <td className="text-right py-2">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Delivery Dialog */}
      <Dialog open={isCreateDeliveryOpen} onOpenChange={setIsCreateDeliveryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Delivery Record</DialogTitle>
            <DialogDescription>Create a new delivery record for order shipment</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Order Number</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORD-2024-001">ORD-2024-001</SelectItem>
                  <SelectItem value="ORD-2024-002">ORD-2024-002</SelectItem>
                  <SelectItem value="ORD-2024-003">ORD-2024-003</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input placeholder="Enter customer name" />
            </div>
            <div className="space-y-2">
              <Label>Driver Name</Label>
              <Input placeholder="Enter driver name" />
            </div>
            <div className="space-y-2">
              <Label>Vehicle Number</Label>
              <Input placeholder="ABC-123" />
            </div>
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Delivery Notes</Label>
              <Textarea placeholder="Special delivery instructions or notes" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDeliveryOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert("Delivery record created successfully!")
                setIsCreateDeliveryOpen(false)
              }}
            >
              Create Delivery
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Generate a new invoice for completed order</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Order Number</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORD-2024-001">ORD-2024-001</SelectItem>
                  <SelectItem value="ORD-2024-002">ORD-2024-002</SelectItem>
                  <SelectItem value="ORD-2024-003">ORD-2024-003</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input placeholder="Enter customer name" />
            </div>
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net-30">Net 30 days</SelectItem>
                  <SelectItem value="net-15">Net 15 days</SelectItem>
                  <SelectItem value="due-on-receipt">Due on receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Invoice Notes</Label>
              <Textarea placeholder="Additional notes or payment instructions" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert("Invoice created successfully!")
                setIsCreateInvoiceOpen(false)
              }}
            >
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
