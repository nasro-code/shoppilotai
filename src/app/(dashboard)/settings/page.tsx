'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, CheckCircle, AlertCircle, ExternalLink, Store, ArrowRight, X } from 'lucide-react'

function SettingsContent() {
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showShopInput, setShowShopInput] = useState(false)
  const [shopDomain, setShopDomain] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [inputError, setInputError] = useState('')

  const shopifyConnected = searchParams.get('shopify_connected') === 'true'
  const shopifyError = searchParams.get('shopify_error')

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const getData = async () => {
      try {
        console.log('[Settings] Fetching session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('[Settings] Session error:', sessionError)
        }

        const user = session?.user || null
        setUser(user)
        console.log('[Settings] User:', user?.id || 'Not logged in')

        if (user) {
          console.log('[Settings] Fetching store for user:', user.id)
          const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (storeError && storeError.code !== 'PGRST116') {
            console.error('[Settings] Store error:', storeError)
          } else if (storeData) {
            console.log('[Settings] Store found:', storeData.shop_domain)
          }
          setStore(storeData)
        }
      } catch (error) {
        console.error('[Settings] Unexpected error:', error)
      } finally {
        console.log('[Settings] Data fetch complete')
        setLoading(false)
      }
    }

    // Faster safety timeout
    timeoutId = setTimeout(() => {
      console.log('[Settings] Recovery timeout reached')
      setLoading(false)
    }, 2000)

    getData().finally(() => {
      clearTimeout(timeoutId)
    })
  }, [])

  const handleConnectShopify = () => {
    setShowShopInput(true)
    setInputError('')
  }

  const handleSubmitShop = () => {
    setInputError('')

    let domain = shopDomain.trim()

    domain = domain.replace(/^https?:\/\//, '')
    domain = domain.split('/')[0]

    if (domain && !domain.includes('.')) {
      domain = `${domain}.myshopify.com`
    }

    if (!domain || !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(domain)) {
      setInputError('Please enter a valid Shopify store URL (e.g. my-store.myshopify.com)')
      return
    }

    setConnecting(true)
    window.location.href = `/api/shopify/install?shop=${encodeURIComponent(domain)}`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitShop()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#10B981" }} />
      </div>
    )
  }

  if (!user && !loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#0F172A" }}>Settings</h1>
          <p style={{ color: "#64748B" }}>Manage your account and store preferences.</p>
        </div>
        
        <div 
          className="p-8 text-center space-y-4"
          style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "0.67px solid #E2E8F0" }}
        >
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "#0F172A" }}>Session Required</h3>
            <p className="text-sm" style={{ color: "#64748B" }}>Please log in to manage your settings.</p>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95"
            style={{ backgroundColor: "#10B981" }}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>Settings</h2>
        <p className="mt-1" style={{ color: "#64748B" }}>Manage your account and integrations.</p>
      </div>

      {shopifyConnected && (
        <div
          className="p-4 rounded-xl flex items-start gap-3"
          style={{
            backgroundColor: "#F0FDF4",
            border: "0.67px solid #D1FAE5",
            color: "#10B981"
          }}
        >
          <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium" style={{ color: "#059669" }}>Shopify store connected successfully!</p>
            <p className="text-sm mt-1" style={{ color: "#10B981" }}>Your store is now linked to your account.</p>
          </div>
        </div>
      )}

      {shopifyError && (
        <div
          className="p-4 rounded-xl flex items-start gap-3"
          style={{
            backgroundColor: "#FEF2F2",
            border: "0.67px solid #FEE2E2",
            color: "#EF4444"
          }}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Connection failed</p>
            <p className="text-sm mt-1" style={{ color: "#EF4444" }}>{decodeURIComponent(shopifyError)}</p>
          </div>
        </div>
      )}

      <div
        className="p-6"
        style={{
          backgroundColor: "#FFFFFF",
          border: "0.67px solid #F1F5F9",
          borderRadius: "24px"
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#F0FDF4", border: "0.67px solid #D1FAE5" }}
          >
            <Store className="w-6 h-6" style={{ color: "#10B981" }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "#0F172A" }}>Shopify Store</h3>
            <p className="text-sm" style={{ color: "#64748B" }}>Connect your Shopify store to manage orders and customers.</p>
          </div>
        </div>

        {store ? (
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "#F8FAFC",
              border: "0.67px solid #E2E8F0"
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: "#0F172A" }}>{store.shop_name || store.shop_domain}</p>
                <p className="text-sm" style={{ color: "#64748B" }}>{store.shop_domain}</p>
                {store.shop_email && (
                  <p className="text-sm mt-1" style={{ color: "#64748B" }}>{store.shop_email}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "#F0FDF4",
                    color: "#10B981",
                    border: "0.67px solid #D1FAE5"
                  }}
                >
                  Connected
                </span>
                <a
                  href={`https://${store.shop_domain}/admin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "#64748B" }}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ) : showShopInput ? (
          <div className="py-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>
              Enter your Shopify store URL
            </label>
            <p className="text-xs mb-4" style={{ color: "#64748B" }}>
              You can find this in your Shopify admin URL. It looks like <span className="font-mono" style={{ color: "#475569" }}>your-store.myshopify.com</span>
            </p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={shopDomain}
                  onChange={(e) => { setShopDomain(e.target.value); setInputError('') }}
                  onKeyDown={handleKeyDown}
                  placeholder="my-store.myshopify.com"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "0.67px solid #E2E8F0",
                    color: "#0F172A"
                  }}
                />
              </div>
              <button
                onClick={handleSubmitShop}
                disabled={connecting || !shopDomain.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all text-white shadow-md disabled:opacity-50"
                style={{ backgroundColor: "#10B981" }}
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => { setShowShopInput(false); setShopDomain(''); setInputError('') }}
                className="p-3 rounded-xl transition-colors"
                style={{ backgroundColor: "#F8FAFC", border: "0.67px solid #E2E8F0", color: "#64748B" }}
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {inputError && (
              <p className="mt-3 text-sm flex items-center gap-1.5" style={{ color: "#EF4444" }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                {inputError}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#F8FAFC", border: "0.67px solid #E2E8F0" }}
            >
              <Store className="w-8 h-8" style={{ color: "#94A3B8" }} />
            </div>
            <h4 className="font-medium mb-2" style={{ color: "#0F172A" }}>No store connected</h4>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "#64748B" }}>
              Connect your Shopify store to start managing orders, customers, and shipping.
            </p>
            <button
              onClick={handleConnectShopify}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all text-white shadow-md"
              style={{ backgroundColor: "#10B981" }}
            >
              <Store className="w-4 h-4" />
              Connect Shopify Store
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#10B981" }} />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  )
}
