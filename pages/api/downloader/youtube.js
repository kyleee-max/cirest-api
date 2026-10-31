import { getVideoInfo, splitFormats, mapVideoDetails } from '../../../lib/ytdlp'

// creator: KaelTzy

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).json({ success: false, creator: 'KaelTzy', message: 'Parameter url wajib diisi.' })

  if (!/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)[\w-]{11}/.test(url)) {
    return res.status(400).json({ success: false, creator: 'KaelTzy', message: 'URL YouTube tidak valid.' })
  }

  try {
    const info = await getVideoInfo(url)
    const formats = splitFormats(info.formats || [])

    // best merged pair (video-only + audio) for client-side merge
    const bestVideo = formats.videoOnly[0] || null
    const bestAudio = formats.audio[0] || null

    return res.status(200).json({
      success: true,
      creator: 'KaelTzy',
      data: {
        ...mapVideoDetails(info),
        formats: {
          video: formats.video,
          videoOnly: formats.videoOnly,
          audio: formats.audio,
        },
        recommended: {
          video: bestVideo,
          audio: bestAudio,
          note: 'Gabungkan video+audio pakai ffmpeg: ffmpeg -i video -i audio -c copy out.mp4',
        },
      },
    })
  } catch (err) {
    console.error('YouTube DL:', err)
    return res.status(500).json({ success: false, creator: 'KaelTzy', message: 'Server error: ' + err.message })
  }
}
