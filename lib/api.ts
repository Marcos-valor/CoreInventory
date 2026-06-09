"use client"

import useSWR from "swr"
import { API_BASE_URL, USE_MOCK_DATA, MOCK_PRODUCTS, type Product } from "@/lib/types"

// ---------------------------------------------------------------------------
// Connection status: GET /api/status/ping  ->  expects "pong"
// ---------------------------------------------------------------------------
async function pingFetcher(): Promise<boolean> {
  if (USE_MOCK_DATA) {
    // Simulate a short network round-trip for the preview.
    await new Promise((r) => setTimeout(r, 700))
    return true
  }

  const res = await fetch(`${API_BASE_URL}/api/status/ping`, {
    headers: { Accept: "text/plain, application/json" },
  })
  if (!res.ok) throw new Error(`Ping failed with status ${res.status}`)
  const text = (await res.text()).trim().replace(/^"|"$/g, "")
  if (text.toLowerCase() !== "pong") throw new Error(`Unexpected ping response: ${text}`)
  return true
}

export function useConnectionStatus() {
  const { data, error, isLoading, isValidating, mutate } = useSWR("ping", pingFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  return {
    connected: Boolean(data) && !error,
    isChecking: isLoading || isValidating,
    error,
    retest: () => mutate(),
  }
}

// ---------------------------------------------------------------------------
// Products: GET /api/products
// ---------------------------------------------------------------------------
async function productsFetcher(): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 900))
    return MOCK_PRODUCTS
  }

  const res = await fetch(`${API_BASE_URL}/api/products`, {
    headers: { Accept: "application/json" },
  })
  if (!res.ok) throw new Error(`Failed to load products (status ${res.status})`)
  return (await res.json()) as Product[]
}

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>("products", productsFetcher, {
    revalidateOnFocus: false,
  })

  return {
    products: data ?? [],
    isLoading,
    error,
    refresh: () => mutate(),
  }
}
