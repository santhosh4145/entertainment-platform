import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, MapPin, Calendar, Ticket, ArrowLeft, CheckCircle } from "lucide-react"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import API_URL from '../lib/api'

interface Event {
  id: number
  title: string
  date: string
  location: string
  price: number
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, isLoggedIn } = useAuthStore()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    axios.get(`${API_URL}/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setError("Event not found"))
      .finally(() => setLoading(false))
  }, [id])

  async function handlePurchase() {
    if (!isLoggedIn()) {
      navigate("/login")
      return
    }
    setPurchasing(true)
    setError("")
    try {
      await axios.post(
        `http://localhost:8000/tickets/?token=${token}`,
        { event_id: Number(id) }
      )
      setPurchased(true)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not purchase ticket")
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <span className="font-display text-2xl tracking-wider">HOTBOX</span>
            <span className="font-display text-2xl tracking-wider text-red-500">UNDERGROUND</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {loading && (
          <div className="flex items-center justify-center h-48 gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {error && !event && (
          <div className="text-center py-24">
            <p className="text-white/40 text-lg mb-4">{error}</p>
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-500 rounded-full px-8">Go Home</Button>
            </Link>
          </div>
        )}

        {event && (
          <>
            {/* Hero */}
            <div className="relative rounded-3xl overflow-hidden border border-white/5 p-10 mb-8"
              style={{ background: "linear-gradient(135deg, #1a0505, #0f0f0f)" }}>
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(220,38,38,0.8) 1px, transparent 1px)`,
                  backgroundSize: "30px 30px"
                }}
              />
              <div className="relative z-10">
                <Badge className="bg-red-600/20 text-red-400 border-red-500/30 text-xs tracking-widest uppercase mb-6">
                  Live Event
                </Badge>
                <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-6">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-6">
                  <span className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4 text-red-400" />
                    {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 text-red-400" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchase card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              {purchased ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h2 className="font-display text-4xl tracking-wide mb-2">TICKET CONFIRMED!</h2>
                  <p className="text-white/50 text-sm mb-6">
                    Your ticket for <span className="text-white">{event.title}</span> has been purchased.
                  </p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 max-w-sm mx-auto">
                    <p className="text-green-400 text-sm">📍 {event.location}</p>
                    <p className="text-green-400 text-sm mt-1">📅 {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-green-400 text-sm mt-1">💰 ${event.price} paid</p>
                  </div>
                  <Link to="/">
                    <Button className="bg-red-600 hover:bg-red-500 rounded-full px-8">
                      Back to Events
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Ticket Price</p>
                      <div className="font-display text-5xl text-white">${event.price}</div>
                      <p className="text-white/30 text-xs mt-1">per person</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Status</p>
                      <Badge className="bg-green-500/15 text-green-400 border-green-500/20">Available</Badge>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 mb-6">
                      {error}
                    </div>
                  )}

                  {!isLoggedIn() && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-center">
                      <p className="text-white/50 text-sm mb-3">You need to be signed in to purchase tickets</p>
                      <Link to="/login">
                        <Button variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/5 rounded-full px-6 text-sm">
                          Sign In to Continue
                        </Button>
                      </Link>
                    </div>
                  )}

                  <Button
                    onClick={handlePurchase}
                    disabled={purchasing || !isLoggedIn()}
                    className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl h-12 font-sans gap-2 text-sm"
                  >
                    <Ticket className="w-4 h-4" />
                    {purchasing ? "Processing..." : `Buy Ticket — $${event.price}`}
                  </Button>

                  <p className="text-white/20 text-xs text-center mt-4">
                    Secure purchase · Instant confirmation · No hidden fees
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}