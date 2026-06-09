"use client"

import { Server, Activity, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectionStatus } from "@/components/connection-status"
import { useConnectionStatus } from "@/lib/api"
import { API_BASE_URL, USE_MOCK_DATA } from "@/lib/types"

export function StatusView() {
  const { connected, isChecking } = useConnectionStatus()

  const StateIcon = isChecking ? Loader2 : connected ? CheckCircle2 : XCircle
  const stateColor = isChecking ? "text-warning" : connected ? "text-success" : "text-destructive"
  const stateText = isChecking ? "Checking connection..." : connected ? "API is reachable" : "API unreachable"

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-4" /> Connection Test
          </CardTitle>
          <CardDescription>
            Pings <code className="font-mono text-xs">GET /api/status/ping</code> and expects a{" "}
            <code className="font-mono text-xs">pong</code> response.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <StateIcon className={`size-6 ${stateColor} ${isChecking ? "animate-spin" : ""}`} aria-hidden="true" />
            <span className="text-lg font-medium">{stateText}</span>
          </div>
          <ConnectionStatus />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="size-4" /> Endpoint
          </CardTitle>
          <CardDescription>Current API configuration</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Base URL</span>
            <code className="truncate font-mono text-xs">{API_BASE_URL || "(not set)"}</code>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Mode</span>
            <span className="font-medium">{USE_MOCK_DATA ? "Mock data" : "Live API"}</span>
          </div>
          {USE_MOCK_DATA && (
            <p className="mt-1 rounded-md border border-border bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground">
              Set <code className="font-mono">NEXT_PUBLIC_API_URL</code> (e.g.{" "}
              <code className="font-mono">http://localhost:5193</code>) to connect to your local CoreInventory API.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
