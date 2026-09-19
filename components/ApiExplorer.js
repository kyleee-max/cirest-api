import { useState, useEffect, useRef } from 'react'
import Icon from './Icon'

export const AVATAR = '/logo.png'

export function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

export function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i, size: Math.random() * 3 + 1, x: Math.random() * 100,
    delay: Math.random() * 8, duration: Math.random() * 10 + 12, opacity: Math.random() * 0.4 + 0.1,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', width: p.size, height: p.size, background: '#ffffff',
          borderRadius: '50%', left: `${p.x}%`, bottom: '-10px', opacity: p.opacity,
          animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
        }} />
      ))}
    </div>
  )
}

export function EpCard({ ep, index, onClick }) {
  const [ref, visible] = useScrollReveal()
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#1c1c1e' : '#121212',
        border: hovered ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: '16px 18px', marginBottom: 10, cursor: 'pointer',
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        opacity: visible ? 1 : 0,
        transition: `transform 0.4s ease ${index * 0.06}s, opacity 0.4s ease ${index * 0.06}s, background 0.2s, border 0.2s, box-shadow 0.2s`,
        boxShadow: hovered ? '0 8px 24px rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 5, color: hovered ? '#f0f6fc' : '#e6edf3', transition: 'color 0.2s' }}>{ep.name}</div>
      <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.5, marginBottom: 14 }}>{ep.desc}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: hovered ? 'linear-gradient(135deg, #ffffff, #e2e8f0)' : 'linear-gradient(135deg, #e5e5e5, #ffffff)',
          borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: '#fff',
          fontFamily: 'JetBrains Mono, monospace', transition: 'background 0.2s',
        }}><Icon name="Code2" size={12} /> {ep.method || 'GET'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: ep.status === 'error' ? '#f87171' : '#10b981' }}>
          <div style={{ width: 8, height: 8, background: ep.status === 'error' ? '#f87171' : '#10b981', borderRadius: '50%', animation: ep.status === 'error' ? 'none' : 'blink 2s infinite' }} />
          {ep.status === 'error' ? 'Error' : 'Ready'}
        </div>
      </div>
    </div>
  )
}

