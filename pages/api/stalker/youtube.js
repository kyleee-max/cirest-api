import axios from 'axios'
import { logRequest } from '../../../lib/logger'

// creator: KaelTzy

function extractYtInitialData(html) {
  const match = html.match(
    /var ytInitialData = ({.*?});<\/script>/
  )

  if (!match) return null

  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

function findTextByKey(obj, key) {
  if (!obj || typeof obj !== 'object') return null

  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key]
  }

  for (const value of Object.values(obj)) {
    const result = findTextByKey(value, key)
    if (result !== null) return result
  }

  return null
}

function findRunsText(obj) {
  if (!obj || typeof obj !== 'object') return null

  if (Array.isArray(obj.runs)) {
    return obj.runs.map((run) => run?.text || '').join('')
  }

  for (const value of Object.values(obj)) {
    const result = findRunsText(value)
    if (result !== null) return result
  }

  return null
}

function findThumbnails(obj) {
  if (!obj || typeof obj !== 'object') return []

  if (Array.isArray(obj.thumbnails)) {
    return obj.thumbnails
      .filter((item) => item?.url)
      .map((item) => ({
        url: item.url,
        width: item.width,
        height: item.height,
      }))
  }

  for (const value of Object.values(obj)) {
    const result = findThumbnails(value)

    if (result.length) return result
  }

  return []
}

export default async function handler(req, res) {
  logRequest(req)

  const { channel } = req.query

  if (!channel) {
    return res.status(400).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Parameter channel wajib diisi.',
    })
  }

  try {
    let input = String(channel).trim()
    let url

    if (/^https?:\/\//i.test(input)) {
      url = input
    } else if (/^UC[\w-]{20,}$/i.test(input)) {
      url = `https://www.youtube.com/channel/${input}`
    } else {
      if (!input.startsWith('@')) input = `@${input}`
      url = `https://www.youtube.com/${input}`
    }

    const response = await axios.get(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/133.0.0.0 Safari/537.36',
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
      },
      timeout: 15_000,
    })

    const html = response.data

    const data = extractYtInitialData(html)

    if (!data) {
      return res.status(500).json({
        success: false,
        creator: 'KaelTzy',
        message: 'Data channel YouTube tidak ditemukan.',
      })
    }

    const metadata = findTextByKey(
      data,
      'channelMetadataRenderer'
    )

    const header = findTextByKey(
      data,
      'c4TabbedHeaderRenderer'
    )

    const channelId =
      metadata?.externalId ||
      header?.channelId ||
      null

    const title =
      metadata?.title ||
      header?.title ||
      findTextByKey(data, 'title') ||
      null

    const handle =
      metadata?.vanityChannelUrl?.split('/').pop() ||
      null

    const description =
      metadata?.description ||
      findTextByKey(data, 'description') ||
      null

    const avatar =
      header?.avatar?.thumbnails ||
      metadata?.avatar?.thumbnails ||
      findThumbnails(data)

    const banner =
      header?.banner?.thumbnails ||
      metadata?.banner?.thumbnails ||
      []

    const subscriberText =
      header?.subscriberCountText?.simpleText ||
      findTextByKey(data, 'subscriberCountText') ||
      null

    const videoCountText =
      header?.videosCountText?.runs?.map((run) => run.text).join('') ||
      findTextByKey(data, 'videosCountText') ||
      null

    const keywords =
      metadata?.keywords || null

    const isFamilySafe =
      metadata?.familySafe === true

    const subscriberMatch = html.match(
      /"subscriberCountText":\{"simpleText":"([^"]+)"/
    )

    const videoMatch = html.match(
      /"videosCountText":\{"runs":\[\{"text":"([^"]+)"/
    )

    return res.status(200).json({
      success: true,
      creator: 'KaelTzy',
      data: {
        id: channelId,
        name: title,
        handle,
        description,
        avatar,
        banner,
        url: channelId
          ? `https://www.youtube.com/channel/${channelId}`
          : url,
        subscribers:
          subscriberText ||
          subscriberMatch?.[1] ||
          null,
        videos:
          videoCountText ||
          videoMatch?.[1] ||
          null,
        familySafe: isFamilySafe,
        keywords,
      },
    })
  } catch (err) {
    console.error('YouTube Stalker:', err)

    return res.status(500).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Gagal mengambil data channel YouTube: ' + err.message,
    })
  }
}
