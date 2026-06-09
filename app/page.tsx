"use client"

import { useState } from "react"
import { LayoutDashboard, Package, Activity } from "lucide-react"
import { Sidebar, type View } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { DashboardView } from "@/components/dashboard-view"
import { ProductsView } from "@/components/products-view"
import { StatusView } from "@/components/status-view"
import { cn } from "@/lib/utils"

const MOBILE_NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "status", label: "Status", icon: Activity },
]

export default function Page() {
  const [view, setView] = useState<View>("products")

  return (
    <div className="flex min-h-screen">
      <Sidebar active={view} onNavigate={setView} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar view={view} />

        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
          {view === "dashboard" && (
            <div className="flex flex-col gap-6">
              <DashboardView />
              <ProductsView />
            </div>
          )}
          {view === "products" && <ProductsView />}
          {view === "status" && <StatusView />}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 backdrop-blur md:hidden"
        aria-label="Mobile navigation"
      >
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon
          const isActive = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
