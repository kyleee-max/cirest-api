import { useState, useEffect } from 'react'
import Icon from './Icon'

const FREE_API_KEY = 'cimytech##key'
// TODO: ganti dengan nomor WA lu, format 62xxx (tanpa +, tanpa spasi)
const WA_NUMBER = '628386859765'
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo, mau tanya soal apikey unlimited Cirest Api')}`

export default function ApiKeyPopup() {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const seen = localStorage.getItem('cirest_seen_apikey_popup')
      if (!seen) {
        const t = setTimeout(() => setShow(true), 600)
        return () => clearTimeout(t)
      }
    } catch (e) {}
  }, [])

  const close = () => {
    setShow(false)
    try { localStorage.setItem('cirest_seen_apikey_popup', '1') } catch (e) {}
  }

  const copyKey = () => {
    navigator.clipboard.writeText(FREE_API_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  if (!show) return null

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && close()}>
      <div style={s.modal}>
        <button style={s.closeBtn} onClick={close}><Icon name="X" size={13} /></button>

        <div style={s.iconWrap}><Icon name="KeyRound" size={22} /></div>
        <h2 style={s.title}>Apikey Gratis Buat Lu</h2>
        <p style={s.sub}>Semua endpoint butuh apikey. Pake yang gratis ini, limitnya 80 request/jam (2/detik).</p>

        <div style={s.keyBox}>
          <span style={s.keyText}>{FREE_API_KEY}</span>
          <button style={{ ...s.copyBtn, display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={copyKey}>{copied ? <><Icon name="Check" size={12} /> Copied</> : <><Icon name="Copy" size={12} /> Copy</>}</button>
        </div>

        <div style={s.tierRow}>
          <div style={s.tierCard}>
            <div style={s.tierLabel}>Tanpa apikey</div>
            <div style={s.tierValue}>20/jam</div>
          </div>
          <div style={{ ...s.tierCard, border: '1px solid rgba(255,255,255,0.3)' }}>
            <div style={s.tierLabel}>Key gratis ini</div>
            <div style={s.tierValue}>80/jam</div>
          </div>
          <div style={s.tierCard}>
            <div style={s.tierLabel}>Key premium</div>
            <div style={{ ...s.tierValue, color: '#ffffff' }}>Unlimited</div>
          </div>
        </div>

        <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ ...s.waBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="MessageCircle" size={15} /> Mau Unlimited? Chat WA
        </a>
        <button style={s.dismissBtn} onClick={close}>Lanjut pake yang gratis</button>
      </div>
    </div>
  )
}

const s = {
  overlay: { position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'Plus Jakarta Sans, sans-serif' },
  modal: { width: '100%', maxWidth: 380, background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px 24px 24px', position: 'relative', textAlign: 'center', animation: 'popIn 0.25s ease' },
  closeBtn: { position: 'absolute', top: 14, right: 14, width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', color: '#9a9a9a', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 52, height: 52, margin: '0 auto 14px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 19, fontWeight: 900, color: '#f0f6fc', marginBottom: 8, letterSpacing: -0.3 },
  sub: { fontSize: 12.5, color: '#9a9a9a', lineHeight: 1.6, marginBottom: 18, padding: '0 4px' },
  keyBox: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 },
  keyText: { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#e5e5e5', fontWeight: 600 },
  copyBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 7, padding: '5px 11px', fontSize: 11.5, fontWeight: 700, color: '#fff', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' },
  tierRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 },
  tierCard: { background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 6px' },
  tierLabel: { fontSize: 10, color: '#7a7a7a', marginBottom: 4, lineHeight: 1.3 },
  tierValue: { fontSize: 13, fontWeight: 800, color: '#d0d0d0' },
  waBtn: { display: 'block', width: '100%', padding: '12px', background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', borderRadius: 10, color: '#0d1117', fontSize: 13.5, fontWeight: 800, textDecoration: 'none', marginBottom: 10, boxSizing: 'border-box' },
  dismissBtn: { background: 'none', border: 'none', color: '#7a7a7a', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', padding: 4 },
}
