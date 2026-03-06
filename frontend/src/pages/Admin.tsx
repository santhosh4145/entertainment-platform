import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Flame, Users, Ticket, Calendar, DollarSign,
  Plus, Trash2, ArrowLeft, ShieldCheck
} from "lucide-react"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"

interface Event {
  id: number
  title: string
  date: string
  location: string
  price: number
}

interface User {
  id: number
  email: string
  username: string
  is_admin: string
}

interface TicketData {
  id: number
  user_id: number
  event_id: number
  status: string
  purchased_at: string
}

interface Stats {
  total_users: number
  total_events: number
  total_tickets: number
  total_revenue: number
}

export default function Admin() {
  const { token, user, isLoggedIn } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "users" | "tickets">("overview")
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "", price: "" })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/login"); return }
    if (user?.is_admin !== "true") { navigate("/"); return }
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      const [statsRes, eventsRes, usersRes, ticketsRes] = await Promise.all([
        axios.get(`http://localhost:8000/admin/stats?token=${token}`),
        axios.get(`http://localhost:8000/events`),
        axios.get(`http://localhost:8000/admin/users?token=${token}`),
        axios.get(`http://localhost:8000/admin/tickets?token=${token}`),
      ])
      setStats(statsRes.data)
      setEvents(eventsRes.data)
      setUsers(usersRes.data)
      setTickets(ticketsRes.data)
    } catch {
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddEvent() {
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.price) {
      setError("All fields are required")
      return
    }
    setSaving(true)
    setError("")
    try {
      await axios.post(`http://localhost:8000/admin/events?token=${token}`, {
        id: 0,
        title: newEvent.title,
        date: newEvent.date,
        location: newEvent.location,
        price: parseFloat(newEvent.price)
      })
      setNewEvent({ title: "", date: "", location: "", price: "" })
      setShowAddEvent(false)
      fetchAll()
    } catch {
      setError("Could not create event")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteEvent(id: number) {
    if (!confirm("Delete this event?")) return
    try {
      await axios.delete(`http://localhost:8000/admin/events/${id}?token=${token}`)
      fetchAll()
    } catch {
      alert("Could not delete event")
    }
  }

  const TABS = ["overview", "events", "users", "tickets"] as const

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
          <div className="flex items-center gap-3">
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 text-xs gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin
            </Badge>
            <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <p className="text-red-500 text-xs tracking-widest uppercase mb-2">Control Panel</p>
          <h1 className="font-display text-6xl tracking-wide">ADMIN DASHBOARD</h1>
          <p className="text-white/40 text-sm mt-2">Welcome, {user?.username}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 h-9 rounded-full text-xs tracking-widest uppercase transition-all border ${
                    activeTab === tab
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Total Users", value: stats.total_users, color: "#3b82f6" },
                  { icon: Calendar, label: "Total Events", value: stats.total_events, color: "#ef4444" },
                  { icon: Ticket, label: "Tickets Sold", value: stats.total_tickets, color: "#8b5cf6" },
                  { icon: DollarSign, label: "Total Revenue", value: `$${stats.total_revenue}`, color: "#22c55e" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="font-display text-4xl" style={{ color }}>{value}</div>
                    <div className="text-white/40 text-xs tracking-widest uppercase mt-1">{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === "events" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-3xl tracking-wide">EVENTS ({events.length})</h2>
                  <Button
                    onClick={() => setShowAddEvent(!showAddEvent)}
                    className="bg-red-600 hover:bg-red-500 rounded-full px-5 h-9 text-sm gap-2 font-sans"
                  >
                    <Plus className="w-4 h-4" /> Add Event
                  </Button>
                </div>

                {/* Add Event Form */}
                {showAddEvent && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
                    <h3 className="font-display text-2xl tracking-wide mb-4">NEW EVENT</h3>
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 mb-4">
                        {error}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { label: "Title", key: "title", placeholder: "Event name", type: "text" },
                        { label: "Location", key: "location", placeholder: "City, Venue", type: "text" },
                        { label: "Date", key: "date", placeholder: "2026-07-15", type: "date" },
                        { label: "Price ($)", key: "price", placeholder: "99", type: "number" },
                      ].map(({ label, key, placeholder, type }) => (
                        <div key={key}>
                          <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">{label}</label>
                          <input
                            type={type}
                            placeholder={placeholder}
                            value={newEvent[key as keyof typeof newEvent]}
                            onChange={e => setNewEvent({ ...newEvent, [key]: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-500/50"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={handleAddEvent}
                        disabled={saving}
                        className="bg-red-600 hover:bg-red-500 rounded-full px-6 h-9 text-sm font-sans"
                      >
                        {saving ? "Saving..." : "Create Event"}
                      </Button>
                      <Button
                        onClick={() => setShowAddEvent(false)}
                        variant="outline"
                        className="border-white/10 text-white/50 bg-transparent hover:bg-white/5 rounded-full px-6 h-9 text-sm font-sans"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Events list */}
                <div className="space-y-3">
                  {events.map(event => (
                    <div key={event.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-display text-2xl tracking-wide">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-1">
                          <span className="text-white/40 text-xs">{event.date}</span>
                          <span className="text-white/40 text-xs">{event.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="font-display text-2xl text-red-400">${event.price}</div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div>
                <h2 className="font-display text-3xl tracking-wide mb-6">USERS ({users.length})</h2>
                <div className="space-y-3">
                  {users.map(u => (
                    <div key={u.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                          <span className="font-display text-lg text-red-400">{u.username[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-display text-xl tracking-wide">{u.username}</div>
                          <div className="text-white/40 text-xs">{u.email}</div>
                        </div>
                      </div>
                      <Badge className={u.is_admin === "true"
                        ? "bg-red-600/20 text-red-400 border-red-500/30 text-xs"
                        : "bg-white/5 text-white/40 border-white/10 text-xs"
                      }>
                        {u.is_admin === "true" ? "Admin" : "User"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TICKETS TAB */}
            {activeTab === "tickets" && (
              <div>
                <h2 className="font-display text-3xl tracking-wide mb-6">ALL TICKETS ({tickets.length})</h2>
                <div className="space-y-3">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                          <Ticket className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-display text-xl tracking-wide">Ticket #{ticket.id}</div>
                          <div className="text-white/40 text-xs">
                            User #{ticket.user_id} · Event #{ticket.event_id}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/15 text-green-400 border-green-500/20 text-xs">
                        {ticket.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}