import axios from 'axios'
import FormData from 'form-data'

// creator: KaelTzy
// Remove Background V2 — powered by iLoveIMG

const WORKERS = ['api4g.iloveimg.com', 'api6g.iloveimg.com']
const TOOL_PAGE = 'https://www.iloveimg.com/remove-background'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

async function getSession() {
  const html = await axios.get(TOOL_PAGE, {
    headers: { 'User-Agent': UA },
    timeout: 30000,
  }).then((r) => r.data)

  const token = html.match(/"token":"(eyJ[^"]+)"/)?.[1]
  const task = html.match(/ilovepdfConfig\.taskId\s*=\s*'([^']+)'/)?.[1]

  if (!token || !task) throw new Error('Gagal mengambil session iLoveIMG')
  return { token, task }
}

async function uploadFile(token, task, buffer, filename, contentType) {
  let lastErr

  for (const server of WORKERS) {
    try {
      const form = new FormData()
      form.append('task', task)
      form.append('preview', '1')
      form.append('v', '2.0.0')
      form.append('file', buffer, { filename, contentType })

      const res = await axios.post(`https://${server}/v1/upload`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          Origin: 'https://www.iloveimg.com',
          Referer: 'https://www.iloveimg.com/',
          'User-Agent': UA,
        },
        timeout: 60000,
      })

      if (res.data?.server_filename) {
        return { server: server.split('.')[0], serverFilename: res.data.server_filename }
      }
      lastErr = new Error('Upload tidak mengembalikan server_filename')
    } catch (e) {
      lastErr = e
    }
  }

  throw lastErr || new Error('Semua worker upload gagal')
}

async function removeBackground(token, task, server, serverFilename) {
  const form = new FormData()
  form.append('task', task)
  form.append('server_filename', serverFilename)

  const res = await axios.post(`https://${server}.iloveimg.com/v1/removebackground`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${token}`,
      Origin: 'https://www.iloveimg.com',
      Referer: 'https://www.iloveimg.com/',
      'User-Agent': UA,
    },
    timeout: 90000,
    responseType: 'arraybuffer',
    validateStatus: (s) => true,
  })

  const ct = res.headers['content-type'] || ''

  if (res.status !== 200 || !ct.startsWith('image/')) {
    const body = Buffer.from(res.data).toString()
    let msg = body
    try {
      const j = JSON.parse(body)
      msg = j.error?.message || j.message || body
    } catch {}
    throw new Error(`iLoveIMG ${res.status}: ${msg.slice(0, 200)}`)
  }

  return Buffer.from(res.data)
}

function guessFilename(url, contentType) {
  try {
    const p = url.split('?')[0]
    if (p.includes('.')) {
      const ext = p.split('.').pop().slice(0, 8)
      if (/^[a-z0-9]+$/i.test(ext)) return `image.${ext}`
    }
  } catch {}
  if (contentType?.includes('png')) return 'image.png'
  if (contentType?.includes('webp')) return 'image.webp'
  return 'image.jpg'
}

export default async function handler(req, res) {
  const { url } = req.query

  if (!url) return res.status(400).json({ success: false, creator: 'KaelTzy', message: 'Parameter url wajib diisi.' })

  try {
    // 1. Download image
    const dl = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000,
      maxRedirects: 5,
      headers: { 'User-Agent': UA },
    })

    const contentType = dl.headers['content-type'] || 'image/jpeg'
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ success: false, creator: 'KaelTzy', message: 'URL harus berupa gambar.' })
    }

    let buffer = Buffer.from(dl.data)

    // 2. Validasi limit guest iLoveIMG: 6 MB
    if (buffer.length > 6 * 1024 * 1024) {
      return res.status(400).json({ success: false, creator: 'KaelTzy', message: 'Gambar maksimal 6MB (limit guest iLoveIMG).' })
    }

    // 3. Session (token + taskId)
    const { token, task } = await getSession()

    // 4. Upload
    const filename = guessFilename(url, contentType)
    const { server, serverFilename } = await uploadFile(token, task, buffer, filename, contentType)

    // 5. Remove background → hasil PNG transparan
    const result = await removeBackground(token, task, server, serverFilename)

    // 6. Return image
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', 'inline; filename="removebg-v2-result.png"')
    res.setHeader('X-Creator', 'KaelTzy')
    res.setHeader('X-Powered-By', 'iLoveIMG')
    return res.status(200).send(result)
  } catch (err) {
    console.error('RemoveBG v2:', err.response?.data ? Buffer.from(err.response.data).toString().slice(0, 300) : err.message)
    return res.status(500).json({ success: false, creator: 'KaelTzy', message: 'Server error: ' + err.message })
  }
}
