"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Ship,
  Plane,
  Truck,
  FileText,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Globe,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
} from "lucide-react"
import { useState } from "react"

interface Shipment {
  id: string
  type: "Import" | "Export"
  origin: string
  destination: string
  status: string
  mode: string
  eta: string
  value: string
  documents: string[]
  customsStatus: string
  description?: string
}

interface Document {
  name: string
  type: string
  required: boolean
  status: string
  file?: File
}

export function ImportExportDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: "IMP-2024-001",
      type: "Import",
      origin: "Shanghai, China",
      destination: "Karachi, Pakistan",
      status: "In Transit",
      mode: "Sea",
      eta: "2024-01-15",
      value: "$45,000",
      documents: ["Bill of Lading", "Commercial Invoice", "Packing List"],
      customsStatus: "Pending",
    },
    {
      id: "EXP-2024-002",
      type: "Export",
      origin: "Lahore, Pakistan",
      destination: "Dubai, UAE",
      status: "Customs Cleared",
      mode: "Air",
      eta: "2024-01-12",
      value: "$28,500",
      documents: ["AWB", "Export Declaration", "Certificate of Origin"],
      customsStatus: "Cleared",
    },
    {
      id: "IMP-2024-003",
      type: "Import",
      origin: "Hamburg, Germany",
      destination: "Karachi, Pakistan",
      status: "Delivered",
      mode: "Sea",
      eta: "2024-01-08",
      value: "$67,200",
      documents: ["Bill of Lading", "Commercial Invoice", "Insurance Certificate"],
      customsStatus: "Cleared",
    },
    {
      id: "EXP-2024-004",
      type: "Export",
      origin: "Karachi, Pakistan",
      destination: "London, UK",
      status: "Documentation",
      mode: "Air",
      eta: "2024-01-18",
      value: "$15,800",
      documents: ["Commercial Invoice", "Packing List"],
      customsStatus: "Pending",
    },
  ])

  const [documents, setDocuments] = useState<Document[]>([
    { name: "Bill of Lading", type: "Shipping", required: true, status: "Complete" },
    { name: "Commercial Invoice", type: "Commercial", required: true, status: "Complete" },
    { name: "Packing List", type: "Commercial", required: true, status: "Complete" },
    { name: "Certificate of Origin", type: "Regulatory", required: false, status: "Pending" },
    { name: "Insurance Certificate", type: "Insurance", required: false, status: "Complete" },
    { name: "Export Declaration", type: "Customs", required: true, status: "Pending" },
  ])

  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false)
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [newShipmentData, setNewShipmentData] = useState({
    type: "",
    mode: "",
    origin: "",
    destination: "",
    value: "",
    eta: "",
    description: "",
  })

  const handleExportData = () => {
    const csvContent = [
      ["Shipment ID", "Type", "Origin", "Destination", "Status", "Mode", "ETA", "Value", "Customs Status"],
      ...shipments.map((shipment) => [
        shipment.id,
        shipment.type,
        shipment.origin,
        shipment.destination,
        shipment.status,
        shipment.mode,
        shipment.eta,
        shipment.value,
        shipment.customsStatus,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `shipments-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleCreateShipment = () => {
    if (!newShipmentData.type || !newShipmentData.origin || !newShipmentData.destination) {
      alert("Please fill in all required fields")
      return
    }

    const newShipment: Shipment = {
      id: `${newShipmentData.type.toUpperCase().substring(0, 3)}-2024-${String(shipments.length + 1).padStart(3, "0")}`,
      type: newShipmentData.type as "Import" | "Export",
      origin: newShipmentData.origin,
      destination: newShipmentData.destination,
      status: "Documentation",
      mode: newShipmentData.mode,
      eta: newShipmentData.eta,
      value: newShipmentData.value,
      documents: [],
      customsStatus: "Pending",
      description: newShipmentData.description,
    }

    setShipments([...shipments, newShipment])
    setNewShipmentData({
      type: "",
      mode: "",
      origin: "",
      destination: "",
      value: "",
      eta: "",
      description: "",
    })
    setIsNewShipmentOpen(false)
  }

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newDocument: Document = {
        name: file.name,
        type: "Uploaded",
        required: false,
        status: "Complete",
        file: file,
      }
      setDocuments([...documents, newDocument])
      setIsDocumentUploadOpen(false)
    }
  }

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || shipment.type.toLowerCase() === filterType.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const handleViewShipment = (shipmentId: string) => {
    setSelectedShipment(shipmentId)
    const shipment = shipments.find((s) => s.id === shipmentId)
    if (shipment) {
      alert(`Viewing shipment ${shipmentId}\nStatus: ${shipment.status}\nValue: ${shipment.value}`)
    }
  }

  const stats = [
    { title: "Active Shipments", value: shipments.length.toString(), change: "+3", icon: <Ship className="h-4 w-4" /> },
    {
      title: "Pending Customs",
      value: shipments.filter((s) => s.customsStatus === "Pending").length.toString(),
      change: "-2",
      icon: <FileText className="h-4 w-4" />,
    },
    { title: "This Month Value", value: "$156K", change: "+12%", icon: <Globe className="h-4 w-4" /> },
    { title: "Avg Transit Time", value: "12 days", change: "-1 day", icon: <Clock className="h-4 w-4" /> },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "cleared":
      case "complete":
        return "bg-green-100 text-green-800"
      case "in transit":
      case "customs cleared":
        return "bg-blue-100 text-blue-800"
      case "pending":
      case "documentation":
        return "bg-yellow-100 text-yellow-800"
      case "delayed":
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "sea":
        return <Ship className="h-4 w-4" />
      case "air":
        return <Plane className="h-4 w-4" />
      case "road":
        return <Truck className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Import/Export Operations</h1>
          <p className="text-muted-foreground">Manage international trade operations and logistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isNewShipmentOpen} onOpenChange={setIsNewShipmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Shipment</DialogTitle>
                <DialogDescription>Add a new import or export shipment to track</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Shipment Type</Label>
                  <Select
                    value={newShipmentData.type}
                    onValueChange={(value) => setNewShipmentData({ ...newShipmentData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Import">Import</SelectItem>
                      <SelectItem value="Export">Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Transport Mode</Label>
                  <Select
                    value={newShipmentData.mode}
                    onValueChange={(value) => setNewShipmentData({ ...newShipmentData, mode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sea">Sea Freight</SelectItem>
                      <SelectItem value="Air">Air Freight</SelectItem>
                      <SelectItem value="Road">Road Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    placeholder="Origin location"
                    value={newShipmentData.origin}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, origin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    placeholder="Destination location"
                    value={newShipmentData.destination}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, destination: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Shipment Value</Label>
                  <Input
                    placeholder="$0.00"
                    value={newShipmentData.value}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eta">Expected Arrival</Label>
                  <Input
                    type="date"
                    value={newShipmentData.eta}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, eta: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    placeholder="Shipment description and notes"
                    value={newShipmentData.description}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewShipmentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateShipment}>Create Shipment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md bg-white card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="shipments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-6">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Active Shipments</CardTitle>
                  <CardDescription>Track all import and export shipments</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search shipments..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="import">Import</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Customs</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell>
                        <Badge variant={shipment.type === "Import" ? "default" : "secondary"}>{shipment.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {shipment.origin} → {shipment.destination}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getModeIcon(shipment.mode)}
                          <span>{shipment.mode}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{shipment.eta}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{shipment.value}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shipment.customsStatus)}>{shipment.customsStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewShipment(shipment.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
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
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Trade Documents</CardTitle>
                  <CardDescription>Manage shipping and customs documentation</CardDescription>
                </div>
                <Dialog open={isDocumentUploadOpen} onOpenChange={setIsDocumentUploadOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Document</DialogTitle>
                      <DialogDescription>Select a document to upload</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input type="file" onChange={handleDocumentUpload} accept=".pdf,.doc,.docx,.jpg,.png" />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <Card key={index} className="border border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <CardTitle className="text-sm">{doc.name}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{doc.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Required:</span>
                          <span>{doc.required ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => alert(`Viewing document: ${doc.name}`)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => alert(`Downloading document: ${doc.name}`)}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle>Customs Compliance</CardTitle>
                <CardDescription>Track customs clearance and regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Export License</h4>
                        <p className="text-sm text-muted-foreground">Valid until Dec 2024</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">Import Permit</h4>
                        <p className="text-sm text-muted-foreground">Expires in 30 days</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Expiring</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Customs Bond</h4>
                        <p className="text-sm text-muted-foreground">Coverage: $500,000</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle>Regulatory Updates</CardTitle>
                <CardDescription>Latest trade regulations and compliance requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium">New HS Code Classifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Updated classifications for electronics effective Jan 2024
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Duty Rate Changes</h4>
                    <p className="text-sm text-muted-foreground">Import duties revised for textile products</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">Free Trade Agreement</h4>
                    <p className="text-sm text-muted-foreground">New preferential rates with UAE</p>
                    <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
