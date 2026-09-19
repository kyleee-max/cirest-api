import { createDecipheriv } from 'crypto'

const METADATA_DECRYPTION_KEY = Buffer.from(
  'C5D58EF67A7584E4A29F6C35BBC4EB12',
  'hex'
)

const HEADERS = {
  'Content-Type': 'application/json',
  'Origin': 'https://yt.savetube.me',
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36',
}

async function savetube(url, { downloadType = 'audio', quality } = {}) {
  const idMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/
  )

  if (!idMatch) throw new Error('URL YouTube tidak valid')

  const videoId = idMatch[1]

  const cdnRes = await fetch('https://media.savetube.vip/api/random-cdn', {
    headers: HEADERS,
  }).then(r => r.json()).catch(() => null)

  if (!cdnRes?.cdn) throw new Error('CDN tidak tersedia')

  const cdn = cdnRes.cdn

  const info = await fetch(`https://${cdn}/v2/info`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      url: `https://www.youtube.com/watch?v=${videoId}`,
    }),
  }).then(r => r.json()).catch(() => null)

  if (!info?.data) throw new Error('Metadata kosong')

  let metadata

  try {
    const encrypted = Buffer.from(info.data, 'base64')

    const decipher = createDecipheriv(
      'aes-128-cbc',
      METADATA_DECRYPTION_KEY,
      encrypted.subarray(0, 16)
    )

    const decrypted = Buffer.concat([
      decipher.update(encrypted.subarray(16)),
      decipher.final(),
    ])

    metadata = JSON.parse(decrypted.toString('utf8'))
  } catch {
    throw new Error('Decrypt metadata gagal')
  }

  if (!metadata?.key) {
    throw new Error('Key download tidak ditemukan')
  }

  const dl = await fetch(`https://${cdn}/download`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      id: videoId,
      downloadType,
      quality: quality || (downloadType === 'video' ? '360' : '128kbps'),
      key: metadata.key,
    }),
  }).then(r => r.json()).catch(() => null)

  if (!dl?.data?.downloadUrl) {
    throw new Error(dl?.message || 'Download gagal')
  }

  return {
    title: metadata.title,
    duration: metadata.durationLabel,
    thumbnail: metadata.thumbnail,
    url: dl.data.downloadUrl,
  }
}

async function savetubeRetry(url, opts, retry = 3) {
  let lastErr

  for (let i = 0; i < retry; i++) {
    try {
      return await savetube(url, opts)
    } catch (err) {
      lastErr = err

      if (i < retry - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  throw lastErr
}

// creator: KaelTzy

export default async function handler(req, res) {
  const {
    url,
    type = 'audio',
    quality,
  } = req.query

  if (!url) {
    return res.status(400).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Parameter url wajib diisi.',
    })
  }

  if (!['audio', 'video'].includes(type)) {
    return res.status(400).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Parameter type harus audio atau video.',
    })
  }

  try {
    const result = await savetubeRetry(url, {
      downloadType: type,
      quality,
    })

    return res.status(200).json({
      success: true,
      creator: 'KaelTzy',
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Server error: ' + err.message,
    })
  }
}
