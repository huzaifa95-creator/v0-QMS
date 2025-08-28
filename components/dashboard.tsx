"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Search,
  Menu,
  X,
  Bell,
  DollarSign,
  Database,
  ArrowRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { QuotationManagement } from "@/components/quotations/quotation-management"
import { OrderProcurementTabs } from "@/components/orders/order-procurement-tabs"
import { InventoryManagement } from "@/components/inventory/inventory-management"
import { AnalyticsDashboard } from "@/components/reports/analytics-dashboard"
import { ImportExportDashboard } from "@/components/import-export/import-export-dashboard"
import { SettingsDashboard } from "@/components/settings/settings-dashboard"
import { DeliveryInvoicingDashboard } from "@/components/delivery-invoicing/delivery-invoicing-dashboard"

type UserRole = "admin" | "sales" | "procurement" | "finance" | "guest"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

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
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["admin", "sales", "procurement", "finance", "guest"],
  },
  {
    id: "sales",
    label: "Sales",
    icon: <DollarSign className="h-5 w-5" />,
    roles: ["admin", "sales"],
  },
  {
    id: "purchases",
    label: "Purchases",
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ["admin", "procurement"],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <Package className="h-5 w-5" />,
    roles: ["admin", "procurement"],
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: <Database className="h-5 w-5" />,
    roles: ["admin", "finance"],
  },
  {
    id: "import-export",
    label: "Import/Export",
    icon: <ArrowRight className="h-5 w-5" />,
    roles: ["admin", "sales", "procurement"],
  },
  {
    id: "reports",
    label: "Reports",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["admin", "finance", "sales"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin"],
  },
]

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "bg-primary text-primary-foreground"
    case "sales":
      return "bg-secondary text-secondary-foreground"
    case "procurement":
      return "bg-accent text-accent-foreground"
    case "finance":
      return "bg-chart-4 text-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user.role))

  const moduleGrid = [
    {
      id: "sales",
      name: "Sales",
      icon: <DollarSign className="h-12 w-12" />,
      color: "bg-slate-300",
      iconColor: "text-slate-700",
      description: "12 new inquiries today",
    },
    {
      id: "purchases",
      name: "Purchases",
      icon: <ShoppingCart className="h-12 w-12" />,
      color: "bg-emerald-200",
      iconColor: "text-emerald-800",
      description: "3 pending requests",
    },
    {
      id: "inventory",
      name: "Inventory",
      icon: <Package className="h-12 w-12" />,
      color: "bg-orange-200",
      iconColor: "text-orange-800",
      description: "5 low stock items",
    },
    {
      id: "accounting",
      name: "Accounting",
      icon: <Database className="h-12 w-12" />,
      color: "bg-purple-200",
      iconColor: "text-purple-800",
      description: "8 open bills",
    },
    {
      id: "import-export",
      name: "Import/Export",
      icon: <ArrowRight className="h-12 w-12" />,
      color: "bg-yellow-200",
      iconColor: "text-yellow-800",
      description: "1 pending import",
    },
    {
      id: "reports",
      name: "Reports",
      icon: <BarChart3 className="h-12 w-12" />,
      color: "bg-stone-300",
      iconColor: "text-stone-800",
      description: "3 financial reports",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header style={{ backgroundColor: "oklch(0.25 0.08 285)" }} className="shadow-sm">
        <div className="flex h-16 items-center px-6 gap-4 max-w-none">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </Button>

          <div className="flex items-center gap-4">
            <h1 className="font-bold text-xl text-white">Dashboard</h1>
          </div>

          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-12 h-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20 transition-all duration-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-white/20 text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          style={{ backgroundColor: "oklch(0.25 0.08 285)" }}
          className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0 md:z-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {filteredMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-12 text-left font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8 bg-background min-h-screen">
          <div className="max-w-7xl mx-auto">
            {activeSection === "dashboard" && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-2 text-foreground">Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moduleGrid.map((module) => (
                    <Card
                      key={module.id}
                      className={`${module.color} cursor-pointer hover:shadow-lg transition-all duration-200 border-0 h-48`}
                      onClick={() => setActiveSection(module.id)}
                    >
                      <CardContent className="flex flex-col items-center justify-center h-full p-6">
                        <div className={`${module.iconColor} mb-4`}>{module.icon}</div>
                        <h3 className={`font-bold text-xl mb-2 ${module.iconColor}`}>{module.name}</h3>
                        <p className={`text-sm text-center ${module.iconColor.replace("800", "700")}`}>
                          {module.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "sales" && <QuotationManagement />}
            {activeSection === "purchases" && <OrderProcurementTabs />}
            {activeSection === "inventory" && <InventoryManagement />}
            {activeSection === "accounting" && <DeliveryInvoicingDashboard />}
            {activeSection === "reports" && <AnalyticsDashboard />}
            {activeSection === "import-export" && <ImportExportDashboard />}
            {activeSection === "settings" && <SettingsDashboard />}

            {![
              "dashboard",
              "sales",
              "purchases",
              "inventory",
              "accounting",
              "reports",
              "import-export",
              "settings",
            ].includes(activeSection) && (
              <div className="space-y-8">
                <div className="mb-10">
                  <h1 className="text-4xl font-bold mb-3">
                    {menuItems.find((item) => item.id === activeSection)?.label || "Dashboard"}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Welcome back, {user.name}. Here's what's happening with your business today.
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
