export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
}

// Base URL for the CoreInventory .NET API.
// Defaults to the local "http" launch profile (http://localhost:5193).
// Override with NEXT_PUBLIC_API_URL if your API runs elsewhere.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5193"

// When the API can't be reached (e.g. in the hosted preview, where localhost
// isn't available), the data layer falls back to this sample data so the
// dashboard always renders. Real data is used automatically once the API is up.
export const ENABLE_MOCK_FALLBACK = true

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    description: "Hot-swappable 75% keyboard with PBT keycaps",
    price: 129.99,
    stock: 42,
    category: "Peripherals",
  },
  {
    id: 2,
    name: "USB-C Hub",
    description: "7-in-1 aluminium hub with 4K HDMI and PD charging",
    price: 49.5,
    stock: 0,
    category: "Accessories",
  },
  {
    id: 3,
    name: "27\" 4K Monitor",
    description: "IPS panel, 99% sRGB, USB-C 90W power delivery",
    price: 399.0,
    stock: 17,
    category: "Displays",
  },
  {
    id: 4,
    name: "Noise-Cancelling Headphones",
    description: "Over-ear ANC headphones with 30h battery life",
    price: 219.99,
    stock: 8,
    category: "Audio",
  },
  {
    id: 5,
    name: "Ergonomic Mouse",
    description: "Vertical wireless mouse with programmable buttons",
    price: 64.0,
    stock: 120,
    category: "Peripherals",
  },
  {
    id: 6,
    name: "Laptop Stand",
    description: "Adjustable aluminium stand with cable management",
    price: 34.95,
    stock: 3,
    category: "Accessories",
  },
  {
    id: 7,
    name: "1080p Webcam",
    description: "Auto-focus webcam with dual noise-reducing mics",
    price: 79.0,
    stock: 56,
    category: "Peripherals",
  },
]
