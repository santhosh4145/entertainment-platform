import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Ticket, MapPin, Calendar, ArrowLeft, ShoppingBag } from "lucide-react"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"

interface TicketData {
  id: number
  user_id: number
  event_id: number
  purchased_at: string
  status: string
}

interface Event {
  id: number
  title: string
  date: string
  location: string
  price: number
}

export default function MyTickets() {
  const { token, user, isLoggedIn } = useAuthStore()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [events, setEvents] = useState<Record<number, Event>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login")
      return
    }

    async function fetchData() {
      try {
        const [ticketsRes, eventsRes] = await Promise.all([
          axios.get(`http://localhost:8000/tickets/mine?token=${token}`),
          axios.get("http://localhost:8000/events")
        ])

        setTickets(ticketsRes.data)

        const eventsMap: Record<number, Event> = {}
        eventsRes.data.forEach((e: Event) => {
          eventsMap[e.id] = e
        })
        setEvents(eventsMap)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
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
        {/* Header */}
        <div className="mb-12">
          <p className="text-red-500 text-xs tracking-widest uppercase mb-3">Your Account</p>
          <h1 className="font-display text-6xl md:text-8xl tracking-wide">MY TICKETS</h1>
          <p className="text-white/40 text-sm mt-3">
            Welcome back, <span className="text-white">{user?.username}</span>
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48 gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {!loading && tickets.length === 0 && (
          <div className="text-center py-24 border border-white/5 rounded-2xl bg-white/[0.02]">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h2 className="font-display text-3xl tracking-wide mb-2">NO TICKETS YET</h2>
            <p className="text-white/40 text-sm mb-8">You haven't purchased any tickets yet.</p>
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-500 rounded-full px-8 font-sans">
                Browse Events
              </Button>
            </Link>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div className="space-y-4">
            {tickets.map((ticket, i) => {
              const event = events[ticket.event_id]
              return (
                <div
                  key={ticket.id}
                  className="fade-up relative bg-white/[0.03] border border-white/5 hover:border-red-500/20 rounded-2xl overflow-hidden transition-all duration-300"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Red left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />

                  <div className="p-6 pl-8 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center shrink-0">
                        <Ticket className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl tracking-wide">
                          {event ? event.title : `Event #${ticket.event_id}`}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-1">
                          {event && (
                            <>
                              <span className="flex items-center gap-1.5 text-white/40 text-xs">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                              </span>
                              <span className="flex items-center gap-1.5 text-white/40 text-xs">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      {event && (
                        <div>
                          <div className="font-display text-2xl text-white">${event.price}</div>
                          <div className="text-white/30 text-xs">paid</div>
                        </div>
                      )}
                      <Badge className="bg-green-500/15 text-green-400 border-green-500/20 text-xs">
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Summary */}
            <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-white/40 text-xs tracking-widest uppercase">Total Tickets</p>
                <p className="font-display text-3xl mt-1">{tickets.length}</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs tracking-widest uppercase">Total Spent</p>
                <p className="font-display text-3xl mt-1 text-red-400">
                  ${tickets.reduce((sum, t) => sum + (events[t.event_id]?.price || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}