export function EndpointModal({ ep, onClose }) {
  const [params, setParams] = useState({})
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  useEffect(() => { setParams({ apikey: 'cimytech##key' }); setResponse(null); setLoading(false) }, [ep])

  if (!ep) return null

  const getUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const q = ep.params.map(p => `${p.key}=${encodeURIComponent(params[p.key] || p.placeholder || '')}`).join('&')
    return `${origin}${ep.path}?${q}${q ? '&' : ''}apikey=${encodeURIComponent(params.apikey || '')}`
  }

  const sendRequest = async () => {
    setLoading(true); setResponse(null)
    const q = ep.params.map(p => params[p.key] ? `${p.key}=${encodeURIComponent(params[p.key])}` : '').filter(Boolean).join('&')
    try {
      const res = await fetch(`${window.location.origin}${ep.path}?${q}${q ? '&' : ''}apikey=${encodeURIComponent(params.apikey || '')}`)
      const contentType = res.headers.get('content-type') || ''
      if (contentType.startsWith('image/')) {
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        setResponse({ ok: true, isImage: true, blobUrl, contentType })
      } else {
        const data = await res.json()
        setResponse({ ok: data.success, isImage: false, data })
      }
    } catch (e) {
      setResponse({ ok: false, isImage: false, data: { error: e.message } })
    }
    setLoading(false)
  }

  const downloadImage = () => {
    if (!response?.blobUrl) return
    const ext = response.contentType?.includes('png') ? 'png' : 'jpg'
    const a = document.createElement('a')
    a.href = response.blobUrl
    a.download = `result.${ext}`
    a.click()
  }

  const copyUrl = () => navigator.clipboard.writeText(getUrl())

  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        <div style={ms.modalHead}>
          <div>
            <div style={ms.modalTitle}>{ep.name}</div>
            <div style={ms.modalDesc}>{ep.desc}</div>
          </div>
          <button style={ms.modalX} onClick={onClose}><Icon name="X" size={13} /></button>
        </div>

        <div style={ms.modalBody}>
          <div style={ms.epLabelRow}>
            <span style={ms.epLabelTxt}>Endpoint</span>
            <button style={ms.copyBtn} onClick={copyUrl}><Icon name="Copy" size={14} /></button>
          </div>
          <div style={ms.urlBox}>
            <div style={ms.urlText}>{getUrl()}</div>
            <div style={ms.urlLine} />
          </div>

          <div style={ms.paramsBox}>
            <div style={{ ...ms.paramsHead, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="Settings" size={14} /> Parameters</div>

            <div style={ms.paramBlock}>
              <div style={ms.paramRow}>
                <span style={ms.paramKey}>apikey</span>
                <span style={ms.paramStar}>*</span>
                <div style={ms.paramInfo}>i</div>
              </div>
              <input
                style={ms.paramInput}
                placeholder="cimytech##key"
                value={params.apikey || ''}
                onChange={e => setParams({ ...params, apikey: e.target.value })}
              />
            </div>

            {ep.params.map((p, i) => (
              <div key={i} style={ms.paramBlock}>
                <div style={ms.paramRow}>
                  <span style={ms.paramKey}>{p.key}</span>
                  <span style={ms.paramStar}>*</span>
                  <div style={ms.paramInfo}>i</div>
                </div>
                {p.type === 'select' ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {p.options.map(opt => (
                      <div
                        key={opt.value}
                        onClick={() => setParams({ ...params, [p.key]: opt.value })}
                        style={{
                          padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
                          background: params[p.key] === opt.value ? '#ffffff' : 'transparent',
                          borderColor: params[p.key] === opt.value ? '#ffffff' : 'rgba(255,255,255,0.15)',
                          color: params[p.key] === opt.value ? '#0a0a0a' : '#8b949e',
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    style={ms.paramInput}
                    placeholder={p.placeholder}
                    value={params[p.key] || ''}
                    onChange={e => setParams({ ...params, [p.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>

          <StatusCodeTable />

          {loading && (
            <div style={ms.loadingArea}>
              <div style={ms.spinner} />
              <span style={ms.loadingTxt}>Processing request...</span>
            </div>
          )}

          {response && !loading && (
            response.isImage ? (
              <div style={ms.imgRespBox}>
                <img src={response.blobUrl} style={ms.imgPreview} alt="result" />
                <button style={{ ...ms.dlBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={downloadImage}><Icon name="Download" size={14} /> Download</button>
              </div>
            ) : (
              <div style={ms.respWrap}>
                <div style={ms.respHead}>
                  <span style={ms.respLabel}>Response</span>
                  <button style={{ ...ms.respCopyBtn, display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))}><Icon name="Copy" size={11} /> Copy</button>
                </div>
                <div style={{ ...ms.respBox, color: response.ok ? '#ffffff' : '#f87171' }}>
                  {JSON.stringify(response.data, null, 2)}
                </div>
              </div>
            )
          )}
        </div>

        <div style={ms.modalFoot}>
          <button style={{ ...ms.sendBtn, ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }} onClick={sendRequest} disabled={loading}>
            loading ? <><Icon name="RefreshCw" size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Icon name="RefreshCw" size={14} /> Send Request</>
          </button>
        </div>
      </div>
    </div>
  )
}

const STATUS_CODES = [
  { code: 200, icon: 'CheckCircle2', color: '#4ade80', desc: 'OK — Request berhasil' },
  { code: 400, icon: 'AlertCircle', color: '#f87171', desc: 'Bad Request — Parameter tidak valid atau kurang' },
  { code: 405, icon: 'AlertCircle', color: '#f87171', desc: 'Method Not Allowed — HTTP method tidak didukung' },
  { code: 429, icon: 'AlertTriangle', color: '#facc15', desc: 'Too Many Requests — Rate limit tercapai' },
  { code: 500, icon: 'AlertCircle', color: '#f87171', desc: 'Internal Server Error — Server mengalami error' },
]

export function StatusCodeTable() {
  return (
    <div style={ms.statusBox}>
      <div style={ms.statusHead}><Icon name="List" size={14} /> HTTP Status Codes</div>
      <div style={ms.statusTable}>
        {STATUS_CODES.map(s => (
          <div key={s.code} style={ms.statusRow}>
            <Icon name={s.icon} size={16} color={s.color} />
            <span style={{ ...ms.statusCode, color: s.color }}>{s.code}</span>
            <span style={ms.statusDesc}>{s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const ms = {
  overlay: { position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { width: '100%', maxWidth: 460, background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', fontFamily: 'Plus Jakarta Sans, sans-serif', maxHeight: '90vh', display: 'flex', flexDirection: 'column', animation: 'popIn 0.25s ease' },
  modalHead: { padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexShrink: 0 },
  modalTitle: { fontSize: 19, fontWeight: 900, letterSpacing: -0.4, marginBottom: 4 },
  modalDesc: { fontSize: 12, color: '#9a9a9a', lineHeight: 1.5 },
  modalX: { width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#9a9a9a', cursor: 'pointer', flexShrink: 0 },
  modalBody: { padding: '18px 20px', overflowY: 'auto', flex: 1 },
  epLabelRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, marginBottom: 8 },
  epLabelTxt: { fontSize: 13, fontWeight: 800 },
  copyBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6a6a6a', fontSize: 17, padding: 0 },
  urlBox: { background: '#0f0f0f', borderRadius: 10, padding: '13px 14px', marginBottom: 16, position: 'relative', overflow: 'hidden' },
  urlText: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#e5e5e5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  urlLine: { position: 'absolute', bottom: 0, left: 0, height: 2, width: '65%', background: 'linear-gradient(90deg, #ffffff, #e2e8f0)' },
  paramsBox: { background: '#0f0f0f', borderRadius: 12, padding: '14px 16px', marginBottom: 16 },
  paramsHead: { fontSize: 14, fontWeight: 800, marginBottom: 14 },
  paramBlock: { marginBottom: 12 },
  paramRow: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 },
  paramKey: { fontSize: 13, fontWeight: 700, color: '#f0f6fc' },
  paramStar: { color: '#f87171', fontSize: 13 },
  paramInfo: { width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#6a6a6a' },
  paramInput: { width: '100%', background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: '10px 13px', color: '#f0f6fc', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, outline: 'none' },
  loadingArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '24px 0' },
  spinner: { width: 38, height: 38, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 0.75s linear infinite' },
  loadingTxt: { fontSize: 13, color: '#9a9a9a' },
  respWrap: { marginTop: 4 },
  respHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  respLabel: { fontSize: 11, fontWeight: 700, color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: 0.5 },
  respCopyBtn: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#ffffff', cursor: 'pointer' },
  respBox: { background: '#0f0f0f', borderRadius: 10, padding: 13, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, maxHeight: 180, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6 },
  modalFoot: { padding: '14px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 },
  sendBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, color: '#0a0a0a', cursor: 'pointer', minWidth: 160, textAlign: 'center' },
  imgRespBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 4 },
  imgPreview: { width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'repeating-conic-gradient(#141414 0% 25%, #0f0f0f 0% 50%) 0 0 / 16px 16px' },
  dlBtn: { width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 9, fontSize: 13, fontWeight: 700, color: '#ffffff', cursor: 'pointer' },
  statusBox: { marginTop: 16, background: '#0f0f0f', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' },
  statusHead: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 800, color: '#c8d3e0', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.4 },
  statusTable: { display: 'flex', flexDirection: 'column', gap: 8 },
  statusRow: { display: 'flex', alignItems: 'center', gap: 10 },
  statusCode: { fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, fontWeight: 800, minWidth: 30, flexShrink: 0 },
  statusDesc: { fontSize: 11.5, color: '#9a9a9a', lineHeight: 1.4 },
}
