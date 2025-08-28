"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Truck,
  Package,
  Ship,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  TrendingUp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { MasterDataTabs } from "@/components/master-data/master-data-tabs"
import { QuotationManagement } from "@/components/quotations/quotation-management"
import { OrderProcurementTabs } from "@/components/orders/order-procurement-tabs"
import { InventoryManagement } from "@/components/inventory/inventory-management"
import { AnalyticsDashboard } from "@/components/reports/analytics-dashboard"
import { ImportExportDashboard } from "@/components/import-export/import-export-dashboard"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { SettingsDashboard } from "@/components/settings/settings-dashboard"
import { DeliveryInvoicingDashboard } from "@/components/delivery-invoicing/delivery-invoicing-dashboard"
import type { User, DashboardMetrics } from "@/lib/api/types"
import { apiClient } from "@/lib/api"

type UserRole = "admin" | "manager" | "user"

interface DashboardProps {
  user: User
  onLogout: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  roles: UserRole[]
  badge?: string
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: ["admin", "manager", "user"],
  },
  {
    id: "masters",
    label: "Master Data",
    icon: <Users className="h-4 w-4" />,
    roles: ["admin", "manager"],
  },
  {
    id: "quotations",
    label: "Quotations",
    icon: <FileText className="h-4 w-4" />,
    roles: ["admin", "manager", "user"],
    badge: "12",
  },
  {
    id: "orders",
    label: "Orders & Procurement",
    icon: <ShoppingCart className="h-4 w-4" />,
    roles: ["admin", "manager"],
  },
  {
    id: "delivery",
    label: "Delivery & Invoicing",
    icon: <Truck className="h-4 w-4" />,
    roles: ["admin", "manager"],
  },
  {
    id: "inventory",
    label: "Inventory Tracking",
    icon: <Package className="h-4 w-4" />,
    roles: ["admin", "manager"],
  },
  {
    id: "import-export",
    label: "Import/Export",
    icon: <Ship className="h-4 w-4" />,
    roles: ["admin", "manager"],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    roles: ["admin", "manager"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    roles: ["admin"],
  },
]

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "bg-primary text-primary-foreground"
    case "manager":
      return "bg-secondary text-secondary-foreground"
    case "user":
      return "bg-accent text-accent-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true)

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user.role))

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await apiClient.get<DashboardMetrics>("/reports/dashboard")
        if (response.data) {
          setDashboardMetrics(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error)
      } finally {
        setIsLoadingMetrics(false)
      }
    }

    if (activeSection === "dashboard") {
      fetchDashboardMetrics()
    }
  }, [activeSection])

  const stats = dashboardMetrics
    ? [
        {
          title: "Total Revenue",
          value: `$${dashboardMetrics.total_revenue.toLocaleString()}`,
          change: "+15%",
          trend: "up" as const,
        },
        {
          title: "Active Orders",
          value: dashboardMetrics.total_orders.toString(),
          change: "+8%",
          trend: "up" as const,
        },
        {
          title: "Pending Quotations",
          value: dashboardMetrics.pending_quotations.toString(),
          change: "-5%",
          trend: "down" as const,
        },
        {
          title: "Low Stock Alerts",
          value: dashboardMetrics.low_stock_alerts.toString(),
          change: "+2%",
          trend: "up" as const,
        },
      ]
    : [
        { title: "Total Revenue", value: "Loading...", change: "", trend: "up" as const },
        { title: "Active Orders", value: "Loading...", change: "", trend: "up" as const },
        { title: "Pending Quotations", value: "Loading...", change: "", trend: "up" as const },
        { title: "Low Stock Alerts", value: "Loading...", change: "", trend: "up" as const },
      ]

  const moduleGrid = [
    {
      id: "quotations",
      name: "Quotations",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-purple-500",
      count: dashboardMetrics?.pending_quotations?.toString() || "...",
    },
    {
      id: "orders",
      name: "Orders",
      icon: <ShoppingCart className="h-8 w-8" />,
      color: "bg-blue-500",
      count: dashboardMetrics?.total_orders?.toString() || "...",
    },
    { id: "inventory", name: "Inventory", icon: <Package className="h-8 w-8" />, color: "bg-green-500", count: "1.2k" },
    { id: "masters", name: "Customers", icon: <Users className="h-8 w-8" />, color: "bg-orange-500", count: "89" },
    { id: "delivery", name: "Delivery", icon: <Truck className="h-8 w-8" />, color: "bg-cyan-500", count: "28" },
    { id: "reports", name: "Analytics", icon: <BarChart3 className="h-8 w-8" />, color: "bg-pink-500", count: "12" },
    {
      id: "import-export",
      name: "Import/Export",
      icon: <Ship className="h-8 w-8" />,
      color: "bg-indigo-500",
      count: "5",
    },
    { id: "settings", name: "Settings", icon: <Settings className="h-8 w-8" />, color: "bg-gray-500", count: "" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/95 shadow-sm">
        <div className="flex h-20 items-center px-6 gap-4 max-w-none">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-2xl text-foreground">QMS Platform</h1>
              <p className="text-sm text-muted-foreground -mt-1">Quotation Management System</p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search quotations, customers, products..."
                className="pl-14 h-14 text-lg bg-muted/30 border-0 focus:bg-white focus:shadow-md transition-all duration-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <NotificationCenter />

            <div className="flex items-center gap-4 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-base font-semibold">{user.full_name}</p>
                <Badge variant="secondary" className={`${getRoleColor(user.role)} text-sm`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                  {user.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-slate-100 border-r border-border/50 transform transition-transform duration-200 ease-in-out shadow-lg
          md:relative md:translate-x-0 md:z-0 md:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex flex-col h-full pt-20 md:pt-0">
            <nav className="flex-1 px-8 py-10 space-y-2">
              {filteredMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-5 h-14 text-left font-medium text-base transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-slate-200 hover:translate-x-1 text-slate-700"
                  }`}
                  onClick={() => {
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <span className="flex-shrink-0 [&>svg]:h-5 [&>svg]:w-5">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto bg-accent text-accent-foreground">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>

            <div className="p-8 border-t border-border/50">
              <Button
                variant="ghost"
                className="w-full justify-start gap-5 h-14 text-base text-destructive hover:text-destructive hover:bg-red-50"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-10 bg-muted/20 min-h-screen">
          <div className="max-w-8xl mx-auto">
            {activeSection === "dashboard" && (
              <div className="space-y-10">
                <div className="mb-12">
                  <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Welcome back, {user.full_name}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Manage your quotations and business operations from one unified platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {stats.map((stat, index) => (
                    <Card key={index} className="card-hover border-0 shadow-lg bg-white">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-base font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            index === 0
                              ? "bg-purple-100 text-purple-600"
                              : index === 1
                                ? "bg-blue-100 text-blue-600"
                                : index === 2
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-green-100 text-green-600"
                          }`}
                        >
                          {index === 0 ? (
                            <TrendingUp className="h-6 w-6" />
                          ) : index === 1 ? (
                            <ShoppingCart className="h-6 w-6" />
                          ) : index === 2 ? (
                            <FileText className="h-6 w-6" />
                          ) : (
                            <Package className="h-6 w-6" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold mb-2">{stat.value}</div>
                        {stat.change && (
                          <p
                            className={`text-base font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                          >
                            {stat.change} from last month
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-8">
                    <CardTitle className="text-3xl">Business Applications</CardTitle>
                    <CardDescription className="text-lg">
                      Access all your business tools from one central dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                      {moduleGrid
                        .filter((module) => filteredMenuItems.some((item) => item.id === module.id))
                        .map((module) => (
                          <div
                            key={module.id}
                            className="group cursor-pointer p-6 rounded-2xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                            onClick={() => setActiveSection(module.id)}
                          >
                            <div
                              className={`${module.color} rounded-2xl p-5 mb-4 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-200`}
                            >
                              <div className="[&>svg]:h-10 [&>svg]:w-10">{module.icon}</div>
                            </div>
                            <h3 className="font-semibold text-base mb-2">{module.name}</h3>
                            {module.count && <p className="text-sm text-muted-foreground">{module.count} items</p>}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl">Quick Actions</CardTitle>
                    <CardDescription className="text-lg">Get started with the most common tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Button
                        className="h-32 flex-col gap-4 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                        onClick={() => setActiveSection("quotations")}
                      >
                        <FileText className="h-8 w-8" />
                        <span className="font-semibold">Create Quotation</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-32 flex-col gap-4 border-2 hover:bg-muted/50 transition-all duration-200 hover:scale-105 bg-transparent text-lg"
                        onClick={() => setActiveSection("masters")}
                      >
                        <Users className="h-8 w-8 text-primary" />
                        <span className="font-semibold">Add Customer</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-32 flex-col gap-4 border-2 hover:bg-muted/50 transition-all duration-200 hover:scale-105 bg-transparent text-lg"
                        onClick={() => setActiveSection("inventory")}
                      >
                        <Package className="h-8 w-8 text-primary" />
                        <span className="font-semibold">Update Inventory</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "masters" && <MasterDataTabs />}

            {activeSection === "quotations" && <QuotationManagement />}

            {activeSection === "orders" && <OrderProcurementTabs />}

            {activeSection === "delivery" && <DeliveryInvoicingDashboard />}

            {activeSection === "inventory" && <InventoryManagement />}

            {activeSection === "reports" && <AnalyticsDashboard />}

            {activeSection === "import-export" && <ImportExportDashboard />}

            {activeSection === "settings" && <SettingsDashboard />}

            {activeSection !== "dashboard" &&
              activeSection !== "masters" &&
              activeSection !== "quotations" &&
              activeSection !== "orders" &&
              activeSection !== "delivery" &&
              activeSection !== "inventory" &&
              activeSection !== "reports" &&
              activeSection !== "import-export" &&
              activeSection !== "settings" && (
                <div className="space-y-8">
                  <div className="mb-10">
                    <h1 className="text-5xl font-bold mb-3">
                      {menuItems.find((item) => item.id === activeSection)?.label || "Dashboard"}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Welcome back, {user.full_name}. Here's what's happening with your business today.
                    </p>
                  </div>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {menuItems.find((item) => item.id === activeSection)?.label}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        This section is under development. More features coming soon.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center h-80 text-muted-foreground">
                        <div className="text-center">
                          <div className="h-20 w-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                            <div className="[&>svg]:h-10 [&>svg]:w-10">
                              {menuItems.find((item) => item.id === activeSection)?.icon}
                            </div>
                          </div>
                          <p className="text-lg">Feature coming soon...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
