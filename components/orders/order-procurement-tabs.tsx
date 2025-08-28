"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { OrderList } from "./order-list"
import { PurchaseOrderList } from "./purchase-order-list"
import { DeliveryChallanList } from "./delivery-challan-list"
import { ShoppingCart, FileText, Truck } from "lucide-react"

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

export function OrderProcurementTabs() {
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false)
  const [isCreateChallanOpen, setIsCreateChallanOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("orders")

  const [newOrderData, setNewOrderData] = useState({
    quotationNumber: "direct",
    customerName: "",
    customerEmail: "",
    title: "",
    totalAmount: 0,
    expectedDelivery: "",
    itemCount: 0,
    priority: "medium",
  })

  const [newPOData, setNewPOData] = useState({
    vendorName: "",
    vendorEmail: "",
    title: "",
    totalAmount: 0,
    expectedDelivery: "",
    itemCount: 0,
    linkedOrderNumber: "",
  })

  const [newChallanData, setNewChallanData] = useState({
    orderNumber: "",
    customerName: "",
    driverName: "",
    vehicleNumber: "",
    expectedDelivery: "",
    itemCount: 0,
    totalQuantity: 0,
    notes: "",
  })

  const handleCreateOrder = () => {
    setNewOrderData({
      quotationNumber: "direct",
      customerName: "",
      customerEmail: "",
      title: "",
      totalAmount: 0,
      expectedDelivery: "",
      itemCount: 0,
      priority: "medium",
    })
    setIsCreateOrderOpen(true)
  }

  const handleCreatePO = () => {
    setNewPOData({
      vendorName: "",
      vendorEmail: "",
      title: "",
      totalAmount: 0,
      expectedDelivery: "",
      itemCount: 0,
      linkedOrderNumber: "",
    })
    setIsCreatePOOpen(true)
  }

  const handleCreateChallan = () => {
    setNewChallanData({
      orderNumber: "",
      customerName: "",
      driverName: "",
      vehicleNumber: "",
      expectedDelivery: "",
      itemCount: 0,
      totalQuantity: 0,
      notes: "",
    })
    setIsCreateChallanOpen(true)
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setIsViewDialogOpen(true)
  }

  const handleSubmitOrder = () => {
    if (!newOrderData.customerName || !newOrderData.title || !newOrderData.totalAmount) {
      alert("Please fill in all required fields")
      return
    }

    const orderNumber = `ORD-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    console.log("Creating order:", { ...newOrderData, orderNumber })
    alert(`Order created successfully!\nOrder Number: ${orderNumber}\nCustomer: ${newOrderData.customerName}`)
    setIsCreateOrderOpen(false)
  }

  const handleSubmitPO = () => {
    if (!newPOData.vendorName || !newPOData.title || !newPOData.totalAmount) {
      alert("Please fill in all required fields")
      return
    }

    const poNumber = `PO-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    console.log("Creating purchase order:", { ...newPOData, poNumber })
    alert(`Purchase Order created successfully!\nPO Number: ${poNumber}\nVendor: ${newPOData.vendorName}`)
    setIsCreatePOOpen(false)
  }

  const handleSubmitChallan = () => {
    if (!newChallanData.orderNumber || !newChallanData.customerName || !newChallanData.driverName) {
      alert("Please fill in all required fields")
      return
    }

    const challanNumber = `DC-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    console.log("Creating delivery challan:", { ...newChallanData, challanNumber })
    alert(
      `Delivery Challan created successfully!\nChallan Number: ${challanNumber}\nDriver: ${newChallanData.driverName}`,
    )
    setIsCreateChallanOpen(false)
  }

  const handleSubmitEdit = () => {
    if (!selectedItem) return

    console.log("Updating item:", selectedItem.id)
    alert(
      `Item ${selectedItem.orderNumber || selectedItem.poNumber || selectedItem.challanNumber} updated successfully!`,
    )
    setIsEditDialogOpen(false)
  }

  const getCreateHandler = () => {
    switch (activeTab) {
      case "orders":
        return handleCreateOrder
      case "purchase-orders":
        return handleCreatePO
      case "delivery-challans":
        return handleCreateChallan
      default:
        return handleCreateOrder
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders & Procurement</h1>
        <p className="text-muted-foreground">Manage customer orders, purchase orders, and delivery tracking.</p>
      </div>

      <Tabs defaultValue="orders" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Customer Orders
          </TabsTrigger>
          <TabsTrigger value="purchase-orders" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="delivery-challans" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Delivery Challans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrderList onCreateNew={getCreateHandler()} onEdit={handleEdit} onView={handleView} />
        </TabsContent>

        <TabsContent value="purchase-orders">
          <PurchaseOrderList onCreateNew={getCreateHandler()} onEdit={handleEdit} onView={handleView} />
        </TabsContent>

        <TabsContent value="delivery-challans">
          <DeliveryChallanList onCreateNew={getCreateHandler()} onEdit={handleEdit} onView={handleView} />
        </TabsContent>
      </Tabs>

      {/* Create Order Dialog */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Create a new customer order from quotation or direct request</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Quotation Number</Label>
              <Select
                value={newOrderData.quotationNumber}
                onValueChange={(value) => setNewOrderData({ ...newOrderData, quotationNumber: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quotation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QUO-2024-001">QUO-2024-001</SelectItem>
                  <SelectItem value="QUO-2024-002">QUO-2024-002</SelectItem>
                  <SelectItem value="QUO-2024-003">QUO-2024-003</SelectItem>
                  <SelectItem value="direct">Direct Order (No Quotation)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={newOrderData.priority}
                onValueChange={(value: any) => setNewOrderData({ ...newOrderData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={newOrderData.customerName}
                onChange={(e) => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Customer Email</Label>
              <Input
                type="email"
                value={newOrderData.customerEmail}
                onChange={(e) => setNewOrderData({ ...newOrderData, customerEmail: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Order Title</Label>
              <Input
                value={newOrderData.title}
                onChange={(e) => setNewOrderData({ ...newOrderData, title: e.target.value })}
                placeholder="Brief description of the order"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={newOrderData.totalAmount}
                onChange={(e) => setNewOrderData({ ...newOrderData, totalAmount: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Item Count</Label>
              <Input
                type="number"
                value={newOrderData.itemCount}
                onChange={(e) => setNewOrderData({ ...newOrderData, itemCount: Number(e.target.value) })}
                placeholder="Number of items"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Expected Delivery Date</Label>
              <Input
                type="date"
                value={newOrderData.expectedDelivery}
                onChange={(e) => setNewOrderData({ ...newOrderData, expectedDelivery: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitOrder}>Create Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Purchase Order Dialog */}
      <Dialog open={isCreatePOOpen} onOpenChange={setIsCreatePOOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>Create a new purchase order for vendor procurement</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Vendor Name</Label>
              <Input
                value={newPOData.vendorName}
                onChange={(e) => setNewPOData({ ...newPOData, vendorName: e.target.value })}
                placeholder="Enter vendor name"
              />
            </div>
            <div className="space-y-2">
              <Label>Vendor Email</Label>
              <Input
                type="email"
                value={newPOData.vendorEmail}
                onChange={(e) => setNewPOData({ ...newPOData, vendorEmail: e.target.value })}
                placeholder="vendor@example.com"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Purchase Order Title</Label>
              <Input
                value={newPOData.title}
                onChange={(e) => setNewPOData({ ...newPOData, title: e.target.value })}
                placeholder="Brief description of the purchase order"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={newPOData.totalAmount}
                onChange={(e) => setNewPOData({ ...newPOData, totalAmount: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Item Count</Label>
              <Input
                type="number"
                value={newPOData.itemCount}
                onChange={(e) => setNewPOData({ ...newPOData, itemCount: Number(e.target.value) })}
                placeholder="Number of items"
              />
            </div>
            <div className="space-y-2">
              <Label>Linked Order Number</Label>
              <Select
                value={newPOData.linkedOrderNumber}
                onValueChange={(value) => setNewPOData({ ...newPOData, linkedOrderNumber: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked order</SelectItem>
                  <SelectItem value="ORD-2024-001">ORD-2024-001</SelectItem>
                  <SelectItem value="ORD-2024-002">ORD-2024-002</SelectItem>
                  <SelectItem value="ORD-2024-003">ORD-2024-003</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expected Delivery Date</Label>
              <Input
                type="date"
                value={newPOData.expectedDelivery}
                onChange={(e) => setNewPOData({ ...newPOData, expectedDelivery: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreatePOOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPO}>Create Purchase Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Delivery Challan Dialog */}
      <Dialog open={isCreateChallanOpen} onOpenChange={setIsCreateChallanOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Delivery Challan</DialogTitle>
            <DialogDescription>Create a new delivery challan for order shipment</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Order Number</Label>
              <Select
                value={newChallanData.orderNumber}
                onValueChange={(value) => setNewChallanData({ ...newChallanData, orderNumber: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORD-2024-001">ORD-2024-001</SelectItem>
                  <SelectItem value="ORD-2024-002">ORD-2024-002</SelectItem>
                  <SelectItem value="ORD-2024-003">ORD-2024-003</SelectItem>
                  <SelectItem value="ORD-2024-004">ORD-2024-004</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={newChallanData.customerName}
                onChange={(e) => setNewChallanData({ ...newChallanData, customerName: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Driver Name</Label>
              <Input
                value={newChallanData.driverName}
                onChange={(e) => setNewChallanData({ ...newChallanData, driverName: e.target.value })}
                placeholder="Enter driver name"
              />
            </div>
            <div className="space-y-2">
              <Label>Vehicle Number</Label>
              <Input
                value={newChallanData.vehicleNumber}
                onChange={(e) => setNewChallanData({ ...newChallanData, vehicleNumber: e.target.value })}
                placeholder="ABC-123"
              />
            </div>
            <div className="space-y-2">
              <Label>Item Count</Label>
              <Input
                type="number"
                value={newChallanData.itemCount}
                onChange={(e) => setNewChallanData({ ...newChallanData, itemCount: Number(e.target.value) })}
                placeholder="Number of items"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Quantity</Label>
              <Input
                type="number"
                value={newChallanData.totalQuantity}
                onChange={(e) => setNewChallanData({ ...newChallanData, totalQuantity: Number(e.target.value) })}
                placeholder="Total quantity"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Expected Delivery Date</Label>
              <Input
                type="date"
                value={newChallanData.expectedDelivery}
                onChange={(e) => setNewChallanData({ ...newChallanData, expectedDelivery: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={newChallanData.notes}
                onChange={(e) => setNewChallanData({ ...newChallanData, notes: e.target.value })}
                placeholder="Special delivery instructions or notes"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateChallanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitChallan}>Create Delivery Challan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
            <DialogDescription>Detailed information about the selected item</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                    <p className="text-sm">
                      {selectedItem.orderNumber || selectedItem.poNumber || selectedItem.challanNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <p className="text-sm capitalize">{selectedItem.status}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Customer/Vendor</Label>
                    <p className="text-sm">{selectedItem.customerName || selectedItem.vendorName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amount/Items</Label>
                    <p className="text-sm">
                      {selectedItem.totalAmount
                        ? `$${selectedItem.totalAmount.toLocaleString()}`
                        : `${selectedItem.itemCount} items`}
                    </p>
                  </div>
                </div>
                {selectedItem.title && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                    <p className="text-sm">{selectedItem.title}</p>
                  </div>
                )}
                {selectedItem.notes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                    <p className="text-sm">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit{" "}
              {activeTab === "orders"
                ? "Order"
                : activeTab === "purchase-orders"
                  ? "Purchase Order"
                  : "Delivery Challan"}
            </DialogTitle>
            <DialogDescription>Update the item details and status</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue={selectedItem.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTab === "orders" && (
                        <>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </>
                      )}
                      {activeTab === "purchase-orders" && (
                        <>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="acknowledged">Acknowledged</SelectItem>
                          <SelectItem value="fulfilled">Fulfilled</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </>
                      )}
                      {activeTab === "delivery-challans" && (
                        <>
                          <SelectItem value="prepared">Prepared</SelectItem>
                          <SelectItem value="dispatched">Dispatched</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="returned">Returned</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue={selectedItem.priority || "medium"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Customer/Vendor Name</Label>
                  <Input defaultValue={selectedItem.customerName || selectedItem.vendorName} />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input type="number" step="0.01" defaultValue={selectedItem.totalAmount} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Expected Delivery Date</Label>
                  <Input type="date" defaultValue={selectedItem.expectedDelivery} />
                </div>
                {selectedItem.notes !== undefined && (
                  <div className="col-span-2 space-y-2">
                    <Label>Notes</Label>
                    <Textarea defaultValue={selectedItem.notes} />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
