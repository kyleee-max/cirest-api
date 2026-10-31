// Key uploader file.kaelzyy.web.id — disamarkan, jangan taruh plaintext di source.
// Prioritas: env UPLOADER_KEY (Vercel) → fallback obfuscated.

const XOR_BYTE = 0x5a
const OBF = 'DwACMAx3Em0cLyBgCis3'

function decodeObf(b64) {
  return Buffer.from(b64, 'base64')
    .map((b) => b ^ XOR_BYTE)
    .toString()
}

export function getUploaderKey() {
  if (process.env.UPLOADER_KEY) return process.env.UPLOADER_KEY
  return decodeObf(OBF)
}

export const UPLOADER_BASE = 'https://file.kaelzyy.web.id'
