"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Eye, Copy, FileText, Calendar, DollarSign, User } from "lucide-react"

interface Quotation {
  id: string
  quotationNumber: string
  customerName: string
  customerEmail: string
  title: string
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  totalAmount: number
  validUntil: string
  createdAt: string
  updatedAt: string
  version: number
  itemCount: number
}

const mockQuotations: Quotation[] = [
  {
    id: "1",
    quotationNumber: "QUO-2024-001",
    customerName: "Acme Corporation",
    customerEmail: "contact@acme.com",
    title: "Office Renovation Project",
    status: "sent",
    totalAmount: 45000,
    validUntil: "2024-09-15",
    createdAt: "2024-08-20",
    updatedAt: "2024-08-22",
    version: 2,
    itemCount: 12,
  },
  {
    id: "2",
    quotationNumber: "QUO-2024-002",
    customerName: "Global Industries Ltd",
    customerEmail: "info@global.com",
    title: "Steel Supply Contract",
    status: "accepted",
    totalAmount: 125000,
    validUntil: "2024-08-30",
    createdAt: "2024-08-18",
    updatedAt: "2024-08-25",
    version: 1,
    itemCount: 8,
  },
  {
    id: "3",
    quotationNumber: "QUO-2024-003",
    customerName: "Tech Solutions Inc",
    customerEmail: "hello@techsol.com",
    title: "Equipment Purchase",
    status: "draft",
    totalAmount: 28500,
    validUntil: "2024-09-10",
    createdAt: "2024-08-23",
    updatedAt: "2024-08-23",
    version: 1,
    itemCount: 5,
  },
  {
    id: "4",
    quotationNumber: "QUO-2024-004",
    customerName: "Manufacturing Corp",
    customerEmail: "orders@manufacturing.com",
    title: "Raw Materials Supply",
    status: "rejected",
    totalAmount: 67000,
    validUntil: "2024-08-25",
    createdAt: "2024-08-15",
    updatedAt: "2024-08-26",
    version: 3,
    itemCount: 15,
  },
  {
    id: "5",
    quotationNumber: "QUO-2024-005",
    customerName: "Construction Ltd",
    customerEmail: "projects@construction.com",
    title: "Building Materials Quote",
    status: "expired",
    totalAmount: 89000,
    validUntil: "2024-08-20",
    createdAt: "2024-08-10",
    updatedAt: "2024-08-12",
    version: 1,
    itemCount: 20,
  },
]

interface QuotationListProps {
  onCreateNew: () => void
  onEdit: (quotation: Quotation) => void
  onView: (quotation: Quotation) => void
}

export function QuotationList({ onCreateNew, onEdit, onView }: QuotationListProps) {
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Quotation["status"]) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground"
      case "sent":
        return "bg-primary text-primary-foreground"
      case "accepted":
        return "bg-chart-1 text-white"
      case "rejected":
        return "bg-destructive text-destructive-foreground"
      case "expired":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleDuplicate = (quotation: Quotation) => {
    const newQuotation: Quotation = {
      ...quotation,
      id: Date.now().toString(),
      quotationNumber: `QUO-2024-${String(quotations.length + 1).padStart(3, "0")}`,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      version: 1,
      title: `${quotation.title} (Copy)`,
    }
    setQuotations([newQuotation, ...quotations])
  }

  const stats = {
    total: quotations.length,
    draft: quotations.filter((q) => q.status === "draft").length,
    sent: quotations.filter((q) => q.status === "sent").length,
    accepted: quotations.filter((q) => q.status === "accepted").length,
    totalValue: quotations.reduce((sum, q) => sum + q.totalAmount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quotation Management</h2>
          <p className="text-muted-foreground">Create, manage, and track your quotations</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quotation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <Edit className="h-4 w-4 text-muted-foreground" />
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
              <Eye className="h-4 w-4 text-primary" />
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
              <div className="h-4 w-4 bg-chart-1 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{stats.accepted}</p>
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
              <CardTitle>Quotations ({filteredQuotations.length})</CardTitle>
              <CardDescription>View and manage all quotation records</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{quotation.quotationNumber}</div>
                      <div className="text-sm text-muted-foreground">{quotation.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Created: {quotation.createdAt}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {quotation.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground">{quotation.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${quotation.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{quotation.itemCount} items</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(quotation.status)}>
                      {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {quotation.validUntil}
                      {new Date(quotation.validUntil) < new Date() && quotation.status !== "accepted" && (
                        <div className="text-destructive text-xs">Expired</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">v{quotation.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(quotation)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(quotation)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(quotation)} title="Duplicate">
                        <Copy className="h-4 w-4" />
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
