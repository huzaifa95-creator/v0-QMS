"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Mail, Edit } from "lucide-react"

interface QuotationViewerProps {
  quotation: any
  onBack: () => void
  onEdit: () => void
}

export function QuotationViewer({ quotation, onBack, onEdit }: QuotationViewerProps) {
  const handleDownloadPDF = () => {
    alert(`Downloading PDF for quotation ${quotation.quotationNumber}`)
  }

  const handleSendEmail = () => {
    alert(`Sending quotation ${quotation.quotationNumber} via email to ${quotation.customerEmail}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{quotation.quotationNumber}</h1>
            <p className="text-muted-foreground">{quotation.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Quotation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
              <p className="text-sm">{quotation.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{quotation.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{quotation.customerPhone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company</p>
              <p className="text-sm">{quotation.customerCompany || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quotation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                variant={
                  quotation.status === "accepted" ? "default" : quotation.status === "sent" ? "secondary" : "outline"
                }
              >
                {quotation.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created Date</p>
              <p className="text-sm">{quotation.createdAt}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valid Until</p>
              <p className="text-sm">{quotation.validUntil}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p className="text-sm">v{quotation.version || "1.0"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subtotal</p>
              <p className="text-sm">${(quotation.totalAmount * 0.85).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tax (15%)</p>
              <p className="text-sm">${(quotation.totalAmount * 0.15).toLocaleString()}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-lg font-bold">${quotation.totalAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation Items</CardTitle>
          <CardDescription>Items included in this quotation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Mock items - in real app this would come from quotation.items */}
                <tr className="border-b">
                  <td className="py-2">Steel Rod 12mm</td>
                  <td className="py-2">High-grade construction steel rod</td>
                  <td className="text-right py-2">100</td>
                  <td className="text-right py-2">$25.00</td>
                  <td className="text-right py-2">$2,500.00</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Cement Bag 50kg</td>
                  <td className="py-2">Premium Portland cement</td>
                  <td className="text-right py-2">50</td>
                  <td className="text-right py-2">$12.00</td>
                  <td className="text-right py-2">$600.00</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Paint Bucket 5L</td>
                  <td className="py-2">Weather-resistant exterior paint</td>
                  <td className="text-right py-2">20</td>
                  <td className="text-right py-2">$35.00</td>
                  <td className="text-right py-2">$700.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Payment terms: 30 days net</p>
            <p>• Delivery: 2-3 weeks from order confirmation</p>
            <p>• Prices are valid for 30 days from quotation date</p>
            <p>• All prices are exclusive of taxes unless stated otherwise</p>
            <p>• Delivery charges may apply based on location</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
