// Meta info (icon + short description) per kategori.
// Kategori baru yang belum ada di sini otomatis pakai fallback di bawah.

const categoryMeta = {
  Downloader: { icon: '📥', desc: 'Download video, audio, dan media dari berbagai platform.' },
  Hastag: { icon: '#️⃣', desc: 'Info dan statistik hashtag dari media sosial.' },
  Tools: { icon: '🛠️', desc: 'Kumpulan tools serbaguna: edit, upscale, convert, dan lainnya.' },
  Stalker: { icon: '🕵️', desc: 'Cek info profil & statistik akun media sosial.' },
  AI: { icon: '🤖', desc: 'Text generation, image processing, dan fitur AI lainnya.' },
  Anime: { icon: '🎌', desc: 'Info, gambar, dan konten seputar anime.' },
  Search: { icon: '🔍', desc: 'Pencarian data dari berbagai sumber.' },
  Maker: { icon: '🎨', desc: 'Bikin gambar, teks, atau konten custom secara otomatis.' },
  Random: { icon: '🎲', desc: 'Konten acak: gambar, quote, fakta, dan lainnya.' },
  Games: { icon: '🎮', desc: 'Mini game dan fitur interaktif seru.' },
  Primbon: { icon: '🔮', desc: 'Ramalan, primbon, dan hitungan tradisional.' },
  Uploader: { icon: '☁️', desc: 'Upload file dan dapatkan link langsung.' },
}

const FALLBACK = { icon: '📦', desc: 'Kumpulan endpoint siap pakai di kategori ini.' }

export function getCategoryMeta(name) {
  return categoryMeta[name] || FALLBACK
}

export default categoryMeta
