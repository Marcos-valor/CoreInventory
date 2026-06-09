"use client"

import { Boxes } from "lucide-react"
import { ConnectionStatus } from "@/components/connection-status"
import type { View } from "@/components/sidebar"

const TITLES: Record<View, string> = {
  dashboard: "Dashboard",
  products: "Products",
  status: "System Status",
}

export function Navbar({ view }: { view: View }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground md:hidden">
          <Boxes className="size-4" aria-hidden="true" />
        </div>
        <h1 className="text-base font-semibold tracking-tight md:text-lg">{TITLES[view]}</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:block">
          <ConnectionStatus />
        </div>
        <div className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3">
          <div className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            MV
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-xs font-medium">Marcos Valor</p>
            <p className="text-[11px] text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
