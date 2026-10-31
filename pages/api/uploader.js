import axios from 'axios'
import FormData from 'form-data'
import Busboy from 'busboy'
import { getUploaderKey, UPLOADER_BASE } from '../../lib/uploaderKey'

// creator: KaelTzy
// POST /api/uploader  (multipart field "file")
// GET  /api/uploader?url=<remote-url>  → reupload file remote ke CDN

const MAX_SIZE = 50 * 1024 * 1024

async function uploadBuffer(buffer, filename, contentType) {
  const form = new FormData()
  form.append('file', buffer, {
    filename: filename || 'file.bin',
    contentType: contentType || 'application/octet-stream',
  })

  const res = await axios.post(`${UPLOADER_BASE}/upload`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${getUploaderKey()}`,
      'User-Agent': 'Mozilla/5.0',
    },
    timeout: 60000,
    maxBodyLength: MAX_SIZE,
    maxContentLength: MAX_SIZE,
  })

  return res.data
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const ct = req.headers['content-type'] || ''
    if (!ct.startsWith('multipart/form-data')) {
      return reject(new Error('Content-Type harus multipart/form-data'))
    }

    let parsed = false
    const bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_SIZE } })

    bb.on('file', (name, stream, info) => {
      const chunks = []
      stream.on('data', (c) => chunks.push(c))
      stream.on('limit', () => {
        stream.resume()
        if (!parsed) {
          parsed = true
          reject(new Error('File terlalu besar (maks 50MB)'))
        }
      })
      stream.on('end', () => {
        if (parsed) return
        parsed = true
        resolve({
          buffer: Buffer.concat(chunks),
          filename: info.filename,
          mimetype: info.mimeType,
        })
      })
    })

    bb.on('error', (e) => {
      if (!parsed) {
        parsed = true
        reject(e)
      }
    })

    bb.on('finish', () => {
      if (!parsed) {
        parsed = true
        reject(new Error('File tidak ditemukan di field "file"'))
      }
    })

    req.pipe(bb)
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { url } = req.query
    if (!url) {
      return res.status(400).json({
        success: false,
        creator: 'KaelTzy',
        message: 'Parameter url wajib diisi (atau pakai POST multipart).',
      })
    }

    try {
      const dl = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        maxRedirects: 5,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })

      const contentType = dl.headers['content-type'] || 'application/octet-stream'
      const urlPath = url.split('?')[0]
      const ext = urlPath.includes('.') ? urlPath.split('.').pop().slice(0, 8) : ''
      const filename = `remote.${ext || 'bin'}`

      const data = await uploadBuffer(Buffer.from(dl.data), filename, contentType)

      if (!data?.url) {
        throw new Error('Upload gagal: ' + JSON.stringify(data))
      }

      return res.status(200).json({
        success: true,
        creator: 'KaelTzy',
        data: {
          url: data.url,
          source: url,
          size: dl.data.length,
          type: contentType,
        },
      })
    } catch (err) {
      console.error('Uploader GET:', err.response?.data || err.message)
      return res.status(500).json({
        success: false,
        creator: 'KaelTzy',
        message: 'Server error: ' + (err.response?.data?.error || err.message),
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const file = await parseMultipart(req)
      if (!file?.buffer?.length) {
        return res.status(400).json({
          success: false,
          creator: 'KaelTzy',
          message: 'File kosong.',
        })
      }

      const data = await uploadBuffer(file.buffer, file.filename, file.mimetype)

      if (!data?.url) {
        throw new Error('Upload gagal: ' + JSON.stringify(data))
      }

      return res.status(200).json({
        success: true,
        creator: 'KaelTzy',
        data: {
          url: data.url,
          filename: file.filename,
          size: file.buffer.length,
          type: file.mimetype,
        },
      })
    } catch (err) {
      console.error('Uploader POST:', err.response?.data || err.message)
      return res.status(500).json({
        success: false,
        creator: 'KaelTzy',
        message: 'Server error: ' + (err.response?.data?.error || err.message),
      })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({
    success: false,
    creator: 'KaelTzy',
    message: 'Method not allowed.',
  })
}
