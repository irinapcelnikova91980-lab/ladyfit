'use client'

import Link from 'next/link'
import { useState } from 'react'

const B = '#AD82A6'
const BL = '#f3eef5'
const BT = '#7a5278'
const BB = '#e8d5e8'
const SERIF = 'var(--font-cormorant), Georgia, serif'

const CARD_TOPS = [
  'linear-gradient(135deg,#e8d5e8 0%,#AD82A6 100%)',
  'linear-gradient(135deg,#dce8f0 0%,#8aaec4 100%)',
  'linear-gradient(135deg,#e8e4d5 0%,#b8a882 100%)',
  'linear-gradient(135deg,#d5e8e0 0%,#82a896 100%)',
  'linear-gradient(135deg,#e8dcd5 0%,#a8907e 100%)',
]

const TAGS = ['Популярный', 'Хит', 'Новинка', 'Для всех', 'Онлайн-курс']

type Course = {
  id: string
  slug: string
  title: string
  description: string | null
  price: number
}

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'cheap', label: 'До 2 500 ₽' },
  { key: 'popular', label: 'Популярные' },
] as const

type FilterKey = typeof FILTERS[number]['key']

function plural(n: number) {
  const m = n % 100
  if (m >= 11 && m <= 14) return 'курсов'
  const r = n % 10
  if (r === 1) return 'курс'
  if (r >= 2 && r <= 4) return 'курса'
  return 'курсов'
}

export default function CoursesGrid({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [hoverId, setHoverId] = useState<string | null>(null)

  const filtered = courses.filter(c => {
    if (filter === 'cheap') return c.price <= 2500
    if (filter === 'popular') return c.price >= 2900
    return true
  })

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: '1px solid #ede8e8', paddingBottom: 20, marginBottom: 32,
      }}>
        <h1 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 48 }}>
          Курсы
        </h1>
        <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: '#aaa' }}>
          {courses.length} {plural(courses.length)}
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 20px', borderRadius: 999, fontSize: 12, fontWeight: 400,
              border: filter === f.key ? `1px solid ${B}` : '1px solid #ede8e8',
              background: filter === f.key ? BL : '#fff',
              color: filter === f.key ? BT : '#666',
              cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#bbb', fontSize: 14, padding: '60px 0', fontStyle: 'italic', fontFamily: SERIF }}>
          Нет курсов по этому фильтру
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {filtered.map((course, i) => {
            const origIdx = courses.indexOf(course)
            const isHovered = hoverId === course.id
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                onMouseEnter={() => setHoverId(course.id)}
                onMouseLeave={() => setHoverId(null)}
                style={{
                  borderRadius: 20, overflow: 'hidden',
                  border: isHovered ? `1px solid ${B}` : '1px solid #ede8e8',
                  cursor: 'pointer',
                  transform: isHovered ? 'translateY(-3px)' : 'none',
                  transition: 'all .2s', background: '#fff',
                  textDecoration: 'none', display: 'block',
                }}
              >
                {/* Card top */}
                <div style={{
                  height: 140, position: 'relative',
                  background: CARD_TOPS[origIdx % CARD_TOPS.length],
                  display: 'flex', alignItems: 'flex-end', padding: 16,
                }}>
                  <span style={{
                    position: 'absolute', right: 16, top: 8,
                    fontFamily: SERIF, fontSize: 52, fontWeight: 300,
                    color: 'rgba(255,255,255,.2)', lineHeight: 1,
                  }}>
                    {String(origIdx + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    borderRadius: 999, padding: '4px 12px',
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#fff',
                    background: 'rgba(255,255,255,.22)',
                    border: '0.5px solid rgba(255,255,255,.35)',
                  }}>
                    {TAGS[origIdx % TAGS.length]}
                  </span>
                </div>

                {/* Card body */}
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{course.title}</p>
                  <p style={{
                    fontSize: 12, color: '#888', lineHeight: 1.6, fontWeight: 300,
                    marginBottom: 14,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  } as React.CSSProperties}>
                    {course.description ?? ''}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 24, color: B }}>
                      {course.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      border: `1px solid ${B}`, color: B,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                    }}>→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
