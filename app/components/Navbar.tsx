import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { getCurrentUser } from '../lib/auth'
import { isOwner as checkIsOwner } from '../lib/owner'
import BurgerMenu from './BurgerMenu'
import NavbarUserMenu from './NavbarUserMenu'
import Logo from './Logo'

export default async function Navbar() {
  noStore()

  const { userId: clerkId } = await auth()
  const user = await getCurrentUser()
  const isOwner = checkIsOwner(clerkId)

  // Роль для отображения меню берём из базы.
  // Владелец всё равно защищён через OWNER_CLERK_ID,
  // но может переключиться и посмотреть сайт как обычный пользователь.
  const role = user?.role ?? (clerkId ? 'user' : undefined)
  const isAdminView = role === 'admin'

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(249,246,244,0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #ede8e8',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          height: 60,
        }}
      >
        {/* Left */}
        <nav className="flex items-center gap-6">
          <BurgerMenu isLoggedIn={!!clerkId} role={role} isOwner={isOwner} hasProAccess={false} />

          <div className="hidden md:flex items-center gap-6">
            {isAdminView ? (
              <>
                <NavLink href="/courses">Курсы</NavLink>
                <NavLink href="/admin" muted>
                  Админка
                </NavLink>
              </>
            ) : (
              <>
                <NavLink href="/courses">Курсы</NavLink>
                {clerkId && <NavLink href="/my-courses">Мои курсы</NavLink>}
              </>
            )}
          </div>
        </nav>

        {/* Center — logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size={22} />
        </Link>

        {/* Right — client auth menu */}
        <div className="flex justify-end">
          <NavbarUserMenu role={role} isOwner={isOwner} />
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