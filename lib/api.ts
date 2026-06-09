"use client"

import useSWR from "swr"
import { API_BASE_URL, ENABLE_MOCK_FALLBACK, MOCK_PRODUCTS, type Product } from "@/lib/types"

const REQUEST_TIMEOUT_MS = 4000

async function timedFetch(input: string, init?: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

// ---------------------------------------------------------------------------
// Connection status: GET /api/status/ping  ->  expects "pong"
// ---------------------------------------------------------------------------
export type ConnectionState = "live" | "mock"

async function pingFetcher(): Promise<boolean> {
  const res = await timedFetch(`${API_BASE_URL}/api/status/ping`, {
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
// Products: GET /api/products  (falls back to sample data if the API is down)
// ---------------------------------------------------------------------------
interface ProductsResult {
  products: Product[]
  source: ConnectionState
}

async function productsFetcher(): Promise<ProductsResult> {
  try {
    const res = await timedFetch(`${API_BASE_URL}/api/products`, {
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`Failed to load products (status ${res.status})`)
    const products = (await res.json()) as Product[]
    return { products, source: "live" }
  } catch (err) {
    if (ENABLE_MOCK_FALLBACK) {
      return { products: MOCK_PRODUCTS, source: "mock" }
    }
    throw err
  }
}

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<ProductsResult>("products", productsFetcher, {
    revalidateOnFocus: false,
  })

  return {
    products: data?.products ?? [],
    source: data?.source ?? "mock",
    isLoading,
    error,
    refresh: () => mutate(),
  }
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
export type ProductInput = Omit<Product, "id">

export async function createProduct(payload: ProductInput): Promise<Product> {
  const res = await timedFetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Failed to create product (status ${res.status})`)
  return (await res.json()) as Product
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await timedFetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "DELETE",
  })
  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to delete product (status ${res.status})`)
  }
}
