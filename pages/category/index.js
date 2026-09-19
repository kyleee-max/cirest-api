import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import endpoints from '../../config/endpoints'
import { getCategoryMeta } from '../../lib/categoryMeta'
import { AVATAR, Particles, useScrollReveal } from '../../components/ApiExplorer'
import Icon from '../../components/Icon'

function slugify(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-')
}

const grouped = endpoints.reduce((acc, ep) => {
  if (!acc[ep.category]) acc[ep.category] = []
  acc[ep.category].push(ep)
  return acc
}, {})

const categories = Object.entries(grouped).map(([name, eps]) => ({
  name,
  slug: slugify(name),
  count: eps.length,
  ...getCategoryMeta(name),
}))

function CategoryCard({ cat, index }) {
  const [ref, visible] = useScrollReveal()
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  return (
    <div
      ref={ref}
      onClick={() => router.push(`/category/${cat.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#1c1c1e' : '#121212',
        border: hovered ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '20px 20px 18px', cursor: 'pointer',
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        opacity: visible ? 1 : 0,
        transition: `transform 0.4s ease ${index * 0.05}s, opacity 0.4s ease ${index * 0.05}s, background 0.2s, border 0.2s, box-shadow 0.2s`,
        boxShadow: hovered ? '0 8px 24px rgba(255,255,255,0.08)' : 'none',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, background: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)', transition: 'background 0.2s',
        }}><Icon name={cat.icon} size={22} /></div>
        <div style={{
          fontSize: 11, fontWeight: 800, color: '#8b949e', fontFamily: 'JetBrains Mono, monospace',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '4px 10px',
        }}>{cat.count} endpoints</div>
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, color: hovered ? '#f0f6fc' : '#e6edf3', marginBottom: 5, transition: 'color 0.2s' }}>{cat.name}</div>
        <div style={{ fontSize: 12.5, color: '#8b949e', lineHeight: 1.55 }}>{cat.desc}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: hovered ? '#ffffff' : '#484f58', transition: 'color 0.2s' }}>
        Explore <span style={{ transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s', display: 'inline-flex' }}><Icon name="ArrowRight" size={13} /></span>
      </div>
    </div>
  )
}

export default function CategoryIndex() {
  const router = useRouter()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <Head>
        <title>Cirest Api — Category</title>
        <meta name="description" content="Jelajahi seluruh kategori endpoint Cirest Api." />
        <link rel="icon" href={AVATAR} />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <Particles />

      <nav style={s.nav}>
        <div style={s.navLogo} onClick={() => router.push('/')}>
          <img src={AVATAR} style={s.navAvatar} alt="Cirest Api" />
          <span style={s.navName}>Cirest Api</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/faq" style={{ ...s.navDocsBtn, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="HelpCircle" size={14} color="#0d1117" /> FAQ</Link>
          <Link href="/docs" style={{ ...s.navDocsBtn, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="BookOpen" size={14} color="#0d1117" /> Docs</Link>
        </div>
      </nav>

      <main style={s.main}>
        <div style={s.header}>
          <div style={s.eyebrow}><div style={s.eyebrowDot} />Category</div>
          <h1 style={s.title}>Available Endpoints</h1>
          <p style={s.sub}>Pilih kategori buat lihat seluruh endpoint yang tersedia di dalamnya.</p>
        </div>

        <div style={s.grid}>
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>

        <footer style={s.footer}>© 2026 Cirest Api · Made with <Icon name="Coffee" size={12} style={{ margin: '0 2px' }} /> in Indonesia</footer>
      </main>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }
      `}</style>
    </>
  )
}

const s = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 16px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Plus Jakarta Sans, sans-serif' },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  navAvatar: { width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', objectFit: 'cover' },
  navName: { fontSize: 16, fontWeight: 800, color: '#f0f6fc' },
  navDocsBtn: { padding: '8px 16px', background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, color: '#0a0a0a', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
  main: { paddingTop: 58, background: '#0a0a0a', minHeight: '100vh', position: 'relative', zIndex: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' },
  header: { padding: '40px 20px 8px', textAlign: 'center' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 16 },
  eyebrowDot: { width: 6, height: 6, background: '#ffffff', borderRadius: '50%', animation: 'blink 2s infinite' },
  title: { fontSize: 30, fontWeight: 900, letterSpacing: -0.8, marginBottom: 10, background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { fontSize: 13.5, color: '#8b949e', maxWidth: 380, margin: '0 auto 8px', lineHeight: 1.6 },
  grid: { padding: '24px 16px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, maxWidth: 1100, margin: '0 auto' },
  footer: { padding: '28px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: '#484f58' },
}
