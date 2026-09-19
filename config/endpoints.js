// Config semua endpoint — docs page auto-baca file ini
// creator: KaelTzy

const endpoints = [
  {
    category: 'Downloader',
    name: 'TikTok Downloader V2',
    status: 'ready',
    desc: 'Download video TikTok tanpa watermark beserta info lengkap.',
    path: '/api/downloader/tiktok-v2',
    method: 'GET',
    params: [
      {
        key: 'url',
        desc: 'URL video TikTok',
        placeholder: 'https://vt.tiktok.com/xxx',
      },
    ],
  },

  {
    category: 'Downloader',
    name: 'YouTube Downloader V2',
    status: 'ready',
    desc: 'Download video atau audio YouTube melalui provider alternatif.',
    path: '/api/downloader/youtube-v2',
    method: 'GET',
    params: [
      { key: 'url', desc: 'URL video YouTube', placeholder: 'https://www.youtube.com/watch?v=xxx' },
      {
        key: 'type',
        type: 'select',
        desc: 'Jenis download',
        options: [
          { label: 'Audio', value: 'audio' },
          { label: 'Video', value: 'video' },
        ],
      },
      { key: 'quality', desc: 'Kualitas audio/video', placeholder: '128kbps / 360 / 720' },
    ],
  },

  // ─── DOWNLOADER ───
  {
    category: 'Downloader',
    name: 'TikTok Downloader',
    status: 'ready',
    desc: 'Download video TikTok tanpa watermark beserta info lengkap.',
    path: '/api/downloader/tiktok',
    method: 'GET',
    params: [
      { key: 'url', desc: 'URL video TikTok', placeholder: 'https://vt.tiktok.com/xxx' }
    ],
  },
  {
    category: 'Downloader',
    name: 'YouTube Downloader',
    status: 'ready',
    desc: 'Download video YouTube berbagai kualitas + audio MP3. Powered by ytdl-core.',
    path: '/api/downloader/youtube',
    method: 'GET',
    params: [
      { key: 'url', desc: 'URL video YouTube', placeholder: 'https://youtu.be/xxx' }
    ],
  },

  // ─── HASTAG ───
  {
    category: 'Hastag',
    name: 'TikTok Hashtag Info',
    status: 'ready',
    desc: 'Info lengkap hashtag TikTok — total video, total views, dan detail challenge.',
    path: '/api/hastag/tiktok',
    method: 'GET',
    params: [
      { key: 'tag', desc: 'Nama hashtag (tanpa #)', placeholder: 'fyp' }
    ],
  },
// ─── TOOLS ───
  {
    category: 'Tools',
    name: 'Image HD Upscaler',
    status: 'ready',
    desc: 'Perbesar resolusi gambar jadi HD menggunakan AI. Powered by iLoveIMG.',
    path: '/api/tools/hd',
    method: 'GET',
    params: [
      { key: 'url', desc: 'URL gambar yang mau di-upscale', placeholder: 'https://example.com/image.jpg' },
      { key: 'scale', desc: 'Skala upscale: 2 atau 4 (default: 2)', placeholder: '2' }
    ],
  },
{
    category: 'Tools',
    name: 'Remove Background',
    status: 'ready',
    desc: 'Hapus background foto secara otomatis dengan AI. Output PNG transparan. Powered by Pixelcut.',
    path: '/api/tools/removebg',
    method: 'GET',
    params: [
      { key: 'url', desc: 'URL gambar yang mau dihapus backgroundnya', placeholder: 'https://example.com/photo.jpg' }
    ],
  },
// ─── STALKER ───
  {
    category: 'Stalker',
    name: 'TikTok User Info',
    status: 'ready',
    desc: 'Info profil lengkap user TikTok — followers, following, likes, total video, dan statistik.',
    path: '/api/stalker/tiktok',
    method: 'GET',
    params: [
      { key: 'username', desc: 'Username TikTok (tanpa @)', placeholder: 'charlidamelio' }
    ],
  },
  {
    category: 'Search',
    name: 'Music Search',
    status: 'ready',
    desc: 'Cari musik YouTube berdasarkan kata kunci.',
    path: '/api/search/music',
    method: 'GET',
    params: [
      {
        key: 'q',
        desc: 'Kata kunci pencarian musik',
        placeholder: 'The Weeknd',
      },
    ],
  },
  {
    category: 'Sticker',
    name: 'S-Meme',
    status: 'ready',
    desc: 'Buat meme dari gambar dengan teks atas dan bawah.',
    path: '/api/sticker/smeme',
    method: 'GET',
    params: [
      {
        key: 'image',
        desc: 'URL gambar untuk background meme',
        placeholder: 'https://example.com/image.jpg',
      },
      {
        key: 'top',
        desc: 'Teks bagian atas',
        placeholder: 'Ketika coding lancar',
      },
      {
        key: 'bottom',
        desc: 'Teks bagian bawah',
        placeholder: 'Tidak ada error',
      },
    ],
  },
  {
    category: 'Search',
    name: 'Pinterest Search',
    status: 'ready',
    desc: 'Cari gambar Pinterest berdasarkan kata kunci.',
    path: '/api/search/pinterest',
    method: 'GET',
    params: [
      {
        key: 'q',
        desc: 'Kata kunci pencarian Pinterest',
        placeholder: 'anime',
      },
    ],
  },
  {
    category: 'Stalker',
    name: 'YouTube Stalker',
    status: 'ready',
    desc: 'Cek informasi channel YouTube berdasarkan username, handle, ID, atau URL.',
    path: '/api/stalker/youtube',
    method: 'GET',
    params: [
      {
        key: 'channel',
        desc: 'Username, handle, channel ID, atau URL YouTube',
        placeholder: '@MrBeast',
      },
    ],
  },
]
export default endpoints
