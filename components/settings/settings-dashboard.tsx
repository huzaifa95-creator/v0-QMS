"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, Bell, Database, Save, Users, Settings, Trash2, Edit, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
  type: "email" | "push" | "sms"
}

export function SettingsDashboard() {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Admin",
      email: "admin@qms.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 10:30 AM",
    },
    {
      id: "2",
      name: "Sarah Sales",
      email: "sarah@qms.com",
      role: "sales",
      status: "active",
      lastLogin: "2024-01-15 09:15 AM",
    },
    {
      id: "3",
      name: "Mike Procurement",
      email: "mike@qms.com",
      role: "procurement",
      status: "inactive",
      lastLogin: "2024-01-14 04:20 PM",
    },
  ])

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Quotation Requests",
      description: "Get notified when new quotation requests are received",
      enabled: true,
      type: "email",
    },
    {
      id: "2",
      title: "Order Status Updates",
      description: "Receive updates when order status changes",
      enabled: true,
      type: "push",
    },
    {
      id: "3",
      title: "Low Stock Alerts",
      description: "Alert when inventory items are running low",
      enabled: false,
      type: "email",
    },
    {
      id: "4",
      title: "Payment Reminders",
      description: "Reminders for pending payments and invoices",
      enabled: true,
      type: "sms",
    },
  ])

  const [companySettings, setCompanySettings] = useState({
    companyName: "QMS Corporation",
    email: "info@qms.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street, City, State 12345",
    taxId: "TAX123456789",
    currency: "USD",
    timezone: "UTC-5",
    language: "English",
  })

  const handleUserStatusToggle = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const handleNotificationToggle = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, enabled: !notification.enabled } : notification,
      ),
    )
  }

  const handleSaveSettings = () => {
    console.log("Settings saved:", companySettings)
    // In a real app, this would make an API call
  }

  return (
    <div className="space-y-8">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-3">Settings</h1>
        <p className="text-xl text-muted-foreground">Manage your system preferences, users, and company information.</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-14 bg-muted/50">
          <TabsTrigger value="company" className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Company Information
              </CardTitle>
              <CardDescription className="text-lg">
                Update your company details and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-base">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId" className="text-base">
                    Tax ID
                  </Label>
                  <Input
                    id="taxId"
                    value={companySettings.taxId}
                    onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-base">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  className="min-h-20 text-base"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-base">Currency</Label>
                  <Select
                    value={companySettings.currency}
                    onValueChange={(value) => setCompanySettings({ ...companySettings, currency: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Timezone</Label>
                  <Select
                    value={companySettings.timezone}
                    onValueChange={(value) => setCompanySettings({ ...companySettings, timezone: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                      <SelectItem value="UTC-6">UTC-6 (Central)</SelectItem>
                      <SelectItem value="UTC-7">UTC-7 (Mountain)</SelectItem>
                      <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
                      <SelectItem value="UTC+5">UTC+5 (Pakistan)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Language</Label>
                  <Select
                    value={companySettings.language}
                    onValueChange={(value) => setCompanySettings({ ...companySettings, language: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSaveSettings} className="h-12 px-8 text-base">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    User Management
                  </CardTitle>
                  <CardDescription className="text-lg">Manage user accounts and permissions</CardDescription>
                </div>
                <Button className="h-12 px-6 text-base">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">Last login: {user.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-sm">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-sm">
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={user.status === "active"}
                          onCheckedChange={() => handleUserStatusToggle(user.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Notification Settings
              </CardTitle>
              <CardDescription className="text-lg">Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-6 border rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{notification.title}</h3>
                      <p className="text-muted-foreground mb-2">{notification.description}</p>
                      <Badge variant="outline" className="text-sm">
                        {notification.type.toUpperCase()}
                      </Badge>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => handleNotificationToggle(notification.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-lg">Manage security preferences and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Session Timeout</h3>
                    <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Login Notifications</h3>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Database className="h-6 w-6" />
                System Settings
              </CardTitle>
              <CardDescription className="text-lg">Configure system-wide preferences and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Database</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Database Size:</span>
                      <span className="font-medium">2.4 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Backup:</span>
                      <span className="font-medium">2024-01-15 02:00 AM</span>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Now
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">System Info</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span className="font-medium">QMS v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="font-medium">15 days, 4 hours</span>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      System Logs
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
