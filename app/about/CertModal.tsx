'use client'

import { useState } from 'react'

const B = '#AD82A6'
const BL = '#f3eef5'
const BB = '#e8d5e8'
const BT = '#7a5278'

type Cert = { id: number; label: string; src: string | null }

export default function CertModal({ cert }: { cert: Cert }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => cert.src && setOpen(true)}
        style={{
          background: '#fff', borderRadius: 20, border: '1px solid #ede8e8',
          overflow: 'hidden', cursor: cert.src ? 'zoom-in' : 'default',
          transition: 'box-shadow .2s, transform .2s',
          boxShadow: '0 2px 12px rgba(0,0,0,.04)',
        }}
        onMouseEnter={e => {
          if (cert.src) {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(173,130,166,.18)'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
          }
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,.04)'
          ;(e.currentTarget as HTMLElement).style.transform = 'none'
        }}
      >
        {/* Image area */}
        <div style={{
          height: 240,
          background: `repeating-linear-gradient(45deg,${BB}44 0,${BB}44 1px,transparent 1px,transparent 18px), ${BL}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 12, position: 'relative',
        }}>
          {cert.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cert.src} alt={cert.label} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          ) : (
            <>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="4" width="28" height="32" rx="3" stroke={B} strokeWidth="1.2" fill="none" />
                <rect x="11" y="10" width="18" height="2" rx="1" fill={B} fillOpacity=".4" />
                <rect x="11" y="15" width="12" height="2" rx="1" fill={B} fillOpacity=".3" />
                <circle cx="20" cy="26" r="5" stroke={B} strokeWidth="1.2" fill="none" />
                <path d="M17.5 26l2 2 3-3" stroke={B} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 11, color: BT, opacity: 0.6, letterSpacing: '.05em' }}>
                фото сертификата
              </span>
            </>
          )}
        </div>

        {/* Label */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: BL, border: `1px solid ${B}`, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: BT,
          }}>✓</div>
          <span style={{ fontSize: 13, color: '#555', lineHeight: 1.4, fontWeight: 300 }}>{cert.label}</span>
        </div>
      </div>

      {/* Modal */}
      {open && cert.src && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, cursor: 'zoom-out',
          }}
        >
          <div style={{ position: 'relative', maxWidth: 800, width: '100%' }} onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cert.src} alt={cert.label} style={{ width: '100%', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,.4)' }} />
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.7)', fontSize: 13, marginTop: 16, fontWeight: 300 }}>
              {cert.label}
            </p>
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: -16, right: -16, width: 36, height: 36,
                borderRadius: '50%', background: '#fff', color: '#333',
                fontSize: 16, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,.2)', border: 'none',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
