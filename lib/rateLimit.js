import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Key gratis, publik, boleh dipake siapapun.
// Dicantumin di popup pertama kunjungan & halaman /faq.
export const FREE_API_KEY = 'cimytech##key'

// Key berbayar: daftar dipisah koma di env var Vercel, PAID_API_KEYS
// contoh: PAID_API_KEYS=abc123,xyz789
function getPaidKeys() {
  return (process.env.PAID_API_KEYS || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)
}

let redis = null
function getRedis() {
  if (!redis) redis = Redis.fromEnv()
  return redis
}

const limiterCache = {}
function getLimiter(tier, window, max) {
  const cacheKey = `${tier}:${window}`
  if (!limiterCache[cacheKey]) {
    limiterCache[cacheKey] = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(max, window),
      prefix: `rl:${cacheKey}`,
      analytics: false,
    })
  }
  return limiterCache[cacheKey]
}

// Batas per tier. Ubah di sini kalau mau tweak angka.
const TIERS = {
  anon: { hourly: 20, perSecond: 1 },
  free: { hourly: 80, perSecond: 2 },
}

export async function checkRateLimit(ip, apikey) {
  // Paid key -> unlimited, skip Redis sama sekali
  if (apikey && apikey !== FREE_API_KEY && getPaidKeys().includes(apikey)) {
    return { allowed: true, tier: 'paid', limit: null, remaining: null, reset: null }
  }

  const tier = apikey === FREE_API_KEY ? 'free' : 'anon'
  const cfg = TIERS[tier]
  const identifier = `${tier}:${ip}`

  const hourLimiter = getLimiter(tier, '1 h', cfg.hourly)
  const secLimiter = getLimiter(tier, '1 s', cfg.perSecond)

  const [hourRes, secRes] = await Promise.all([
    hourLimiter.limit(identifier),
    secLimiter.limit(identifier),
  ])

  const allowed = hourRes.success && secRes.success

  return {
    allowed,
    tier,
    limit: cfg.hourly,
    remaining: Math.max(0, Math.min(hourRes.remaining, secRes.remaining)),
    reset: hourRes.reset,
  }
}
