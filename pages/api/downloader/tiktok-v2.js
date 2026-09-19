const crypto = require('crypto');

const SNAP_TIK = 'https://snaptik.app';
const KEY_PREFIX = 'sn4pt1k_v3r1fy2026';

function solveChallenge(challenge) {
  switch (challenge.t) {
    case 'b':
      return ((challenge.a ^ challenge.b) >> challenge.s) & 255;

    case 'r':
      return challenge.n.reduce((sum, value) => sum + value, 0) * 2 + 1;

    case 'c':
      return challenge.w.charCodeAt(challenge.i) * challenge.m;

    case 'm':
      return ((challenge.a + challenge.b) % 100) * challenge.c;

    case 'n':
      return (
        challenge.a * challenge.b +
        challenge.b * challenge.c +
        challenge.c * challenge.a -
        challenge.a
      );

    default:
      throw new Error('Unknown challenge');
  }
}

function decryptChallenge(id, encrypted) {
  const raw = Buffer.from(encrypted, 'base64');

  const iv = raw.subarray(0, 16);
  const ciphertext = raw.subarray(16);

  const key = crypto
    .createHash('sha256')
    .update(`${KEY_PREFIX}:${id}`)
    .digest();

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8');
}

async function getVerify() {
  const tokenResponse = await fetch(`${SNAP_TIK}/api/token`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
  });

  if (!tokenResponse.ok) {
    throw new Error(`SnapTik token error: ${tokenResponse.status}`);
  }

  const token = await tokenResponse.json();

  const challenge = JSON.parse(
    decryptChallenge(token.id, token.p)
  );

  const e = challenge._e;
  const h = challenge._h;

  delete challenge._e;
  delete challenge._h;

  const result = solveChallenge(challenge);

  return `${token.id}:${result}:${e}:${h}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(400).json({
      success: false,
      message: 'Method request tidak valid.',
      creator: 'KaelTzy',
    });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Parameter url wajib diisi.',
      creator: 'KaelTzy',
    });
  }

  const isTikTok =
    /^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/.+/i.test(url);

  const isDouyin =
    /^https?:\/\/(www\.|v\.)?douyin\.com\/.+/i.test(url);

  if (!isTikTok && !isDouyin) {
    return res.status(400).json({
      success: false,
      message: 'URL TikTok tidak valid.',
      creator: 'KaelTzy',
    });
  }

  try {
    const verify = await getVerify();

    const extractResponse = await fetch(
      `${SNAP_TIK}/api/extract?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-Verify': verify,
        },
      }
    );

    if (!extractResponse.ok) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data dari SnapTik.',
        creator: 'KaelTzy',
      });
    }

    const data = await extractResponse.json();

    return res.status(200).json({
      success: true,
      creator: 'KaelTzy',
      data,
    });
  } catch (error) {
    console.error('TikTok Downloader V2:', error);

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses video TikTok.',
      creator: 'KaelTzy',
    });
  }
}
