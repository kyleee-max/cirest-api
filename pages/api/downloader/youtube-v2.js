import { getVideoInfo, pickVideo, pickAudio, mapVideoDetails } from '../../../lib/ytdlp'

// creator: KaelTzy

function formatSize(bytes) {
  const n = parseInt(bytes, 10)
  if (!Number.isFinite(n) || n <= 0) return null
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

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

  if (!/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)[\w-]{11}/.test(url)) {
    return res.status(400).json({
      success: false,
      creator: 'KaelTzy',
      message: 'URL YouTube tidak valid.',
    })
  }

  try {
    const info = await getVideoInfo(url)
    const formats = info.formats || []

    let picked
    let audioPair = null

    if (type === 'video') {
      picked = pickVideo(formats, quality)
      // if picked is video-only, also give best audio for merge
      if (picked && !(picked.acodec && picked.acodec !== 'none')) {
        audioPair = pickAudio(formats)
      }
    } else {
      picked = pickAudio(formats, quality)
    }

    if (!picked) {
      return res.status(404).json({
        success: false,
        creator: 'KaelTzy',
        message: `Format ${type} tidak ditemukan.`,
      })
    }

    const details = mapVideoDetails(info)

    return res.status(200).json({
      success: true,
      creator: 'KaelTzy',
      data: {
        id: details.id,
        title: details.title,
        duration: details.duration,
        thumbnail: details.thumbnail,
        uploader: details.uploader,
        type,
        format: {
          itag: picked.format_id,
          ext: picked.ext,
          resolution: picked.resolution,
          quality: picked.resolution || picked.format_note,
          abr: picked.abr || null,
          tbr: picked.tbr || null,
          vcodec: picked.vcodec && picked.vcodec !== 'none' ? picked.vcodec : null,
          acodec: picked.acodec && picked.acodec !== 'none' ? picked.acodec : null,
          filesize: picked.filesize || picked.filesize_approx || null,
          size: formatSize(picked.filesize || picked.filesize_approx),
        },
        url: picked.url,
        // kalau video-only, sertakan audio pair buat merge
        ...(audioPair
          ? {
              audioPair: {
                itag: audioPair.format_id,
                ext: audioPair.ext,
                abr: audioPair.abr,
                url: audioPair.url,
              },
              note: 'Format ini video-only. Download audioPair juga lalu merge: ffmpeg -i video -i audio -c copy out.mp4',
            }
          : {}),
      },
    })
  } catch (err) {
    console.error('YouTube DL v2:', err)
    return res.status(500).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Server error: ' + err.message,
    })
  }
}
