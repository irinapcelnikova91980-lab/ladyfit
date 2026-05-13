import Link from 'next/link'
import { prisma } from '../../lib/prisma'
import { getCurrentUser } from '../../lib/auth'
import { hasCourseAccess } from '../../lib/access'

type Props = {
  params: Promise<{ slug: string }>
}

const PEACH       = '#F6EDE2'
const PEACH_SOFT  = '#FFF8F4'
const PEACH_BORDER = '#EAD8CF'
const LAVENDER    = '#AD82A6'
const LAV_LIGHT   = '#f3eef5'
const LAV_BORDER  = '#e8d5e8'
const LAV_TEXT    = '#7a5278'
const TEXT        = '#5C3D2E'
const MUTED       = '#A8846F'
const SERIF       = 'var(--font-cormorant), Georgia, serif'

const CARD_TOPS = [
  'linear-gradient(135deg,#e8d5e8 0%,#AD82A6 100%)',
  'linear-gradient(135deg,#dce8f0 0%,#8aaec4 100%)',
  'linear-gradient(135deg,#e8e4d5 0%,#b8a882 100%)',
  'linear-gradient(135deg,#d5e8e0 0%,#82a896 100%)',
  'linear-gradient(135deg,#e8dcd5 0%,#a8907e 100%)',
]

