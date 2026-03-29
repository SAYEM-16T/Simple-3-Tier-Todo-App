import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await register({ name, email, password })
      navigate('/dashboard')
    } catch (error) {
      setError(getApiErrorMessage(error, 'Registration failed. Try another email or a stronger password.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
        <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300">Create account</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Get started</h1>
        <p className="mt-2 text-sm text-slate-400">Create a user account and manage tasks securely.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>

          {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-fuchsia-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-fuchsia-300 disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
