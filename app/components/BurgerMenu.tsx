'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'

type Props = {
  isLoggedIn: boolean
  role?: string | null
  isOwner: boolean
  hasProAccess: boolean
}

const LAVENDER      = '#AD82A6'
const LAVENDER_SOFT = '#F3EEF5'
const LAVENDER_MID  = '#E8D5E8'
const LAVENDER_TEXT = '#7A5278'
const PEACH_BG      = '#FFF8F4'
const PEACH_BORDER  = '#EAD8CF'
const TEXT          = '#5C3D2E'
const MUTED         = '#A8846F'
const SERIF         = 'var(--font-cormorant), Georgia, serif'

export default function BurgerMenu({ isLoggedIn, role, hasProAccess }: Props) {
  const [open, setOpen]       = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const router       = useRouter()
  const { signOut }  = useClerk()
  const { user }     = useUser()

  // Mount → show animation
  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 280)
      return () => clearTimeout(t)
    }
  }, [open])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function close() { setOpen(false) }

  function handleSignOut() {
    close()
    signOut(() => { router.push('/'); router.refresh() })
  }

  const isAdmin = role === 'admin'
  const isUser  = isLoggedIn && !isAdmin

  const displayName = user?.firstName
    ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]
    ?? ''
  const email    = user?.emailAddresses?.[0]?.emailAddress ?? ''
  const initials = (displayName[0] ?? '?').toUpperCase()

  return (
    <>
      {/* Burger button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        style={{
          width: 36, height: 36, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 10, border: `1px solid ${PEACH_BORDER}`,
          background: open ? LAVENDER_SOFT : 'rgba(255,255,255,0.72)',
          color: open ? LAVENDER_TEXT : TEXT,
          fontSize: 15, cursor: 'pointer',
          transition: 'background .15s, color .15s',
          fontFamily: 'inherit',
        }}
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Drawer via portal */}
      {mounted && createPortal(
        <>
          {/* Overlay */}
          <div
            onClick={close}
            aria-hidden="true"
            style={{
              position: 'fixed', inset: 0, zIndex: 140,
              background: `rgba(92,61,46,${visible ? 0.18 : 0})`,
              backdropFilter: visible ? 'blur(4px)' : 'blur(0px)',
              transition: 'background .28s ease, backdrop-filter .28s ease',
            }}
          />

          {/* Side panel */}
          <aside
            aria-label="Боковое меню"
            style={{
              position: 'fixed', left: 0, top: 0, bottom: 0,
              width: 'min(340px, 86vw)',
              zIndex: 150,
              background: PEACH_BG,
              borderRight: `1px solid ${PEACH_BORDER}`,
              boxShadow: visible ? '12px 0 48px rgba(92,61,46,0.14)' : 'none',
              display: 'flex', flexDirection: 'column',
              transform: visible ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform .28s cubic-bezier(.4,0,.2,1), box-shadow .28s ease',
              overflow: 'hidden',
            }}
          >
            {/* ── Header ─────────────────────────────────── */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 20px 16px',
              borderBottom: `1px solid ${PEACH_BORDER}`,
              background: 'rgba(255,255,255,0.6)',
              flexShrink: 0,
            }}>
              <div>
                <p style={{
                  fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 26, color: LAVENDER, lineHeight: 1, marginBottom: 3,
                }}>
                  SomraFit
                </p>
                <p style={{
                  fontSize: 9, textTransform: 'uppercase',
                  letterSpacing: '0.14em', color: MUTED,
                }}>
                  Платформа тренировок
                </p>
              </div>

              <button
                onClick={close}
                aria-label="Закрыть меню"
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  border: `1px solid ${PEACH_BORDER}`,
                  background: 'rgba(255,255,255,0.72)',
                  color: MUTED, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontFamily: 'inherit',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = LAVENDER_SOFT)}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.72)')}
              >
                ✕
              </button>
            </div>

            {/* ── Navigation ────────────────────────────── */}
            <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>

              {/* Guest */}
              {!isLoggedIn && (
                <>
                  <SectionLabel>Навигация</SectionLabel>
                  <MenuItem href="/" icon="◎" onClick={close}>Главная</MenuItem>
                  <MenuItem href="/courses" icon="✦" onClick={close}>Курсы</MenuItem>
                  <MenuItem href="/about" icon="◇" onClick={close}>О тренере</MenuItem>
                  <Divider />
                  <MenuItem href="/sign-in" icon="→" onClick={close} accent>
                    Войти
                  </MenuItem>
                </>
              )}

              {/* Authenticated user */}
              {isUser && (
                <>
                  <SectionLabel>Навигация</SectionLabel>
                  <MenuItem href="/" icon="◎" onClick={close}>Главная</MenuItem>
                  <MenuItem href="/courses" icon="✦" onClick={close}>Курсы</MenuItem>
                  <MenuItem href="/my-courses" icon="◌" onClick={close}>Мои курсы</MenuItem>
                  <Divider />
                  <SectionLabel>Сервисы</SectionLabel>
                  <MenuItem href="/support" icon="◇" onClick={close}>Поддержка</MenuItem>
                  {hasProAccess && (
                    <MenuItem href="/trainer-chat" icon="▲" onClick={close}>
                      Чат с тренером
                    </MenuItem>
                  )}
                </>
              )}

              {/* Admin */}
              {isAdmin && (
                <>
                  <SectionLabel>Сайт</SectionLabel>
                  <MenuItem href="/" icon="◎" onClick={close}>Главная</MenuItem>
                  <MenuItem href="/courses" icon="✦" onClick={close}>Курсы</MenuItem>
                  <Divider />
                  <SectionLabel>Администрирование</SectionLabel>
                  <MenuItem href="/admin" icon="⚙" onClick={close}>Админка</MenuItem>
                  <MenuItem href="/admin/users" icon="◌" onClick={close}>Пользователи</MenuItem>
                  <MenuItem href="/admin/courses/new" icon="＋" onClick={close} accent>
                    Создать курс
                  </MenuItem>
                  <MenuItem href="/admin/content" icon="◇" onClick={close}>Контент</MenuItem>
                  <MenuItem href="/admin/payments" icon="▱" onClick={close}>Платежи</MenuItem>
                  <MenuItem href="/admin/settings" icon="⚙" onClick={close}>Настройки</MenuItem>
                  <Divider />
                  <SectionLabel>Сервисы</SectionLabel>
                  <MenuItem href="/support" icon="◇" onClick={close}>Поддержка</MenuItem>
                </>
              )}

            </nav>

            {/* ── Footer ───────────────────────────────── */}
            <div style={{
              flexShrink: 0,
              borderTop: `1px solid ${PEACH_BORDER}`,
              background: 'rgba(255,255,255,0.5)',
            }}>
              {isLoggedIn ? (
                <>
                  {/* Profile */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px 20px 12px',
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: LAVENDER_SOFT, border: `1.5px solid ${LAVENDER_MID}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, color: LAVENDER_TEXT, flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: 13, fontWeight: 500, color: TEXT,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {displayName || 'Профиль'}
                      </p>
                      {email && (
                        <p style={{
                          fontSize: 11, color: MUTED,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sign out */}
                  <div style={{ padding: '0 10px 16px' }}>
                    <button
                      onClick={handleSignOut}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '11px 14px', borderRadius: 12,
                        fontSize: 13, color: '#B85A5A',
                        background: 'none', border: 'none',
                        cursor: 'pointer', fontFamily: 'inherit',
                        textAlign: 'left', transition: 'background .15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FFF0F0')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 12 }}>→</span> Выйти
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ padding: '12px 10px 16px' }}>
                  <Link
                    href="/sign-in"
                    onClick={close}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 8, width: '100%', padding: '12px 16px', borderRadius: 12,
                      fontSize: 13, fontWeight: 500, textDecoration: 'none',
                      background: LAVENDER, color: '#fff',
                      transition: 'opacity .15s',
                    }}
                  >
                    Войти в аккаунт
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  )
}

// ── Sub-components ──────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.13em',
      color: MUTED, padding: '8px 16px 5px',
    }}>
      {children}
    </p>
  )
}

function Divider() {
  return <div style={{ height: 1, background: PEACH_BORDER, margin: '8px 16px' }} />
}

function MenuItem({
  href, icon, onClick, accent = false, children,
}: {
  href: string
  icon: string
  onClick: () => void
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 16px', borderRadius: 12, minHeight: 44,
        fontSize: 14, textDecoration: 'none',
        color: accent ? LAVENDER : TEXT,
        fontWeight: accent ? 500 : 400,
        transition: 'background .15s',
        marginBottom: 1,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = accent ? LAVENDER_SOFT : 'rgba(255,255,255,0.8)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{
        width: 20, textAlign: 'center', fontSize: 12,
        color: accent ? LAVENDER : MUTED, flexShrink: 0,
      }}>
        {icon}
      </span>
      {children}
    </Link>
  )
}
