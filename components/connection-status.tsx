"use client"

import { Loader2, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useConnectionStatus } from "@/lib/api"
import { cn } from "@/lib/utils"

export function ConnectionStatus({ compact = false }: { compact?: boolean }) {
  const { connected, isChecking, retest } = useConnectionStatus()

  let label = "Disconnected"
  let variant: "success" | "destructive" | "warning" = "destructive"
  let Icon = WifiOff

  if (isChecking) {
    label = "Checking..."
    variant = "warning"
    Icon = Loader2
  } else if (connected) {
    label = "Connected"
    variant = "success"
    Icon = Wifi
  }

  return (
    <div className={cn("flex items-center gap-2", compact && "flex-col items-stretch gap-2")}>
      <Badge variant={variant} className="h-7 px-3">
        <Icon className={cn("size-3.5", isChecking && "animate-spin")} aria-hidden="true" />
        {label}
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={() => retest()}
        disabled={isChecking}
        className={cn(compact && "w-full")}
      >
        Test Connection
      </Button>
    </div>
  )
}
