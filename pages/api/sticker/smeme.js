import { logRequest } from '../../../lib/logger'

// creator: KaelTzy

export default async function handler(req, res) {
  logRequest(req)

  const { image, top = '', bottom = '' } = req.query

  if (!image) {
    return res.status(400).json({
      success: false,
      creator: 'KaelTzy',
      message: 'Parameter image wajib diisi.',
    })
  }

  try {
    const imageUrl = new URL(image)

    if (!['http:', 'https:'].includes(imageUrl.protocol)) {
      return res.status(400).json({
        success: false,
        creator: 'KaelTzy',
        message: 'URL image tidak valid.',
      })
    }

    const params = new URLSearchParams()
    params.set('background', image)

    const textTop = String(top).trim()
    const textBottom = String(bottom).trim()

    const encodeText = (text) =>
      text
        .replace(/_/g, '__')
        .replace(/-/g, '--')
        .replace(/\?/g, '~q')
        .replace(/&/g, '~a')
        .replace(/%/g, '~p')
        .replace(/#/g, '~h')
        .replace(/\//g, '~s')
        .replace(/\\/g, '~b')
        .replace(/</g, '~g')
        .replace(/>/g, '~l')
        .replace(/"/g, "''")
        .replace(/\n/g, '~n')
        .replace(/ /g, '_')

    const topText = textTop ? encodeText(textTop) : '_'
    const bottomText = textBottom ? encodeText(textBottom) : '_'

    const url = `https://api.memegen.link/images/custom/${topText}/${bottomText}.png?${params.toString()}`

    return res.status(200).json({
      success: true,
      creator: 'KaelTzy',
      data: {
        url,
      },
    })
  } catch (err) {
    console.error('S-Meme:', err)

    return res.status(400).json({
      success: false,
      creator: 'KaelTzy',
      message: 'URL image tidak valid.',
    })
  }
}
