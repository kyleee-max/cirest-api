import { NextResponse } from 'next/server'
import { checkRateLimit, FREE_API_KEY } from './lib/rateLimit'

export const config = {
  matcher: ['/api/:path*'],
}

export async function middleware(req) {
  // Admin panel punya auth sendiri (x-admin-token), skip rate limit di sini
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const apikey = req.nextUrl.searchParams.get('apikey')

  let result
  try {
    result = await checkRateLimit(ip, apikey)
  } catch (e) {
    // Kalau Redis lagi down/env belum kepasang, jangan sampe API lumpuh total
    console.error('rateLimit error:', e.message)
    return NextResponse.next()
  }

  if (!result.allowed) {
    const message =
      result.tier === 'anon'
        ? `Rate limit tercapai (20/jam tanpa apikey). Pakai apikey gratis "${FREE_API_KEY}" buat naik ke 80/jam, atau beli apikey unlimited. Cek /faq.`
        : `Rate limit tercapai (80/jam dengan apikey gratis). Upgrade ke apikey unlimited biar bebas limit. Cek /faq.`

    return NextResponse.json(
      { success: false, message, tier: result.tier },
      { status: 429 }
    )
  }

  const res = NextResponse.next()
  if (result.limit != null) {
    res.headers.set('X-RateLimit-Limit', String(result.limit))
    res.headers.set('X-RateLimit-Remaining', String(result.remaining))
    if (result.reset) res.headers.set('X-RateLimit-Reset', String(result.reset))
  } else {
    res.headers.set('X-RateLimit-Limit', 'unlimited')
  }
  return res
}
