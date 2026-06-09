"use client"

import { LayoutDashboard, Package, Activity, Boxes } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConnectionStatus } from "@/components/connection-status"

export type View = "dashboard" | "products" | "status"

const NAV_ITEMS: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "status", label: "System Status", icon: Activity },
]

export function Sidebar({
  active,
  onNavigate,
}: {
  active: View
  onNavigate: (view: View) => void
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Boxes className="size-5" aria-hidden="true" />
        </div>
        <span className="text-base font-semibold tracking-tight">CoreInventory</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">API Status</p>
        <ConnectionStatus compact />
      </div>
    </aside>
  )
}
