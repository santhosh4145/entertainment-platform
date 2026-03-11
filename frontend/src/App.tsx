import { useAuthStore } from "./store/authStore"
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Ticket, Flame, Music, Radio, ShoppingBag, ChevronRight, Play } from "lucide-react"
import axios from "axios"
import Artists from "./pages/Artists"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EventDetail from "./pages/EventDetail"
import MyTickets from "./pages/MyTickets"
import Admin from "./pages/Admin"
import Merch from "./pages/Merch"
import AIChat from "./components/AIchat"
import CheckoutSuccess from "./pages/CheckoutSuccess"
import CheckoutCancel from "./pages/CheckoutCancel"
import API_URL from './lib/api'

interface Event {
  id: number
  title: string
  date: string
  location: string
  price: number
}

const NAV_LINKS = [
  { label: "Events", href: "#events" },
  { label: "Artists", href: "/artists" },
  { label: "Music", href: "#music" },
  { label: "Merch", href: "/merch" },
  { label: "About", href: "#about" },
]

function HomePage() {
  const { user, logout, isLoggedIn } = useAuthStore()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()  

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    axios
      .get(`${API_URL}/events`)
      .then((res) => setEvents(res.data))
      .catch(() => setError("Could not load events. Make sure the backend is running."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(220,38,38,0.4); }
          50% { box-shadow: 0 0 40px rgba(220,38,38,0.8); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fadeUp { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .marquee-track { animation: marquee 18s linear infinite; }
        .event-card:hover .event-arrow { transform: translateX(4px); }
        .event-arrow { transition: transform 0.2s; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <span className="font-display text-2xl tracking-wider text-white">HOTBOX</span>
            <span className="font-display text-2xl tracking-wider text-red-500">UNDERGROUND</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-body text-white/60 hover:text-white transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-body text-white/60 hover:text-white transition-colors tracking-wide"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>
                      {isLoggedIn() ? (
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm font-body hidden md:block">
                  Hey, {user?.username} 👋
                </span>
                <Link to="/my-tickets" className="text-sm font-body text-white/60 hover:text-white transition-colors hidden md:block">
                  My Tickets
                </Link>
                {user?.is_admin === "true" && (
                <Link to="/admin" className="text-sm font-body text-red-400 hover:text-red-300 transition-colors hidden md:block">
                Admin
                </Link>
                )}
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 font-body rounded-full px-5 h-9 bg-transparent text-sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-body text-white/60 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Button className="bg-red-600 hover:bg-red-500 text-white text-sm font-body rounded-full px-5 h-9 animate-pulse-glow">
                  <Link to="/register">Get Tickets</Link>
                </Button>
              </div>
            )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-black to-black" />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(220,38,38,0.15) 0%, transparent 60%)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-[28vw] leading-none text-white/[0.02] whitespace-nowrap">HOTBOX</span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
          <div className="animate-fadeUp">
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 text-xs tracking-widest uppercase mb-6 font-body">
              Live · Music · Events
            </Badge>
          </div>
          <h1 className="font-display text-[clamp(4rem,14vw,12rem)] leading-none tracking-wide animate-fadeUp delay-100">
            WHERE MUSIC
            <br />
            <span className="text-red-500">COMES ALIVE</span>
          </h1>
          <p className="font-body text-white/50 text-lg max-w-xl mx-auto mt-6 leading-relaxed animate-fadeUp delay-200">
            Premium live events, curated music, and exclusive artist experiences — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10 animate-fadeUp delay-300">
            <Button className="bg-red-600 hover:bg-red-500 text-white font-body rounded-full px-8 h-12 text-sm tracking-wide gap-2">
              <Ticket className="w-4 h-4" /> Explore Events
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5 font-body rounded-full px-8 h-12 text-sm tracking-wide gap-2 bg-transparent"
            >
              <Play className="w-4 h-4" /> Watch Trailer
            </Button>
          </div>

          <div className="flex items-center justify-center gap-12 mt-16 animate-fadeUp delay-400">
            {[["200+", "Live Events"], ["50+", "Artists"], ["1M+", "Fans"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl text-white">{num}</div>
                <div className="font-body text-white/40 text-xs tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/60" />
          <span className="font-body text-xs tracking-widest uppercase text-white/60">Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/5 bg-red-600/10 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="font-display text-sm tracking-widest text-red-400/70 mx-8">
              LIVE EVENTS &nbsp;·&nbsp; MUSIC STREAMING &nbsp;·&nbsp; ARTIST MERCH &nbsp;·&nbsp; EXCLUSIVE DROPS &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── EVENTS ── */}
      <section id="events" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-body text-red-500 text-xs tracking-widest uppercase mb-3">Don't Miss Out</p>
            <h2 className="font-display text-5xl md:text-7xl tracking-wide">UPCOMING<br />EVENTS</h2>
          </div>
          <Button variant="ghost" className="text-white/50 hover:text-white font-body text-sm gap-1 hidden md:flex">
            View All <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48 gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {error && (
          <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6 text-red-400 font-body text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-4">
            {events.map((event, i) => (
              <Card
                key={event.id}
                className={`event-card group bg-white/[0.03] border-white/5 hover:border-red-500/30 hover:bg-white/[0.06] transition-all duration-300 rounded-2xl p-6 cursor-pointer ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge className="bg-red-600/15 text-red-400 border-red-500/20 text-xs font-body tracking-widest uppercase mb-4">
                      Featured
                    </Badge>
                    <h3 className={`font-display tracking-wide text-white ${i === 0 ? "text-4xl md:text-5xl" : "text-2xl"}`}>
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <span className="flex items-center gap-1.5 text-white/50 text-sm font-body">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/50 text-sm font-body">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-3xl text-white">${event.price}</div>
                    <div className="font-body text-white/30 text-xs mt-1">per ticket</div>
                    <Link to={`/events/${event.id}`}>
                        <Button className="mt-4 bg-red-600 hover:bg-red-500 text-white font-body text-xs rounded-full px-4 h-8 gap-1">
                          Buy <ChevronRight className="w-3 h-3 event-arrow" />
                        </Button>
                      </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── ARTISTS TEASER ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div
          className="relative rounded-3xl overflow-hidden border border-white/5 p-12"
          style={{ background: "linear-gradient(135deg, #0f0f0f, #1a0a0a)" }}
        >
          <p className="font-body text-red-500 text-xs tracking-widest uppercase mb-3">The Roster</p>
          <h2 className="font-display text-5xl md:text-7xl tracking-wide mb-4">MEET THE<br />ARTISTS</h2>
          <p className="font-body text-white/40 text-sm max-w-sm mb-8 leading-relaxed">
            World-class talent from every genre. Discover the artists that make Hotbox Underground legendary.
          </p>
          <Button
            onClick={() => navigate("/artists")}
            className="bg-red-600 hover:bg-red-500 text-white font-body rounded-full px-8 h-11 text-sm gap-2"
          >
            View All Artists <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Music, label: "Music Streaming", desc: "Thousands of tracks" },
            { icon: Ticket, label: "Live Events", desc: "Worldwide venues" },
            { icon: Radio, label: "Artist Radio", desc: "Curated stations" },
            { icon: ShoppingBag, label: "Merch Shop", desc: "Exclusive drops" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="group text-center cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600/20 transition-colors">
                <Icon className="w-5 h-5 text-red-400" />
              </div>
              <div className="font-body font-medium text-white text-sm">{label}</div>
              <div className="font-body text-white/30 text-xs mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-950 to-red-900 border border-red-500/20 p-12 text-center">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10">
            <Flame className="w-8 h-8 text-red-300 mx-auto mb-4" />
            <h2 className="font-display text-4xl md:text-6xl tracking-wide text-white mb-4">NEVER MISS A SHOW</h2>
            <p className="font-body text-red-200/60 text-base max-w-md mx-auto mb-8">
              Subscribe for early access to tickets, exclusive merch drops, and artist announcements.
            </p>
            <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/10 rounded-full px-5 h-11 text-sm font-body text-white placeholder:text-white/30 outline-none focus:border-white/30"
              />
              <Button className="bg-white text-red-900 hover:bg-white/90 font-body font-medium rounded-full px-6 h-11 text-sm shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="font-display text-lg tracking-wider">HOTBOX UNDERGROUND</span>
          </div>
          <p className="font-body text-white/20 text-xs">© 2026 Hotbox Underground. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

  export default function App() {
      return (
    <BrowserRouter>
      {/* All routes */}
      <Routes>
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* Floating AI chat — appears on EVERY page */}
      <AIChat />
    </BrowserRouter>
  )
}
