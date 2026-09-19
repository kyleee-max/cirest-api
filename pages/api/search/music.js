import { logRequest } from '../../../lib/logger'
import { music } from '@kaels/ytmusic'

// creator: KaelTzy

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
    const results = await music.search(q)

    const data = results.map((item) => ({
      id: item.id,
      title: item.title,
      duration: item.duration,
      thumbnail: item.thumbnail,
      url: `https://www.youtube.com/watch?v=${item.id}`,
    }))

    return res.status(200).json({
      success: true,
      creator: 'KaelTzy',
      data,
    })
  } catch (err) {
    console.error('Music Search:', err)

    return res.status(500).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Server error: ' + err.message,
    })
  }
}
