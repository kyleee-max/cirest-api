import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Icon from '../components/Icon'

export default function Custom404() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const c = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(c); router.push('/'); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(c)
  }, [])

  return (
    <>
      <Head>
        <title>404 — Cirest Api</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '48px',
          cursor: 'pointer',
        }} onClick={() => router.push('/')}>
          <img src="/logo.png" alt="Cirest Api" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#f0f6fc' }}>Cirest Api</span>
        </div>

        {/* 404 illustration area */}
        <div style={{
          background: '#121212',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '48px 56px',
          textAlign: 'center',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Big 404 */}
          <div style={{
            fontSize: '96px',
            fontWeight: 800,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #ffffff, #a3a3a3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            letterSpacing: '-4px',
          }}>
            404
          </div>

          {/* Icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}><Icon name="Search" size={40} color="#9a9a9a" strokeWidth={1.5} /></div>

          <h1 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#f0f6fc',
            margin: '0 0 10px',
          }}>
            Halaman Tidak Ditemukan
          </h1>

          <p style={{
            fontSize: '14px',
            color: '#9a9a9a',
            lineHeight: 1.7,
            margin: '0 0 28px',
          }}>
            Endpoint atau halaman yang kamu cari tidak ada.<br />
            Cek kembali URL atau kunjungi dokumentasi kami.
          </p>

          {/* Countdown bar */}
          <div style={{
            background: '#1c1c1e',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#9a9a9a',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            Redirect otomatis ke home dalam{' '}
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{countdown} detik</span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                flex: 1,
                padding: '11px 20px',
                background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                border: 'none',
                borderRadius: '10px',
                color: '#0d1117',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Icon name="ArrowLeft" size={14} /> Ke Home
            </button>
            <button
              onClick={() => router.push('/docs')}
              style={{
                flex: 1,
                padding: '11px 20px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: '#e6edf3',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
            >
              Lihat Docs <Icon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          marginTop: '32px',
          fontSize: '13px',
          color: '#484f58',
          position: 'relative',
          zIndex: 1,
        }}>
          © 2026 Cirest Api · Made with <Icon name="Coffee" size={12} style={{ margin: '0 2px' }} /> in Indonesia
        </p>
      </div>
    </>
  )
}
