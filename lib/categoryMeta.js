// Meta info (icon + short description) per kategori.
// icon = nama komponen Lucide (lihat components/Icon.js), bukan emoji.
// Kategori baru yang belum ada di sini otomatis pakai fallback di bawah.

const categoryMeta = {
  Downloader: { icon: 'Download', desc: 'Download video, audio, dan media dari berbagai platform.' },
  Hastag: { icon: 'Hash', desc: 'Info dan statistik hashtag dari media sosial.' },
  Tools: { icon: 'Wrench', desc: 'Kumpulan tools serbaguna: edit, upscale, convert, dan lainnya.' },
  Stalker: { icon: 'UserSearch', desc: 'Cek info profil & statistik akun media sosial.' },
  AI: { icon: 'Bot', desc: 'Text generation, image processing, dan fitur AI lainnya.' },
  Anime: { icon: 'Sparkles', desc: 'Info, gambar, dan konten seputar anime.' },
  Search: { icon: 'Search', desc: 'Pencarian data dari berbagai sumber.' },
  Maker: { icon: 'Palette', desc: 'Bikin gambar, teks, atau konten custom secara otomatis.' },
  Random: { icon: 'Dices', desc: 'Konten acak: gambar, quote, fakta, dan lainnya.' },
  Games: { icon: 'Gamepad2', desc: 'Mini game dan fitur interaktif seru.' },
  Primbon: { icon: 'Moon', desc: 'Ramalan, primbon, dan hitungan tradisional.' },
  Uploader: { icon: 'Cloud', desc: 'Upload file dan dapatkan link langsung.' },
}

const FALLBACK = { icon: 'Package', desc: 'Kumpulan endpoint siap pakai di kategori ini.' }

export function getCategoryMeta(name) {
  return categoryMeta[name] || FALLBACK
}

export default categoryMeta
