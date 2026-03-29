import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Simple 3-Tier Todo</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Welcome back, {user?.name}</h1>
        <p className="mt-2 text-sm text-slate-300">Manage your tasks with a clean React + FastAPI + PostgreSQL stack.</p>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/20"
      >
        Logout
      </button>
    </div>
  )
}
