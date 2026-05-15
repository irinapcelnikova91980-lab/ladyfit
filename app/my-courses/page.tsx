import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import { getCurrentUser } from '../lib/auth'

const PEACH = '#F6EDE2'
const PEACH_SOFT = '#FFF8F4'
const PEACH_BORDER = '#EAD8CF'
const LAVENDER = '#AD82A6'
const LAVENDER_SOFT = '#F3EEF5'
const LAVENDER_BORDER = '#E8D5E8'
const TEXT = '#5C3D2E'
const MUTED = '#A8846F'
const SERIF = 'var(--font-cormorant), Georgia, serif'

const GRADIENTS = [
  'linear-gradient(135deg,#e8d5e8 0%,#AD82A6 100%)',
  'linear-gradient(135deg,#dce8f0 0%,#8aaec4 100%)',
  'linear-gradient(135deg,#e8e4d5 0%,#b8a882 100%)',
  'linear-gradient(135deg,#d5e8e0 0%,#82a896 100%)',
  'linear-gradient(135deg,#e8dcd5 0%,#a8907e 100%)',
]

export default async function MyCoursesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  const accesses = await prisma.courseAccess.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: { lessons: { select: { id: true }, orderBy: { order: 'asc' } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const allLessonIds = accesses.flatMap(a => a.course.lessons.map(l => l.id))

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id, lessonId: { in: allLessonIds } },
    select: { lessonId: true },
  })

  const completedIds = new Set(progressRows.map(p => p.lessonId))

  const courses = accesses.map(a => {
    const total = a.course.lessons.length
    const done = a.course.lessons.filter(l => completedIds.has(l.id)).length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    const isCompleted = total > 0 && done === total
    const nextLesson =
      a.course.lessons.find(l => !completedIds.has(l.id)) ??
      a.course.lessons[0] ??
      null
    return { ...a.course, total, done, pct, isCompleted, nextLesson }
  })

  const totalDone = completedIds.size
  const avgPct =
    courses.length > 0
      ? Math.round(courses.reduce((s, c) => s + c.pct, 0) / courses.length)
      : 0
  const anyCompleted = courses.some(c => c.isCompleted)

  const achievements = [
    { icon: '✦', title: 'Первый шаг', desc: 'Пройден первый урок', earned: totalDone >= 1 },
    { icon: '◎', title: 'В ритме', desc: 'Пройдено 3 урока', earned: totalDone >= 3 },
    { icon: '◇', title: 'Сильный старт', desc: 'Пройдено 5 уроков', earned: totalDone >= 5 },
    { icon: '▲', title: 'Курс завершён', desc: 'Полностью пройден один курс', earned: anyCompleted },
  ]
  const earnedCount = achievements.filter(a => a.earned).length

  const displayName = user.name ?? user.email ?? 'ученица'

  return (
    <main style={{ minHeight: 'calc(100vh - 60px)', background: PEACH, color: TEXT }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
            fontSize: 52, lineHeight: 1, marginBottom: 10,
          }}>
            Добрый день, {displayName}
          </h1>
          <p style={{ fontSize: 14, color: MUTED, fontWeight: 300 }}>
            Здесь собраны ваши курсы, прогресс и достижения.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 32,
        }}>
          <StatCard icon="✦" label="Мои курсы" value={courses.length} sub="доступных курсов" />
          <StatCard icon="◎" label="Пройдено уроков" value={totalDone} sub="завершённых уроков" />
          <StatCard icon="◌" label="Прогресс" value={`${avgPct}%`} sub="среднее прохождение" />
          <StatCard icon="◇" label="Достижения" value={`${earnedCount} / ${achievements.length}`} sub="открыто достижений" />
        </div>

        {/* Courses */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
            fontSize: 32, color: TEXT, marginBottom: 20,
          }}>
            Мои курсы
          </h2>

          {courses.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`,
              borderRadius: 28, padding: '64px 40px', textAlign: 'center',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: LAVENDER_SOFT, border: `1px solid ${LAVENDER_BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, color: LAVENDER, margin: '0 auto 24px',
              }}>
                ✦
              </div>
              <p style={{
                fontFamily: SERIF, fontStyle: 'italic', fontSize: 30,
                color: TEXT, marginBottom: 10,
              }}>
                У вас пока нет курсов
              </p>
              <p style={{ fontSize: 14, color: MUTED, fontWeight: 300, marginBottom: 28, lineHeight: 1.7 }}>
                Выберите курс, чтобы начать путь к себе
              </p>
              <Link href="/courses" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 999, background: LAVENDER, color: '#fff',
                padding: '13px 32px', fontSize: 12, fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
              }}>
                Перейти к курсам →
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
            }}>
              {courses.map((course, idx) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  gradient={GRADIENTS[idx % GRADIENTS.length]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div>
          <h2 style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
            fontSize: 32, color: TEXT, marginBottom: 20,
          }}>
            Достижения
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
          }}>
            {achievements.map(a => (
              <div
                key={a.title}
                style={{
                  background: a.earned ? LAVENDER_SOFT : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${a.earned ? LAVENDER_BORDER : PEACH_BORDER}`,
                  borderRadius: 24, padding: '28px 20px',
                  textAlign: 'center',
                  opacity: a.earned ? 1 : 0.6,
                  transition: 'opacity .2s',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', margin: '0 auto 16px',
                  background: a.earned ? `linear-gradient(135deg, ${LAVENDER_SOFT}, ${LAVENDER_BORDER})` : PEACH_SOFT,
                  border: `1px solid ${a.earned ? LAVENDER_BORDER : PEACH_BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: a.earned ? LAVENDER : MUTED,
                }}>
                  {a.icon}
                </div>
                <p style={{
                  fontSize: 13, fontWeight: 500, color: a.earned ? '#5C3D5A' : MUTED,
                  marginBottom: 6,
                }}>
                  {a.title}
                </p>
                <p style={{ fontSize: 12, color: MUTED, fontWeight: 300, lineHeight: 1.5 }}>
                  {a.desc}
                </p>
                {a.earned && (
                  <p style={{
                    marginTop: 12, fontSize: 10, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: LAVENDER, fontWeight: 500,
                  }}>
                    Получено ✓
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string
  label: string
  value: string | number
  sub: string
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.72)',
      border: `1px solid ${PEACH_BORDER}`,
      borderRadius: 20,
      padding: 20,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: LAVENDER_SOFT, border: `1px solid ${LAVENDER_BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color: LAVENDER, marginBottom: 14,
      }}>
        {icon}
      </div>
      <p style={{
        fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
        color: MUTED, marginBottom: 6,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
        fontSize: 30, color: TEXT, lineHeight: 1, marginBottom: 6,
      }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: MUTED }}>{sub}</p>
    </div>
  )
}

function CourseCard({
  course,
  gradient,
}: {
  course: {
    id: string
    slug: string
    title: string
    description: string | null
    price: number
    total: number
    done: number
    pct: number
    isCompleted: boolean
    nextLesson: { id: string } | null
  }
  gradient: string
}) {
  const btnLabel =
    course.total === 0
      ? null
      : course.isCompleted
        ? 'Повторить'
        : course.done > 0
          ? 'Продолжить →'
          : 'Начать →'

  const btnHref =
    course.nextLesson
      ? `/my-courses/${course.id}/lessons/${course.nextLesson.id}`
      : null

  return (
    <div style={{
      background: 'rgba(255,255,255,0.72)',
      border: `1px solid ${PEACH_BORDER}`,
      borderRadius: 24, overflow: 'hidden',
    }}>
      {/* Top gradient banner */}
      <div style={{
        height: 110, background: gradient,
        display: 'flex', alignItems: 'flex-end',
        padding: '0 24px 16px',
        position: 'relative',
      }}>
        {course.isCompleted && (
          <span style={{
            position: 'absolute', top: 14, right: 14,
            borderRadius: 999, padding: '4px 12px',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.9)',
            color: '#3A7A5A',
          }}>
            Завершён ✓
          </span>
        )}
        <p style={{
          fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
          fontSize: 24, color: '#fff', lineHeight: 1.1,
        }}>
          {course.title}
        </p>
      </div>

      <div style={{ padding: '20px 24px 24px' }}>
        {course.description && (
          <p style={{
            fontSize: 13, color: MUTED, fontWeight: 300,
            lineHeight: 1.6, marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}>
            {course.description}
          </p>
        )}

        {/* Progress */}
        {course.total > 0 ? (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 12, color: MUTED, marginBottom: 8,
            }}>
              <span>{course.done} из {course.total} уроков</span>
              <span>{course.pct}%</span>
            </div>
            <div style={{
              height: 5, borderRadius: 999,
              background: LAVENDER_BORDER,
            }}>
              <div style={{
                width: `${course.pct}%`, height: '100%',
                borderRadius: 999, background: LAVENDER,
                transition: 'width .3s',
              }} />
            </div>
          </div>
        ) : (
          <p style={{
            fontSize: 13, color: MUTED, fontStyle: 'italic',
            fontFamily: SERIF, marginBottom: 20,
          }}>
            Уроки скоро появятся
          </p>
        )}

        {/* Button */}
        {btnHref && btnLabel ? (
          <Link href={btnHref} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 999, padding: '11px 24px',
            fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: course.isCompleted ? PEACH_SOFT : LAVENDER,
            color: course.isCompleted ? LAVENDER : '#fff',
            border: course.isCompleted ? `1px solid ${LAVENDER_BORDER}` : 'none',
            textDecoration: 'none',
          }}>
            {btnLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
