'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Rocket, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">AutoCommerce AI</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Check your inbox</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                We&apos;ve sent a confirmation link to <span className="text-blue-400 font-medium">{email}</span>. 
                Please click the link to activate your account.
              </p>
              <Link
                href="/login"
                className="inline-block w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all border border-white/5"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Get Started</h2>
              <p className="text-gray-400 text-sm text-center mb-8">Create your free account to automate your commerce</p>

              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3B82F6] hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Log In</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
