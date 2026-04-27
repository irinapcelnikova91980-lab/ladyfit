import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { getCurrentUser } from '../lib/auth'
import BurgerMenu from './BurgerMenu'

const OWNER_CLERK_ID = 'user_3Bnw99FHrFWc0MkKwkdXCw9Y4Gr'
const BRAND = '#AD82A6'

export default async function Navbar() {
  noStore()

  const { userId: clerkId } = await auth()
  const user = await getCurrentUser()
  const role = user?.role
  const isOwner = clerkId === OWNER_CLERK_ID

  return (
    <header
      className="sticky top-0 z-30 border-b border-gray-100 backdrop-blur"
      style={{ background: 'rgba(255,255,255,0.92)' }}
    >
      <div
        className="mx-auto max-w-7xl px-6 py-3"
        style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}
      >

        {/* ЛЕВАЯ ЧАСТЬ — ссылки на десктопе, бургер на мобиле */}
        <nav className="flex items-center gap-6">

          {/* Бургер — только мобиль */}
          <div className="flex md:hidden">
            <BurgerMenu isLoggedIn={!!user} role={role} isOwner={isOwner} />
          </div>

          {/* Ссылки — только десктоп */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/courses">Курсы</NavLink>
            <NavLink href="/about">О тренере</NavLink>

            {role === 'user' && (
              <NavLink href="/my-courses">Мои курсы</NavLink>
            )}

            {role === 'admin' && (
              <>
                <NavLink href="/admin" muted>Админка</NavLink>
                {isOwner && (
                  <NavLink href="/debug/owner-role" muted>Доступ</NavLink>
                )}
              </>
            )}
          </div>
        </nav>

        {/* ЦЕНТР — логотип */}
        <div className="flex justify-center items-center">
          <Link
            href="/"
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 22,
              color: BRAND,
              letterSpacing: '-0.01em',
              textDecoration: 'none',
            }}
          >
            LadyFit
          </Link>
        </div>

        {/* ПРАВАЯ ЧАСТЬ — аватар или войти/регистрация */}
        <div className="flex items-center justify-end gap-3">
          {user ? (
            <>
              <Link
                href="/my-courses"
                className="hidden md:block text-sm"
                style={{ color: '#6b6b6b' }}
              >
                Личный кабинет
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden md:block text-sm"
                style={{ color: '#6b6b6b' }}
              >
                Войти
              </Link>
              <Link
                href="/sign-up"
                className="text-sm text-white px-4 py-2 rounded-full"
                style={{
                  background: BRAND,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}

function NavLink({
  href,
  children,
  muted = false,
}: {
  href: string
  children: React.ReactNode
  muted?: boolean
}) {
  return (
    <Link
      href={href}
      className="transition-colors hover:text-gray-900"
      style={{ color: muted ? '#9b9b9b' : '#6b6b6b', fontSize: 13 }}
    >
      {children}
    </Link>
  )
}