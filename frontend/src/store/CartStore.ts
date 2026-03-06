import { create } from 'zustand'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url: string | null
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const existing = state.items.find(i => i.id === newItem.id)
    if (existing) {
      return {
        items: state.items.map(i =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
    }
    return {
      items: [...state.items, { ...newItem, quantity: 1 }]
    }
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
}))

// Persist cart across refreshes
const saved = localStorage.getItem('hotbox-cart')
if (saved) {
  try {
    const parsed = JSON.parse(saved)
    useCartStore.setState({ items: parsed.items || [] })
  } catch {}
}

useCartStore.subscribe((state) => {
  localStorage.setItem('hotbox-cart', JSON.stringify(state))
})