export default async function CoursePage({ params }: Props) {
  const { slug } = await params

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: 'asc' } } },
  })

  if (!course) {
    return (
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: MUTED, fontFamily: SERIF, fontStyle: 'italic', fontSize: 24 }}>Курс не найден</p>
      </main>
    )
  }

  const user = await getCurrentUser()
  const isAdmin = user?.role === 'admin'
  const hasAccess = isAdmin
    ? true
    : user ? await hasCourseAccess(user.id, course.id) : false

  const completedLessonIds = user
    ? new Set(
        (await prisma.lessonProgress.findMany({
          where: { userId: user.id, lessonId: { in: course.lessons.map(l => l.id) } },
          select: { lessonId: true },
        })).map((p: { lessonId: string }) => p.lessonId)
      )
    : new Set<string>()

  const totalLessons = course.lessons.length
  const doneCount = course.lessons.filter(l => completedLessonIds.has(l.id)).length
  const slugIndex = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const heroBg = CARD_TOPS[slugIndex % CARD_TOPS.length]

  return (
    <main style={{ minHeight: 'calc(100vh - 60px)', background: PEACH, color: TEXT }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 56px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: MUTED }}>
          <Link href="/courses" style={{ color: MUTED, textDecoration: 'none' }}>Курсы</Link>
          <span style={{ opacity: 0.5 }}>›</span>
          <span>{course.title}</span>
        </div>

        {/* Hero */}
        <div style={{
          borderRadius: 28, overflow: 'hidden', marginBottom: 28,
          background: heroBg, position: 'relative', minHeight: 260,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '36px 40px',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.08,
            backgroundImage: 'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px)',
          }} />

          <span style={{
            display: 'inline-flex', width: 'fit-content', borderRadius: 999,
            padding: '5px 14px', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#fff',
            background: 'rgba(255,255,255,0.2)', border: '0.5px solid rgba(255,255,255,0.4)',
            marginBottom: 14,
          }}>
            Онлайн-курс
          </span>

          <h1 style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
            fontSize: 56, color: '#fff', lineHeight: 1, marginBottom: 14,
          }}>
            {course.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 32, color: '#fff', fontWeight: 300 }}>
              {course.price.toLocaleString('ru-RU')} ₽
            </span>
            {totalLessons > 0 && (
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 300 }}>
                {totalLessons} {totalLessons === 1 ? 'урок' : totalLessons < 5 ? 'урока' : 'уроков'}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Description */}
            {course.description && (
              <section style={{
                background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`,
                borderRadius: 24, padding: '24px 28px',
              }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED, marginBottom: 12 }}>
                  О курсе
                </p>
                <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.8, fontWeight: 300 }}>
                  {course.description}
                </p>
              </section>
            )}

            {/* Access banner */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: hasAccess ? LAV_LIGHT : PEACH_SOFT,
              border: `1px solid ${hasAccess ? LAV_BORDER : PEACH_BORDER}`,
              borderRadius: 16, padding: '14px 20px', fontSize: 13,
              color: hasAccess ? LAV_TEXT : MUTED,
            }}>
              <span style={{ fontSize: 18 }}>{hasAccess ? '🔓' : '🔒'}</span>
              <span>
                {isAdmin
                  ? 'Администратор — полный доступ к курсу'
                  : hasAccess
                    ? 'У вас есть доступ к этому курсу'
                    : 'Доступ откроется после покупки'}
              </span>
            </div>

            {/* Admin: add lesson */}
            {isAdmin && (
              <Link
                href={`/courses/${course.slug}/lessons/new`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  borderRadius: 999, border: `1px solid ${LAV_BORDER}`,
                  background: LAV_LIGHT, color: LAV_TEXT,
                  padding: '10px 20px', fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  textDecoration: 'none', width: 'fit-content',
                }}
              >
                <span>＋</span> Добавить урок
              </Link>
            )}

            {/* Lessons */}
            <section style={{
              background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`,
              borderRadius: 24, overflow: 'hidden',
            }}>
              <div style={{
                padding: '18px 24px', borderBottom: `1px solid ${PEACH_BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED }}>
                  Программа курса
                </p>
                {totalLessons > 0 && (
                  <span style={{ fontSize: 12, color: MUTED }}>
                    {totalLessons} {totalLessons === 1 ? 'урок' : totalLessons < 5 ? 'урока' : 'уроков'}
                    {doneCount > 0 && ` · ${doneCount} пройдено`}
                  </span>
                )}
              </div>

              {course.lessons.length === 0 ? (
                <p style={{
                  padding: '48px 24px', textAlign: 'center',
                  fontFamily: SERIF, fontStyle: 'italic', fontSize: 18, color: MUTED,
                }}>
                  Уроки пока не добавлены
                </p>
              ) : (
                <div>
                  {course.lessons.map((lesson, i) => {
                    const done = completedLessonIds.has(lesson.id)
                    const accessible = hasAccess || lesson.isFree

                    return (
                      <div key={lesson.id} style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '16px 24px',
                        borderBottom: i < course.lessons.length - 1 ? `1px solid ${PEACH_BORDER}` : 'none',
                        transition: 'background .15s',
                      }}>
                        {/* Number / check */}
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: done ? LAVENDER : PEACH_SOFT,
                          border: `1px solid ${done ? LAVENDER : PEACH_BORDER}`,
                          fontSize: done ? 14 : 12,
                          color: done ? '#fff' : MUTED,
                          fontFamily: SERIF,
                        }}>
                          {done ? '✓' : String(lesson.order).padStart(2, '0')}
                        </div>

                        {/* Title */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {accessible ? (
                            <Link
                              href={`/courses/${course.slug}/lessons/${lesson.id}`}
                              style={{
                                fontSize: 14, fontWeight: 500, color: done ? LAV_TEXT : TEXT,
                                textDecoration: 'none', display: 'block',
                              }}
                            >
                              {lesson.title}
                            </Link>
                          ) : (
                            <p style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>{lesson.title}</p>
                          )}
                        </div>

                        {/* Badges */}
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          {lesson.isFree && (
                            <span style={{
                              borderRadius: 999, padding: '4px 10px',
                              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                              textTransform: 'uppercase', color: '#3A7A5A',
                              background: '#E6F4EA', border: '1px solid #A8D5BB',
                            }}>
                              Бесплатно
                            </span>
                          )}
                          {!accessible && !lesson.isFree && (
                            <span style={{ fontSize: 14, color: PEACH_BORDER }}>🔒</span>
                          )}
                          {isAdmin && (
                            <Link
                              href={`/admin/lessons/${lesson.id}`}
                              style={{
                                borderRadius: 10, border: `1px solid ${PEACH_BORDER}`,
                                background: PEACH_SOFT, color: MUTED,
                                padding: '4px 10px', fontSize: 11, textDecoration: 'none',
                              }}
                            >
                              Изменить
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right — purchase card */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {!hasAccess && !isAdmin && (
              <div style={{
                background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`,
                borderRadius: 24, padding: 24,
              }}>
                <p style={{
                  fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 42, color: TEXT, lineHeight: 1, marginBottom: 4,
                }}>
                  {course.price.toLocaleString('ru-RU')} ₽
                </p>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED, marginBottom: 20 }}>
                  Полный доступ навсегда
                </p>

                <Link
                  href={`/courses/${course.slug}/buy`}
                  style={{
                    display: 'block', textAlign: 'center', borderRadius: 999,
                    background: LAVENDER, color: '#fff', padding: '14px 20px',
                    fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
                    textTransform: 'uppercase', textDecoration: 'none',
                  }}
                >
                  Купить курс
                </Link>

                <div style={{ height: 1, background: PEACH_BORDER, margin: '20px 0' }} />

                {[
                  'Доступ ко всем урокам',
                  'Видео в высоком качестве',
                  'Доступ с любого устройства',
                  'Без ограничений по времени',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13, color: TEXT }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: LAVENDER, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            )}

            {/* Info card */}
            <div style={{
              background: LAV_LIGHT, border: `1px solid ${LAV_BORDER}`,
              borderRadius: 24, padding: 20,
            }}>
              <p style={{
                fontFamily: SERIF, fontStyle: 'italic', fontSize: 22,
                color: LAVENDER, marginBottom: 12,
              }}>
                Что внутри
              </p>
              {[
                { icon: '✦', text: `${totalLessons} видео-уроков` },
                { icon: '◎', text: 'Практические задания' },
                { icon: '◇', text: 'Поддержка тренера' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, fontSize: 13, color: LAV_TEXT }}>
                  <span style={{ color: LAVENDER, fontSize: 12 }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>

          </aside>
        </div>
      </div>
    </main>
  )
}
