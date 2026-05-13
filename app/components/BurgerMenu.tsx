'use client'

import Link from 'next/link'
import { useState } from 'react'

type Props = {
  isLoggedIn: boolean
  role?: string | null
  isOwner: boolean
}

const BRAND = '#AD82A6'
const BRAND_LIGHT = '#f3eef5'

export default function BurgerMenu({ role }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl leading-none"
        aria-label="Открыть меню"
      >
        ☰
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/25"
            onClick={() => setOpen(false)}
          />

          <aside className="fixed left-0 top-[73px] z-50 flex h-[calc(100vh-73px)] w-64 flex-col border-r border-gray-100 bg-white shadow-lg">
            {/* Шапка */}
            <div className="border-b border-gray-100 px-5 py-5">
              <p
                className="text-xl font-light italic"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  color: BRAND,
                }}
              >
                SomraFit
              </p>

              <p className="mt-0.5 text-xs uppercase tracking-widest text-gray-400">
                платформа тренировок
              </p>
            </div>

            {/* Навигация */}
            <nav className="flex-1 px-3 py-4">
              <p className="mb-2 px-3 text-[9px] uppercase tracking-widest text-gray-400">
                Навигация
              </p>

              {/* На главную — для всех */}
              <MenuLink href="/" onClick={() => setOpen(false)} icon="◎">
                На главную
              </MenuLink>

              {role === 'admin' && (
                <>
                  <MenuLink href="/courses" onClick={() => setOpen(false)} icon="✦">
                    Курсы
                  </MenuLink>

                  <MenuLink href="/admin" onClick={() => setOpen(false)} icon="⚙">
                    Админка
                  </MenuLink>

                  <Link
                    href="/courses/new"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white"
                    style={{ background: BRAND }}
                  >
                    <span>＋</span> Создать курс
                  </Link>
                </>
              )}

              {role === 'user' && (
                <>
                  <MenuLink href="/courses" onClick={() => setOpen(false)} icon="✦">
                    Курсы
                  </MenuLink>

                  <MenuLink href="/my-courses" onClick={() => setOpen(false)} icon="◎">
                    Мои курсы
                  </MenuLink>
                </>
              )}
            </nav>

            {/* Футер */}
            <div className="border-t border-gray-100 p-4">
              <p
                className="text-sm font-light italic"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  color: BRAND,
                }}
              >
                SomraFit
              </p>

              <p className="text-xs text-gray-400">платформа тренировок</p>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

function MenuLink({
  href,
  onClick,
  icon,
  children,
}: {
  href: string
  onClick: () => void
  icon: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:text-[#7a5278]"
      onMouseEnter={(e) => (e.currentTarget.style.background = BRAND_LIGHT)}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span className="text-sm">{icon}</span> {children}
    </Link>
  )
}