import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import os from 'os'
import YtDlpWrap from 'yt-dlp-wrap-plus'

// creator: KaelTzy

const execFileAsync = promisify(execFile)

let cachedBin = null
let wrapInstance = null

async function resolveBinary() {
  if (cachedBin) return cachedBin

  // 1) system yt-dlp
  try {
    await execFileAsync('yt-dlp', ['--version'], { timeout: 10000 })
    cachedBin = 'yt-dlp'
    return cachedBin
  } catch {}

  // 2) bundled / downloaded binary
  const binDir = path.join(os.tmpdir(), 'yt-dlp-bin')
  const binPath = path.join(binDir, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp')

  if (fs.existsSync(binPath)) {
    cachedBin = binPath
    return cachedBin
  }

  fs.mkdirSync(binDir, { recursive: true })
  await YtDlpWrap.downloadFromGithub(binPath)
  try {
    fs.chmodSync(binPath, 0o755)
  } catch {}

  cachedBin = binPath
  return cachedBin
}

async function getYtDlp() {
  const bin = await resolveBinary()
  if (!wrapInstance || wrapInstance.__bin !== bin) {
    wrapInstance = new YtDlpWrap(bin)
    wrapInstance.__bin = bin
  }
  return wrapInstance
}

export async function getVideoInfo(url, extraArgs = []) {
  const ytdlp = await getYtDlp()
  const raw = await ytdlp.execPromise([
    '--no-download',
    '--no-warnings',
    '--skip-download',
    '--dump-single-json',
    ...extraArgs,
    url,
  ])
  return JSON.parse(raw)
}

function hasVideo(f) {
  return f.vcodec && f.vcodec !== 'none'
}

function hasAudio(f) {
  return f.acodec && f.acodec !== 'none'
}

function isHttp(f) {
  return f.protocol === 'https' || f.protocol === 'http' || !f.protocol
}

function mapFormat(f) {
  const size = f.filesize || f.filesize_approx || null
  return {
    itag: f.format_id,
    ext: f.ext,
    resolution: f.resolution,
    fps: f.fps || null,
    vcodec: f.vcodec && f.vcodec !== 'none' ? f.vcodec : null,
    acodec: f.acodec && f.acodec !== 'none' ? f.acodec : null,
    tbr: f.tbr || null,
    abr: f.abr || null,
    filesize: size,
    filesizeHuman: size ? `${(size / (1024 * 1024)).toFixed(2)} MB` : null,
    protocol: f.protocol,
    url: f.url || null,
  }
}

export function splitFormats(formats) {
  const playable = formats.filter(f => f.url && isHttp(f))

  const videoOnly = playable.filter(f => hasVideo(f) && !hasAudio(f))
  const audioOnly = playable.filter(f => !hasVideo(f) && hasAudio(f))
  const combined = playable.filter(f => hasVideo(f) && hasAudio(f))

  const byRes = (a, b) => (b.tbr || 0) - (a.tbr || 0)

  return {
    video: combined.sort(byRes).map(mapFormat),
    videoOnly: videoOnly.sort(byRes).map(mapFormat),
    audio: audioOnly.sort((a, b) => (b.abr || 0) - (a.abr || 0)).map(mapFormat),
  }
}

export function pickVideo(formats, quality) {
  const wanted = quality ? String(quality).replace(/p$/i, '') : null

  let candidates = formats.filter(f => hasVideo(f) && f.url && isHttp(f))

  if (wanted) {
    const exact = candidates.filter(f => {
      const res = (f.resolution || '').split('x')[1]
      return res === wanted || f.format_note === wanted || String(f.height) === wanted
    })
    if (exact.length) candidates = exact
  }

  // prefer mp4 + has audio if any, else best tbr video-only
  const combined = candidates.filter(f => hasAudio(f))
  if (combined.length) {
    return combined.sort((a, b) => (b.tbr || 0) - (a.tbr || 0))[0]
  }

  return candidates.sort((a, b) => (b.tbr || 0) - (a.tbr || 0))[0] || null
}

export function pickAudio(formats, quality) {
  let candidates = formats.filter(f => hasAudio(f) && !hasVideo(f) && f.url && isHttp(f))

  const kbps = quality ? parseInt(String(quality).replace(/kbps/i, ''), 10) : null

  if (kbps) {
    const under = candidates
      .filter(f => (f.abr || 0) <= kbps)
      .sort((a, b) => (b.abr || 0) - (a.abr || 0))
    if (under.length) candidates = under
  }

  // prefer m4a/aac over webm/opus for compatibility
  const preferred = candidates.filter(f => f.ext === 'm4a' || (f.acodec || '').startsWith('mp4a'))
  if (preferred.length) {
    return preferred.sort((a, b) => (b.abr || 0) - (a.abr || 0))[0]
  }

  return candidates.sort((a, b) => (b.abr || 0) - (a.abr || 0))[0] || null
}

export function mapVideoDetails(info) {
  return {
    id: info.id,
    title: info.title,
    description: info.description,
    duration: info.duration,
    thumbnail: info.thumbnail,
    uploader: info.uploader,
    channel: info.channel_url || info.uploader_url,
    view_count: info.view_count,
    like_count: info.like_count,
    upload_date: info.upload_date,
  }
}
