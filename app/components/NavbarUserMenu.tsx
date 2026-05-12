'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useTransition } from 'react'
import { switchMyRole } from '../actions/switch-role'

const B = '#AD82A6'
const BB = '#e8d5e8'
const BT = '#7a5278'
const BL = '#f3eef5'

export default function NavbarUserMenu({ role, isOwner }: { role?: string; isOwner?: boolean }) {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link href="/sign-in" style={{ fontSize: 13, color: '#666' }}>
          Войти
        </Link>
        <Link
          href="/sign-in?tab=signup"
          style={{
            display: 'inline-flex', alignItems: 'center', borderRadius: 999,
            padding: '8px 18px', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: B, color: '#fff', textDecoration: 'none',
          }}
        >
          Регистрация
        </Link>
      </div>
    )
  }

  const initials = (user.firstName?.[0] ?? user.emailAddresses[0]?.emailAddress[0] ?? 'М').toUpperCase()
  const displayName = user.firstName ?? user.emailAddresses[0]?.emailAddress ?? ''

  function handleRoleSwitch() {
    startTransition(async () => {
      await switchMyRole()
      router.refresh()
    })
  }

  const isAdmin = role === 'admin'
  const roleBadge = role ? (
    isOwner ? (
      <button
        onClick={handleRoleSwitch}
        disabled={pending}
        title="Переключить роль"
        style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', borderRadius: 999,
          padding: '4px 10px', cursor: pending ? 'wait' : 'pointer',
          fontFamily: 'inherit', border: 'none', transition: 'opacity .15s',
          opacity: pending ? 0.6 : 1,
          ...(isAdmin
            ? { background: BL, color: BT, outline: `1px solid ${BB}` }
            : { background: '#fff', color: '#888', outline: '1px solid #ede8e8' }),
        }}
      >
        {role}
      </button>
    ) : (
      <span
        style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', borderRadius: 999,
          padding: '4px 10px',
          ...(isAdmin
            ? { background: BL, color: BT, outline: `1px solid ${BB}` }
            : { background: '#fff', color: '#888', outline: '1px solid #ede8e8' }),
        }}
      >
        {role}
      </span>
    )
  ) : null

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
      {roleBadge}
      <div
        onClick={() => setOpen(v => !v)}
        title="Меню аккаунта"
        style={{
          width: 34, height: 34, borderRadius: '50%',
          background: open ? B : BB,
          border: `1.5px solid ${B}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: open ? '#fff' : BT,
          cursor: 'pointer', userSelect: 'none',
          transition: 'all .15s',
        }}
      >
        {initials}
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          background: '#fff', border: '1px solid #ede8e8', borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,.08)',
          minWidth: 200, overflow: 'hidden', zIndex: 200,
        }}>
          {/* User info */}
          <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: BL, border: `1.5px solid ${B}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: BT, marginBottom: 8,
            }}>
              {initials}
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 2 }}>{displayName}</p>
            <p style={{ fontSize: 11, color: '#aaa' }}>{user.emailAddresses[0]?.emailAddress}</p>
          </div>

          {/* Sign out */}
          <div style={{ borderTop: '1px solid #f5f5f5', padding: '8px 0' }}>
            <button
              onClick={() => { setOpen(false); signOut(() => { router.push('/'); router.refresh() }) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 18px', fontSize: 13, color: '#c66',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left', transition: 'background .1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span>→</span> Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
