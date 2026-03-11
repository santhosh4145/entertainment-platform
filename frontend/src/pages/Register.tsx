import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Flame } from "lucide-react"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import API_URL from '../lib/api'

export default function Register() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  async function handleRegister() {
    setLoading(true)
    setError("")
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { email, username, password })
      login(res.data.user, res.data.access_token)
      navigate("/")
    } catch {
      setError("Email or username already exists")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <Flame className="w-5 h-5 text-red-500" />
          <span className="font-display text-2xl tracking-wider">HOTBOX</span>
          <span className="font-display text-2xl tracking-wider text-red-500">UNDERGROUND</span>
        </Link>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <h1 className="font-display text-4xl tracking-wide mb-2">JOIN THE UNDERGROUND</h1>
          <p className="text-white/40 text-sm mb-8">Create your account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-500/50"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-500/50"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-500/50"
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>
          </div>

          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl h-11 mt-6 font-sans"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-center text-white/30 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-red-400 hover:text-red-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}