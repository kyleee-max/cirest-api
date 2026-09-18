import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

const AVATAR = '/logo.png'
const FREE_API_KEY = 'cimytech##key'
const WA_NUMBER = '628386859765' // TODO: ganti nomor WA lu
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo, mau tanya soal apikey unlimited Cirest Api')}`

const FAQS = [
  {
    q: 'Apa itu apikey dan kenapa wajib dipake?',
    a: `Setiap request ke endpoint Cirest Api butuh parameter "apikey" di URL. Ini buat ngatur rate limit per pengguna, biar server nggak overload dan semua orang kebagian jatah yang adil.`,
  },
  {
    q: 'Apa itu apikey gratis?',
    a: `Key publik "${FREE_API_KEY}" bisa dipake siapapun tanpa daftar. Tinggal tambahin ?apikey=${FREE_API_KEY} di setiap request lu.`,
  },
  {
    q: 'Berapa limitnya?',
    a: 'Tanpa apikey: 20 request/jam, maksimal 1 request/detik. Pake apikey gratis: 80 request/jam, maksimal 2 request/detik. Apikey premium: unlimited, nggak ada batas sama sekali.',
  },
  {
    q: 'Gimana cara pake apikey?',
    a: `Tambahin sebagai query parameter di setiap request, contoh:\nhttps://domain-lu.com/api/downloader/tiktok?url=...&apikey=${FREE_API_KEY}`,
  },
  {
    q: 'Kenapa request gue ditolak (429)?',
    a: 'Artinya lu udah kena rate limit tier yang lagi lu pake. Tunggu beberapa saat sampai limit reset, atau upgrade ke apikey dengan limit lebih tinggi / unlimited.',
  },
  {
    q: 'Gimana cara dapet apikey unlimited?',
    a: 'Chat langsung ke WA, nanti dikasih key premium yang nggak kena rate limit sama sekali.',
  },
]

function FaqItem({ item, index, open, onToggle }) {
  const isOpen = open === index
  return (
    <div style={s.item}>
      <button style={s.itemHead} onClick={() => onToggle(index)}>
        <span style={s.itemQ}>{item.q}</span>
        <span style={{ ...s.itemChevron, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>
      {isOpen && <div style={s.itemBody}>{item.a}</div>}
    </div>
  )
}

export default function Faq() {
  const router = useRouter()
  const [open, setOpen] = useState(0)
  const [copied, setCopied] = useState(false)

  const copyKey = () => {
    navigator.clipboard.writeText(FREE_API_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      <Head>
        <title>FAQ — Cirest Api</title>
        <meta name="description" content="Pertanyaan seputar apikey dan rate limit Cirest Api." />
        <link rel="icon" href={AVATAR} />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <nav style={s.nav}>
        <div style={s.navLogo} onClick={() => router.push('/')}>
          <img src={AVATAR} style={s.navAvatar} alt="Cirest Api" />
          <span style={s.navName}>Cirest Api</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={s.navBtn} onClick={() => router.push('/category')}>🗂️ Category</button>
          <button style={s.navBtn} onClick={() => router.push('/docs')}>📖 Docs</button>
        </div>
      </nav>

      <main style={s.main}>
        <div style={s.header}>
          <div style={s.eyebrow}><div style={s.eyebrowDot} />FAQ</div>
          <h1 style={s.title}>Apikey & Rate Limit</h1>
          <p style={s.sub}>Semua yang perlu lu tau soal pake apikey di Cirest Api.</p>
        </div>

        <div style={s.keyBanner}>
          <div>
            <div style={s.keyBannerLabel}>Apikey Gratis</div>
            <div style={s.keyBannerValue}>{FREE_API_KEY}</div>
          </div>
          <button style={s.copyBtn} onClick={copyKey}>{copied ? '✓ Copied' : '⧉ Copy'}</button>
        </div>

        <div style={s.faqList}>
          {FAQS.map((item, i) => (
            <FaqItem key={i} item={item} index={i} open={open} onToggle={(idx) => setOpen(open === idx ? -1 : idx)} />
          ))}
        </div>

        <div style={s.ctaBox}>
          <div style={s.ctaTitle}>Butuh apikey tanpa limit?</div>
          <p style={s.ctaSub}>Chat langsung, nanti dibantu setup key premium buat project lu.</p>
          <a href={WA_LINK} target="_blank" rel="noreferrer" style={s.waBtn}>💬 Chat WhatsApp</a>
        </div>

        <footer style={s.footer}>© 2026 Cirest Api · Made with ☕ in Indonesia</footer>
      </main>
    </>
  )
}

const s = {
  nav: { position: 'sticky', top: 0, zIndex: 100, padding: '0 16px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Plus Jakarta Sans, sans-serif' },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  navAvatar: { width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', objectFit: 'cover' },
  navName: { fontSize: 16, fontWeight: 800, color: '#f0f6fc' },
  navBtn: { padding: '8px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, fontSize: 12.5, fontWeight: 700, color: '#c8d3e0', cursor: 'pointer', fontFamily: 'inherit' },
  main: { background: '#0a0a0a', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' },
  header: { padding: '40px 20px 8px', textAlign: 'center' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 16 },
  eyebrowDot: { width: 6, height: 6, background: '#ffffff', borderRadius: '50%' },
  title: { fontSize: 30, fontWeight: 900, letterSpacing: -0.8, marginBottom: 10, background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { fontSize: 13.5, color: '#8b949e', maxWidth: 380, margin: '0 auto', lineHeight: 1.6 },
  keyBanner: { maxWidth: 560, margin: '24px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: '#121212', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px 18px' },
  keyBannerLabel: { fontSize: 11, color: '#8b949e', marginBottom: 3 },
  keyBannerValue: { fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 700, color: '#f0f6fc' },
  copyBtn: { background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12.5, fontWeight: 800, color: '#0d1117', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },
  faqList: { maxWidth: 560, margin: '24px auto 0', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  item: { background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' },
  itemHead: { width: '100%', background: 'none', border: 'none', padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  itemQ: { fontSize: 14, fontWeight: 700, color: '#e6edf3' },
  itemChevron: { color: '#8b949e', fontSize: 13, transition: 'transform 0.2s', flexShrink: 0, marginLeft: 10 },
  itemBody: { padding: '0 18px 16px', fontSize: 13, color: '#9a9a9a', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
  ctaBox: { maxWidth: 560, margin: '32px auto 0', padding: '28px 24px', textAlign: 'center', background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 },
  ctaTitle: { fontSize: 17, fontWeight: 800, color: '#f0f6fc', marginBottom: 6 },
  ctaSub: { fontSize: 12.5, color: '#8b949e', marginBottom: 16, lineHeight: 1.6 },
  waBtn: { display: 'inline-block', padding: '11px 28px', background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', borderRadius: 10, color: '#0d1117', fontSize: 13.5, fontWeight: 800, textDecoration: 'none' },
  footer: { padding: '40px 24px 28px', textAlign: 'center', fontSize: 12, color: '#484f58' },
}
