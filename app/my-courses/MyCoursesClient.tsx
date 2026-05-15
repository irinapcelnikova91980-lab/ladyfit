'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'

const B = '#AD82A6'
const BL = '#f3eef5'
const BB = '#e8d5e8'
const BT = '#7a5278'
const SERIF = 'var(--font-cormorant), Georgia, serif'

const CARD_TOPS = [
  'linear-gradient(135deg,#e8d5e8 0%,#AD82A6 100%)',
  'linear-gradient(135deg,#dce8f0 0%,#8aaec4 100%)',
  'linear-gradient(135deg,#e8e4d5 0%,#b8a882 100%)',
  'linear-gradient(135deg,#d5e8e0 0%,#82a896 100%)',
  'linear-gradient(135deg,#e8dcd5 0%,#a8907e 100%)',
]

type Course = {
  id: string
  slug: string
  title: string
  description: string | null
  price: number
  lessons: { id: string }[]
  completedCount: number
}

type Achievement = {
  icon: string
  title: string
  desc: string
  earned: boolean
}

export default function MyCoursesClient({
  courses,
  achievements,
  name,
  email,
}: {
  courses: Course[]
  achievements: Achievement[]
  name: string | null
  email: string
}) {
  const { user } = useUser()
  const [tab, setTab] = useState(0)
  const tabs = ['Мои курсы', 'Достижения', 'Настройки']

  const displayName = name ?? user?.firstName ?? email ?? 'Пользователь'
  const initials = (displayName[0] ?? 'М').toUpperCase()

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

      {/* Profile header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: BB, border: `2px solid ${B}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: BT,
        }}>
          {initials}
        </div>
        <div>
          <h1 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 36 }}>
            {displayName}
          </h1>
          <p style={{ fontSize: 12, color: '#aaa' }}>{email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ede8e8', marginBottom: 40 }}>
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            style={{
              padding: '10px 24px', fontSize: 13, fontFamily: 'inherit',
              color: tab === i ? B : '#888', cursor: 'pointer',
              fontWeight: tab === i ? 500 : 300, background: 'none',
              border: 'none', borderBottom: tab === i ? `2px solid ${B}` : '2px solid transparent',
              marginBottom: -1, transition: 'all .15s',
            } as React.CSSProperties}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab: My courses */}
      {tab === 0 && (
        courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 24, color: '#bbb', marginBottom: 20 }}>
              Пока нет купленных курсов
            </p>
            <Link href="/courses" style={{
              display: 'inline-flex', alignItems: 'center', borderRadius: 999,
              padding: '12px 28px', fontSize: 12, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: B, color: '#fff', textDecoration: 'none',
            }}>
              Выбрать курс
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {courses.map((c, idx) => {
              const total = c.lessons.length
              const done = c.completedCount
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div key={c.id} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #ede8e8' }}>
                  <div style={{ height: 120, background: CARD_TOPS[idx % CARD_TOPS.length] }} />
                  <div style={{ padding: '20px 24px' }}>
                    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{c.title}</p>
                    <p style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>
                      {pct}% пройдено · {total} уроков
                    </p>
                    <div style={{ background: BB, borderRadius: 999, height: 4, marginBottom: 16 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: B, borderRadius: 999, transition: 'width .3s' }} />
                    </div>
                    <Link
                      href={`/courses/${c.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '100%', borderRadius: 999, padding: '8px 0',
                        fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
                        textTransform: 'uppercase', background: B, color: '#fff',
                        textDecoration: 'none',
                      }}
                    >
                      {pct === 100 ? 'Повторить' : pct > 0 ? 'Продолжить →' : 'Начать →'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Tab: Achievements */}
      {tab === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {achievements.map(a => (
            <div
              key={a.title}
              style={{
                background: a.earned ? BL : '#f5f5f5',
                border: `1px solid ${a.earned ? BB : '#ede8e8'}`,
                borderRadius: 20, padding: '24px', textAlign: 'center',
                opacity: a.earned ? 1 : 0.5,
                transition: 'opacity .2s',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{a.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{a.title}</p>
              <p style={{ fontSize: 12, color: '#aaa', fontWeight: 300 }}>{a.desc}</p>
              {a.earned && (
                <div style={{
                  marginTop: 10, fontSize: 10, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: BT, fontWeight: 500,
                }}>
                  Получено ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Settings */}
      {tab === 2 && (
        <div style={{ maxWidth: 500 }}>
          {[
            ['Имя', name ?? user?.firstName ?? ''],
            ['Email', email],
          ].map(([label, val]) => (
            <div key={label} style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', display: 'block', marginBottom: 8 }}>
                {label}
              </label>
              <input
                defaultValue={val as string}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: '1px solid #ede8e8', fontSize: 14, background: '#fff',
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
            </div>
          ))}
          <button style={{
            display: 'inline-flex', alignItems: 'center', borderRadius: 999,
            padding: '12px 28px', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: B, color: '#fff', border: 'none', fontFamily: 'inherit', cursor: 'pointer',
          }}>
            Сохранить
          </button>
        </div>
      )}
    </div>
  )
}
