'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const B = '#AD82A6'
const BB = '#e8d5e8'
const BT = '#7a5278'

export default function NavbarUserMenu() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

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

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Link href="/my-courses" style={{ fontSize: 13, color: '#666' }}>
        Мои курсы
      </Link>
      <div
        onClick={() => signOut(() => { router.push('/'); router.refresh() })}
        title="Выйти"
        style={{
          width: 34, height: 34, borderRadius: '50%',
          background: BB, border: `1.5px solid ${B}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: BT, cursor: 'pointer', userSelect: 'none',
        }}
      >
        {initials}
      </div>
    </div>
  )
}
