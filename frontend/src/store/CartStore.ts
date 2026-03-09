// src/store/CartStore.ts
import { create } from 'zustand'

// ───────────────────────────────────────────────
// Cart Item Type – includes everything you need
// ───────────────────────────────────────────────
export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url: string | null
  category?: string           // optional – used for icons in cart drawer
}

// ───────────────────────────────────────────────
// Store Interface
// ───────────────────────────────────────────────
interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void           // accepts full item including quantity
  removeItem: (id: number) => void
  totalItems: () => number
  totalPrice: () => number
  clearCart: () => void
}

// ───────────────────────────────────────────────
// Zustand Store Creation
// ───────────────────────────────────────────────
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (newItem) =>
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.id === newItem.id)

      if (existingIndex !== -1) {
        // Item already exists → increment quantity
        const updatedItems = [...state.items]
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + (newItem.quantity || 1),
        }
        return { items: updatedItems }
      }

      // New item → add with quantity (default to 1 if missing)
      return {
        items: [
          ...state.items,
          {
            ...newItem,
            quantity: newItem.quantity || 1,
          },
        ],
      }
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  clearCart: () => set({ items: [] }),
}))

// ───────────────────────────────────────────────
// LocalStorage Persistence
// ───────────────────────────────────────────────
const CART_STORAGE_KEY = 'hotbox-cart'

// Load from localStorage on init
const savedCart = localStorage.getItem(CART_STORAGE_KEY)
if (savedCart) {
  try {
    const parsed = JSON.parse(savedCart)
    if (Array.isArray(parsed?.items)) {
      // Validate basic structure before setting
      const validItems = parsed.items.filter(
        (item: any) =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'number' &&
          typeof item.name === 'string' &&
          typeof item.price === 'number' &&
          typeof item.quantity === 'number'
      )
      if (validItems.length > 0 || parsed.items.length === 0) {
        useCartStore.setState({ items: validItems })
      }
    }
  } catch (err) {
    console.warn('Failed to parse saved cart from localStorage:', err)
    localStorage.removeItem(CART_STORAGE_KEY)
  }
}

// Save to localStorage on every change
useCartStore.subscribe((state) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.warn('Failed to save cart to localStorage:', err)
  }
})