"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, FileText, ShoppingCart, Package, CheckCircle, Clock, X } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  category: "quotation" | "order" | "inventory" | "system"
  timestamp: string
  read: boolean
  actionUrl?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Quotation Request",
      message: "Customer ABC Corp requested a quotation for 500 units of Product X",
      type: "info",
      category: "quotation",
      timestamp: "2 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Low Stock Alert",
      message: "Product Y inventory is running low (5 units remaining)",
      type: "warning",
      category: "inventory",
      timestamp: "15 minutes ago",
      read: false,
    },
    {
      id: "3",
      title: "Order Completed",
      message: "Order #ORD-2024-001 has been successfully delivered",
      type: "success",
      category: "order",
      timestamp: "1 hour ago",
      read: true,
    },
    {
      id: "4",
      title: "Payment Overdue",
      message: "Invoice #INV-2024-045 payment is 5 days overdue",
      type: "error",
      category: "order",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "5",
      title: "System Backup Complete",
      message: "Daily system backup completed successfully",
      type: "success",
      category: "system",
      timestamp: "3 hours ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case "quotation":
        return <FileText className="h-4 w-4" />
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "inventory":
        return <Package className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-orange-600 bg-orange-100"
      case "error":
        return "text-red-600 bg-red-100"
      case "success":
        return "text-green-600 bg-green-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (notificationId: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== notificationId))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 h-12 w-12">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full text-xs flex items-center justify-center text-white font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-sm">
                Mark all as read
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <ScrollArea className="h-96">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mb-2" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors hover:bg-muted/30 ${
                      !notification.read ? "bg-muted/20 border-primary/20" : "bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
