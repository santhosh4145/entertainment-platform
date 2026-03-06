import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {  Music, Instagram, Twitter, Youtube, ArrowLeft, Play } from "lucide-react"

interface Artist {
  id: number
  name: string
  genre: string
  subgenre: string
  bio: string
  monthlyListeners: string
  topTracks: string[]
  social: { ig?: string; tw?: string; yt?: string }
  color: string
}

const ARTISTS: Artist[] = [
  {
    id: 1,
    name: "NOVA REX",
    genre: "Hip-Hop",
    subgenre: "Trap / R&B",
    bio: "Multi-platinum artist known for cinematic beats and raw lyricism. Toured 40+ countries and headlined 3 consecutive sold-out world tours.",
    monthlyListeners: "12.4M",
    topTracks: ["Midnight Drive", "Blood Money", "Crown"],
    social: { ig: "#", tw: "#", yt: "#" },
    color: "#ef4444",
  },
  {
    id: 2,
    name: "SOLARA",
    genre: "Electronic",
    subgenre: "Afrobeats / House",
    bio: "Genre-blending producer and vocalist fusing West African rhythms with deep house. Known for infectious energy and sold-out club nights.",
    monthlyListeners: "8.1M",
    topTracks: ["Lagos Nights", "Drift", "Golden Hour"],
    social: { ig: "#", tw: "#" },
    color: "#f97316",
  },
  {
    id: 3,
    name: "VEGA",
    genre: "Alternative",
    subgenre: "Indie Rock / Dream Pop",
    bio: "Critically acclaimed rock duo pushing boundaries between noise and melody. Their debut album went #1 in 12 countries.",
    monthlyListeners: "5.7M",
    topTracks: ["Static", "Neon Halo", "Fade Into You"],
    social: { ig: "#", tw: "#", yt: "#" },
    color: "#8b5cf6",
  },
  {
    id: 4,
    name: "KIRA MUSE",
    genre: "Pop",
    subgenre: "Art Pop / Neo-Soul",
    bio: "Songwriter and visual artist redefining pop music with conceptual albums and stunning live theatrics. 3x Grammy nominee.",
    monthlyListeners: "18.9M",
    topTracks: ["Porcelain", "Electric Sky", "Mirror"],
    social: { ig: "#", yt: "#" },
    color: "#ec4899",
  },
  {
    id: 5,
    name: "IRON FLUX",
    genre: "Electronic",
    subgenre: "Techno / Industrial",
    bio: "Berlin-based DJ collective bringing raw industrial techno to massive festival stages. Residency at top clubs worldwide.",
    monthlyListeners: "3.2M",
    topTracks: ["Grid Lock", "010101", "Pressure"],
    social: { ig: "#", tw: "#" },
    color: "#06b6d4",
  },
  {
    id: 6,
    name: "ABEL CROSS",
    genre: "R&B",
    subgenre: "Neo-Soul / Jazz",
    bio: "Smooth vocalist and multi-instrumentalist blending jazz harmony with modern R&B production. Live shows are legendary.",
    monthlyListeners: "7.6M",
    topTracks: ["Velvet", "All Night", "Smoke & Mirrors"],
    social: { ig: "#", tw: "#", yt: "#" },
    color: "#eab308",
  },
]

const GENRES = ["All", "Hip-Hop", "Electronic", "Alternative", "Pop", "R&B"]

