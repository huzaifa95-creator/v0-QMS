"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Trash2, Calculator, FileText, Send, Save, Upload } from "lucide-react"

interface QuotationItem {
  id: string
  productId: string
  productName: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  markup: number
  discount: number
  total: number
}

interface Customer {
  id: string
  name: string
  email: string
  address: string
}

interface QuotationBuilderProps {
  onBack: () => void
  editingQuotation?: any
}

const mockCustomers: Customer[] = [
  { id: "1", name: "Acme Corporation", email: "contact@acme.com", address: "123 Business St, New York, NY 10001" },
  {
    id: "2",
    name: "Global Industries Ltd",
    email: "info@global.com",
    address: "456 Industrial Ave, Chicago, IL 60601",
  },
  {
    id: "3",
    name: "Tech Solutions Inc",
    email: "hello@techsol.com",
    address: "789 Tech Park, San Francisco, CA 94105",
  },
]

const mockProducts = [
  { id: "1", name: "Steel Rod 12mm", unit: "meter", price: 65.0 },
  { id: "2", name: "Cement Bag 50kg", unit: "bag", price: 18.0 },
  { id: "3", name: "Office Chair Executive", unit: "piece", price: 250.0 },
  { id: "4", name: "Laptop Stand Aluminum", unit: "piece", price: 55.0 },
]

export function QuotationBuilder({ onBack, editingQuotation }: QuotationBuilderProps) {
  const [formData, setFormData] = useState({
    title: editingQuotation?.title || "",
    customerId: editingQuotation?.customerId || "",
    validUntil: editingQuotation?.validUntil || "",
    notes: editingQuotation?.notes || "",
    terms: editingQuotation?.terms || "Payment due within 30 days of acceptance.",
  })

  const [items, setItems] = useState<QuotationItem[]>(editingQuotation?.items || [])
  const [taxRate, setTaxRate] = useState(10) // 10% tax
  const [currentStep, setCurrentStep] = useState(1)

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      productId: "",
      productName: "",
      description: "",
      quantity: 1,
      unit: "piece",
      unitPrice: 0,
      markup: 0,
      discount: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Auto-fill product details when product is selected
          if (field === "productId" && value) {
            const product = mockProducts.find((p) => p.id === value)
            if (product) {
              updatedItem.productName = product.name
              updatedItem.unit = product.unit
              updatedItem.unitPrice = product.price
            }
          }

          // Recalculate total
          const basePrice = updatedItem.unitPrice * updatedItem.quantity
          const markupAmount = basePrice * (updatedItem.markup / 100)
          const discountAmount = (basePrice + markupAmount) * (updatedItem.discount / 100)
          updatedItem.total = basePrice + markupAmount - discountAmount

          return updatedItem
        }
        return item
      }),
    )
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const grandTotal = subtotal + taxAmount

  const selectedCustomer = mockCustomers.find((c) => c.id === formData.customerId)

  const handleSave = (status: "draft" | "sent") => {
    console.log("Saving quotation:", { formData, items, status, subtotal, taxAmount, grandTotal })
    // Here you would typically save to your backend
    onBack()
  }

  const steps = [
    { id: 1, title: "Basic Information", description: "Customer and quotation details" },
    { id: 2, title: "Add Items", description: "Select products and services" },
    { id: 3, title: "Review & Send", description: "Final review and submission" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quotations
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{editingQuotation ? "Edit Quotation" : "Create New Quotation"}</h2>
          <p className="text-muted-foreground">
            {editingQuotation ? "Update quotation details" : "Build a professional quotation for your customer"}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                  `}
                  >
                    {step.id}
                  </div>
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details for this quotation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quotation Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Office Renovation Project"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes or requirements..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    placeholder="Payment terms, delivery conditions, etc."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quotation Items</CardTitle>
                    <CardDescription>Add products and services to this quotation</CardDescription>
                  </div>
                  <Button onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Markup %</TableHead>
                      <TableHead>Discount %</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="space-y-2">
                            <Select
                              value={item.productId}
                              onValueChange={(value) => updateItem(item.id, "productId", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockProducts.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} - ${product.price}/{product.unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.markup}
                            onChange={(e) => updateItem(item.id, "markup", Number.parseFloat(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, "discount", Number.parseFloat(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${item.total.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {items.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No items added yet. Click "Add Item" to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Send</CardTitle>
                <CardDescription>Review your quotation before sending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Quotation Details</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Title:</strong> {formData.title}
                      </div>
                      <div>
                        <strong>Valid Until:</strong> {formData.validUntil}
                      </div>
                      <div>
                        <strong>Items:</strong> {items.length}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Customer</h4>
                    {selectedCustomer && (
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Name:</strong> {selectedCustomer.name}
                        </div>
                        <div>
                          <strong>Email:</strong> {selectedCustomer.email}
                        </div>
                        <div>
                          <strong>Address:</strong> {selectedCustomer.address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Items Summary</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.productName} x {item.quantity}
                        </span>
                        <span>${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => handleSave("draft")} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button onClick={() => handleSave("sent")}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Quotation
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Preview PDF
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Attach Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(Math.min(3, currentStep + 1))} disabled={currentStep === 3}>
              Next
            </Button>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Quotation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({taxRate}%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Items: {items.length}</div>
                <div>Customer: {selectedCustomer?.name || "Not selected"}</div>
                <div>Valid until: {formData.validUntil || "Not set"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Load Template
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Import Items
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
