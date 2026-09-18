import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import endpoints from '../../config/endpoints'
import { getCategoryMeta } from '../../lib/categoryMeta'
import { AVATAR, Particles, EpCard, EndpointModal } from '../../components/ApiExplorer'

function slugify(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-')
}

export async function getStaticPaths() {
  const cats = [...new Set(endpoints.map(ep => ep.category))]
  return {
    paths: cats.map(name => ({ params: { slug: slugify(name) } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const category = endpoints.find(ep => slugify(ep.category) === params.slug)?.category || null
  if (!category) return { notFound: true }
  const eps = endpoints.filter(ep => ep.category === category)
  return { props: { category, eps } }
}

export default function CategoryDetail({ category, eps }) {
  const router = useRouter()
  const [modal, setModal] = useState(null)
  const meta = getCategoryMeta(category)

  return (
    <>
      <Head>
        <title>{`Cirest Api — ${category}`}</title>
        <link rel="icon" href={AVATAR} />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <Particles />

      <nav style={s.nav}>
        <div style={s.navLogo} onClick={() => router.push('/')}>
          <img src={AVATAR} style={s.navAvatar} alt="Cirest Api" />
        </div>
        <button style={s.backBtn} onClick={() => router.push('/category')}>← All Categories</button>
      </nav>

      <main style={s.main}>
        <div style={s.header}>
          <div style={s.iconWrap}>{meta.icon}</div>
          <h1 style={s.title}>{category}</h1>
          <p style={s.sub}>{meta.desc}</p>
          <div style={s.countBadge}>{eps.length} endpoints</div>
        </div>

        <div style={s.epList}>
          {eps.map((ep, i) => (
            <EpCard key={ep.path} ep={ep} index={i} onClick={() => setModal(ep)} />
          ))}
        </div>

        <footer style={s.footer}>© 2026 Cirest Api · Made with ☕ in Indonesia</footer>
      </main>

      <EndpointModal ep={modal} onClose={() => setModal(null)} />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { from{opacity:0;transform:scale(0.96) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
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
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Plus Jakarta Sans, sans-serif' },
  navLogo: { cursor: 'pointer', flexShrink: 0 },
  navAvatar: { width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', objectFit: 'cover', display: 'block' },
  backBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, color: '#c8d3e0', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' },
  main: { paddingTop: 56, background: '#0a0a0a', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif', position: 'relative', zIndex: 1 },
  header: { padding: '36px 16px 8px', textAlign: 'center' },
  iconWrap: { width: 56, height: 56, margin: '0 auto 14px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 },
  title: { fontSize: 28, fontWeight: 900, letterSpacing: -0.6, marginBottom: 8, background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { fontSize: 13, color: '#8b949e', maxWidth: 360, margin: '0 auto 14px', lineHeight: 1.6 },
  countBadge: { display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#8b949e', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '5px 12px' },
  epList: { padding: '28px 16px 100px', maxWidth: 620, margin: '0 auto' },
  footer: { padding: '28px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: '#484f58' },
}
