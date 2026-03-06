// src/pages/CheckoutCancel.tsx
import { Link } from "react-router-dom"
import { XCircle } from "lucide-react"

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
        <h1 className="font-display text-5xl mb-4">Checkout Cancelled</h1>
        <p className="text-white/70 mb-8">
          No worries — your cart is still saved.
          Come back anytime to complete your purchase.
        </p>
        <div className="space-y-4">
          <Link
            to="/merch"
            className="block bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-8 rounded-full transition"
          >
            Back to Shop
          </Link>
          <Link
            to="/"
            className="block text-white/60 hover:text-white underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}