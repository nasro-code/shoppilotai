'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Rocket, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
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

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setError(null)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: "#10B981" }}
            >
              <Rocket className="w-6 h-6" style={{ color: "#FFFFFF" }} />
            </div>
            <span className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>Shoppilot AI</span>
          </div>
        </div>

        <div
          className="p-8 shadow-lg"
          style={{
            backgroundColor: "#FFFFFF",
            border: "0.67px solid #F1F5F9",
            borderRadius: "24px"
          }}
        >
          {success ? (
            <div className="text-center animate-in zoom-in-95 duration-300">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#F0FDF4", border: "0.67px solid #D1FAE5" }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: "#10B981" }} />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#0F172A" }}>Check your inbox</h2>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: "#64748B" }}>
                We&apos;ve sent a confirmation link to <span className="font-medium" style={{ color: "#10B981" }}>{email}</span>.
                Please click the link to activate your account.
              </p>
              <Link
                href="/login"
                className="inline-block w-full font-medium py-3 rounded-xl transition-all text-center"
                style={{ backgroundColor: "#F8FAFC", border: "0.67px solid #E2E8F0", color: "#0F172A" }}
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: "#0F172A" }}>Get Started</h2>
              <p className="text-sm text-center mb-8" style={{ color: "#64748B" }}>Create your free account to automate your commerce</p>

              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div
                    className="p-3 rounded-lg flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-1"
                    style={{
                      backgroundColor: "#FEF2F2",
                      border: "0.67px solid #FEE2E2",
                      color: "#EF4444"
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 font-semibold py-3 rounded-xl transition-all border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#FFFFFF", border: "0.67px solid #E2E8F0", color: "#0F172A" }}
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t w-full" style={{ borderColor: "#E2E8F0" }}></div>
                  <span
                    className="absolute px-3 text-xs"
                    style={{ backgroundColor: "#FFFFFF", color: "#64748B" }}
                  >
                    or
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider ml-1" style={{ color: "#64748B" }}>
                    Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "0.67px solid #E2E8F0",
                      color: "#0F172A"
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider ml-1" style={{ color: "#64748B" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: "#F8FAFC",
                      border: "0.67px solid #E2E8F0",
                      color: "#0F172A"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
              </form>

              <div className="mt-8 pt-6 text-center" style={{ borderTop: "0.67px solid #F1F5F9" }}>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium" style={{ color: "#10B981" }}>
                    Log In
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
