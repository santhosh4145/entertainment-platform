import { create } from "zustand"

interface User {
  id: number
  email: string
  username: string
  is_admin: string
}

interface AuthStore {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  isLoggedIn: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  login: (user, token) => {
    set({ user, token })
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
  },
  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
  isLoggedIn: () => !!get().token,
}))

// Load from localStorage on app start
const token = localStorage.getItem("token")
const user = localStorage.getItem("user")
if (token && user) {
  useAuthStore.setState({ token, user: JSON.parse(user) })
}