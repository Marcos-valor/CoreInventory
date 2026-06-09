"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, Pencil, Plus, Search, Trash2, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useProducts, deleteProduct } from "@/lib/api"
import type { Product } from "@/lib/types"
import { AddProductDialog } from "@/components/add-product-dialog"

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="destructive">Out of stock</Badge>
  if (stock < 10) return <Badge variant="warning">{stock} low</Badge>
  return <Badge variant="success">{stock} in stock</Badge>
}

export function ProductsView() {
  const { products, source, isLoading, error, refresh } = useProducts()
  const [query, setQuery] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())),
    [products, query],
  )

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeletingId(product.id)
    try {
      await deleteProduct(product.id)
      await refresh()
    } catch {
      window.alert("Could not delete the product. Make sure the CoreInventory API is running.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search products by name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => refresh()} aria-label="Refresh products">
            <RefreshCw className="size-4" />
          </Button>
          <AddProductDialog
            onCreated={() => refresh()}
            trigger={
              <Button variant="shine">
                <Plus className="size-4" />
                Add Product
              </Button>
            }
          />
        </div>
      </div>

      {source === "mock" && !isLoading && (
        <Alert>
          <Info />
          <AlertTitle>Showing sample data</AlertTitle>
          <AlertDescription>
            Couldn&apos;t reach the CoreInventory API at{" "}
            <code className="font-mono text-xs">{"http://localhost:5193"}</code>. Start the .NET API
            (<code className="font-mono text-xs">dotnet run</code>) to manage live data.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Could not load products</AlertTitle>
          <AlertDescription>
            {error.message}. Check that your CoreInventory API is running and that{" "}
            <code className="font-mono text-xs">NEXT_PUBLIC_API_URL</code> points to it.
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <ProductsSkeleton />
            ) : filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                  {query ? `No products match "${query}".` : "No products yet. Add your first product to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onDelete={() => handleDelete(product)}
                  deleting={deletingId === product.id}
                />
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {!isLoading && !error && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      )}
    </div>
  )
}

function ProductRow({
  product,
  onDelete,
  deleting,
}: {
  product: Product
  onDelete: () => void
  deleting: boolean
}) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs text-muted-foreground">#{product.id}</TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="hidden max-w-xs truncate text-muted-foreground lg:table-cell">
        {product.description}
      </TableCell>
      <TableCell className="font-mono text-sm">{formatPrice(product.price)}</TableCell>
      <TableCell>
        <StockBadge stock={product.stock} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="outline">{product.category}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="size-8" aria-label={`Edit ${product.name}`}>
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label={`Delete ${product.name}`}
            onClick={onDelete}
            disabled={deleting}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

function ProductsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <div className="flex justify-end gap-1">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