export default function Artists() {
  const [selected, setSelected] = useState<Artist | null>(null)
  const [filter, setFilter] = useState("All")

  const filtered = filter === "All" ? ARTISTS : ARTISTS.filter((a) => a.genre === filter)

  if (selected) {
    return (
      <div className="min-h-screen bg-[#080808] text-white font-sans">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
          .font-display { font-family: 'Bebas Neue', sans-serif; }
          body { font-family: 'DM Sans', sans-serif; }
        `}</style>

        {/* Back nav */}
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Artists
          </button>
        </div>

        {/* Artist detail hero */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left — avatar placeholder */}
            <div className="relative">
              <div
                className="w-full aspect-square rounded-3xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${selected.color}22, ${selected.color}08)`, border: `1px solid ${selected.color}30` }}
              >
                <span className="font-display text-[8rem] opacity-20" style={{ color: selected.color }}>
                  {selected.name[0]}
                </span>
              </div>
              {/* Glow */}
              <div
                className="absolute -inset-8 rounded-3xl blur-3xl opacity-20 -z-10"
                style={{ background: selected.color }}
              />
            </div>

            {/* Right — info */}
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="text-xs font-sans tracking-widest uppercase" style={{ background: `${selected.color}20`, color: selected.color, borderColor: `${selected.color}40` }}>
                  {selected.genre}
                </Badge>
                <span className="text-white/30 text-xs">{selected.subgenre}</span>
              </div>

              <h1 className="font-display text-6xl md:text-8xl tracking-wide mb-6">{selected.name}</h1>

              <p className="text-white/60 text-base leading-relaxed mb-8">{selected.bio}</p>

              <div className="flex items-center gap-8 mb-10">
                <div>
                  <div className="font-display text-3xl" style={{ color: selected.color }}>{selected.monthlyListeners}</div>
                  <div className="text-white/30 text-xs tracking-widest uppercase mt-1">Monthly Listeners</div>
                </div>
              </div>

              {/* Top Tracks */}
              <div className="mb-8">
                <p className="text-white/30 text-xs tracking-widest uppercase mb-4">Top Tracks</p>
                <div className="space-y-2">
                  {selected.topTracks.map((track, i) => (
                    <div
                      key={track}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] transition-all cursor-pointer group"
                    >
                      <span className="text-white/20 text-sm w-4">{i + 1}</span>
                      <Play className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: selected.color }} />
                      <span className="text-white text-sm flex-1">{track}</span>
                      <Music className="w-3.5 h-3.5 text-white/20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Social + CTA */}
              <div className="flex items-center gap-4">
                {selected.social.ig && (
                  <a href={selected.social.ig} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
                    <Instagram className="w-4 h-4 text-white/60" />
                  </a>
                )}
                {selected.social.tw && (
                  <a href={selected.social.tw} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
                    <Twitter className="w-4 h-4 text-white/60" />
                  </a>
                )}
                {selected.social.yt && (
                  <a href={selected.social.yt} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
                    <Youtube className="w-4 h-4 text-white/60" />
                  </a>
                )}
                <Button
                  className="ml-auto rounded-full px-6 h-10 text-sm"
                  style={{ background: selected.color }}
                >
                  <Ticket className="w-4 h-4 mr-2" /> See Upcoming Shows
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <p className="text-red-500 text-xs tracking-widest uppercase mb-3 font-sans">Our Roster</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h1 className="font-display text-6xl md:text-8xl tracking-wide">THE ARTISTS</h1>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed">
            World-class talent. Unforgettable performances. This is the Hotbox Underground roster.
          </p>
        </div>

        {/* Genre filter */}
        <div className="flex flex-wrap gap-2 mt-10">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-4 h-8 rounded-full text-xs tracking-wide transition-all border ${
                filter === g
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Artist grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((artist, i) => (
            <div
              key={artist.id}
              onClick={() => setSelected(artist)}
              className="fade-up group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/15 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.05]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Color accent top bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${artist.color}, transparent)` }} />

              <div className="p-6">
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${artist.color}15`, border: `1px solid ${artist.color}25` }}
                >
                  <span className="font-display text-2xl" style={{ color: artist.color }}>
                    {artist.name[0]}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="font-display text-3xl tracking-wide leading-none">{artist.name}</h2>
                  <Badge
                    className="text-xs shrink-0 mt-1"
                    style={{ background: `${artist.color}15`, color: artist.color, borderColor: `${artist.color}30` }}
                  >
                    {artist.genre}
                  </Badge>
                </div>

                <p className="text-white/40 text-xs mb-5 leading-relaxed line-clamp-2">{artist.bio}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-xl" style={{ color: artist.color }}>{artist.monthlyListeners}</span>
                    <span className="text-white/25 text-xs ml-2">listeners/mo</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/30 text-xs group-hover:text-white/60 transition-colors">
                    View Profile
                    <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// missing import fix
function Ticket({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
      <path d="M13 5v2M13 17v2M13 11v2"/>
    </svg>
  )
}
