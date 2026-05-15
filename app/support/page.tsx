import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '../lib/auth'

const PEACH = '#F6EDE2'
const LAVENDER = '#AD82A6'
const LAVENDER_SOFT = '#F3EEF5'
const LAVENDER_BORDER = '#E8D5E8'
const TEXT = '#5C3D2E'
const MUTED = '#A8846F'
const SERIF = 'var(--font-cormorant), Georgia, serif'

export default async function SupportPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  return (
    <main style={{
      minHeight: 'calc(100vh - 60px)', background: PEACH,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 520, width: '100%', margin: '0 24px', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(255,255,255,0.72)', border: `1px solid ${LAVENDER_BORDER}`,
          borderRadius: 28, padding: '52px 40px',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: LAVENDER_SOFT, border: `1px solid ${LAVENDER_BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: LAVENDER, margin: '0 auto 24px',
          }}>
            ◇
          </div>
          <p style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
            fontSize: 36, color: TEXT, marginBottom: 12, lineHeight: 1.1,
          }}>
            Поддержка
          </p>
          <p style={{ fontSize: 14, color: MUTED, fontWeight: 300, lineHeight: 1.7, marginBottom: 32 }}>
            Раздел поддержки будет добавлен позже.
            <br />Скоро здесь появится чат с командой SomraFit.
          </p>
          <Link href="/my-courses" style={{
            display: 'inline-flex', alignItems: 'center', borderRadius: 999,
            padding: '11px 28px', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: LAVENDER, color: '#fff', textDecoration: 'none',
          }}>
            Мои курсы →
          </Link>
        </div>
      </div>
    </main>
  )
}
