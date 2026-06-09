"use client"

import { Package, AlertTriangle, DollarSign, Boxes } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "@/lib/api"

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

export function DashboardView() {
  const { products, isLoading } = useProducts()

  const totalItems = products.length
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0)
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const lowStock = products.filter((p) => p.stock < 10).length

  const stats = [
    { label: "Total Products", value: String(totalItems), icon: Package },
    { label: "Units in Stock", value: totalUnits.toLocaleString(), icon: Boxes },
    { label: "Inventory Value", value: formatPrice(inventoryValue), icon: DollarSign },
    { label: "Low / Out of Stock", value: String(lowStock), icon: AlertTriangle },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
