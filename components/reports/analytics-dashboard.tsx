"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  FileText,
  Download,
  Calendar,
  Filter,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 45000, target: 50000, quotations: 23 },
  { month: "Feb", revenue: 52000, target: 50000, quotations: 28 },
  { month: "Mar", revenue: 48000, target: 55000, quotations: 25 },
  { month: "Apr", revenue: 61000, target: 55000, quotations: 32 },
  { month: "May", revenue: 55000, target: 60000, quotations: 29 },
  { month: "Jun", revenue: 67000, target: 60000, quotations: 35 },
]

const salesData = [
  { name: "Electronics", value: 35, amount: 125000 },
  { name: "Machinery", value: 25, amount: 89000 },
  { name: "Software", value: 20, amount: 67000 },
  { name: "Services", value: 15, amount: 45000 },
  { name: "Others", value: 5, amount: 18000 },
]

const topCustomers = [
  { name: "TechCorp Industries", revenue: 45000, orders: 12, growth: "+15%" },
  { name: "Global Manufacturing", revenue: 38000, orders: 8, growth: "+8%" },
  { name: "Digital Solutions Ltd", revenue: 32000, orders: 15, growth: "+22%" },
  { name: "Innovation Systems", revenue: 28000, orders: 6, growth: "-3%" },
  { name: "Future Enterprises", revenue: 25000, orders: 9, growth: "+12%" },
]

const inventoryData = [
  { category: "Raw Materials", current: 85, optimal: 100, value: 125000 },
  { category: "Finished Goods", current: 92, optimal: 80, value: 89000 },
  { category: "Work in Progress", current: 67, optimal: 75, value: 45000 },
  { category: "Spare Parts", current: 45, optimal: 60, value: 23000 },
]

const COLORS = ["#7c3aed", "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444"]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-white card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="h-8 w-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$328,000</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium">+8.2%</span>
              <span className="text-muted-foreground">new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quotation Success Rate</CardTitle>
            <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span className="text-red-600 font-medium">-2.1%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
            <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$282,000</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium">+5.8%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle>Revenue vs Target</CardTitle>
                <CardDescription>Monthly revenue performance against targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                    <Area type="monotone" dataKey="target" stackId="1" stroke="#e5e7eb" fill="#f3f4f6" />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="2"
                      stroke="#7c3aed"
                      fill="#7c3aed"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle>Quotations Generated</CardTitle>
                <CardDescription>Monthly quotation volume trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quotations" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${category.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{category.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Highest revenue generating customers this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={customer.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${customer.revenue.toLocaleString()}</div>
                      <Badge variant={customer.growth.startsWith("+") ? "default" : "destructive"} className="text-xs">
                        {customer.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader>
              <CardTitle>Inventory Analysis</CardTitle>
              <CardDescription>Current stock levels vs optimal levels by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {inventoryData.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <div className="text-right">
                        <span className="font-semibold">${item.value.toLocaleString()}</span>
                        <div className="text-sm text-muted-foreground">{item.current}% of optimal</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.current >= item.optimal
                            ? "bg-green-500"
                            : item.current >= item.optimal * 0.8
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(item.current, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current: {item.current}%</span>
                      <span>Optimal: {item.optimal}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
