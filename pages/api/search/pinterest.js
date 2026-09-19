import axios from 'axios'
import { logRequest } from '../../../lib/logger'

// creator: KaelTzy

async function getCookies() {
  try {
    const response = await axios.get('https://www.pinterest.com/csrf_error/')
    const setCookieHeaders = response.headers['set-cookie']

    if (setCookieHeaders) {
      return setCookieHeaders
        .map((cookie) => cookie.split(';')[0].trim())
        .join('; ')
    }

    return null
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  logRequest(req)

  const { q } = req.query

  if (!q) {
    return res.status(400).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Parameter q wajib diisi.',
    })
  }

  try {
    const cookies = await getCookies()

    if (!cookies) {
      return res.status(500).json({
        success: false,
        creator: 'KaelTzy',
        message: 'Gagal mendapatkan cookies Pinterest.',
      })
    }

    const response = await axios.get(
      'https://www.pinterest.com/resource/BaseSearchResource/get/',
      {
        params: {
          source_url: `/search/pins/?q=${q}`,
          data: JSON.stringify({
            options: {
              isPrefetch: false,
              query: q,
              scope: 'pins',
              no_fetch_context_on_resource: false,
            },
            context: {},
          }),
          _: Date.now(),
        },
        headers: {
          accept: 'application/json, text/javascript, */*, q=0.01',
          'accept-encoding': 'gzip, deflate',
          'accept-language': 'en-US,en;q=0.9',
          cookie: cookies,
          dnt: '1',
          referer: 'https://www.pinterest.com/',
          'sec-ch-ua':
            '"Not(A:Brand";v="99", Microsoft Edge";v="133", Chromium";v="133"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
          'x-app-version': 'c056fb7',
          'x-pinterest-appstate': 'active',
          'x-pinterest-pws-handler': 'www/[username]/[slug].js',
          'x-pinterest-source-url': '/search/pins/',
          'x-requested-with': 'XMLHttpRequest',
        },
        timeout: 15_000,
      }
    )

    const results =
      response.data?.resource_response?.data?.results?.filter(
        (item) => item.images?.orig
      ) || []

    const data = results.map((item) => ({
      upload_by: item.pinner?.username || '-',
      fullname: item.pinner?.full_name || '-',
      followers: item.pinner?.follower_count || 0,
      caption: item.grid_title || '',
      image: item.images.orig.url,
      source: `https://id.pinterest.com/pin/${item.id}`,
    }))

    return res.status(200).json({
      success: true,
      creator: 'KaelTzy',
      data,
    })
  } catch (err) {
    console.error('Pinterest Search:', err)

    return res.status(500).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Server error: ' + err.message,
    })
  }
}
