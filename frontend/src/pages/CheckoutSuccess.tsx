// src/pages/CheckoutSuccess.tsx
import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="font-display text-5xl mb-4">Payment Successful!</h1>
        <p className="text-white/70 mb-8">
          Thank you for your purchase! Your order is being processed.
          You'll receive a confirmation email shortly.
        </p>
        <div className="space-y-4">
          <Link
            to="/my-tickets"
            className="block bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-8 rounded-full transition"
          >
            View My Orders
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