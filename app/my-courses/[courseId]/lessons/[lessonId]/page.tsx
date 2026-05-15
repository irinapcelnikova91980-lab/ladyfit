import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'
import { hasCourseAccess } from '../../../../lib/access'
import MarkCompleteButton from '../../../../components/MarkCompleteButton'

const B = '#AD82A6'
const BL = '#f3eef5'
const BB = '#e8d5e8'
const BT = '#7a5278'
const PEACH = '#F6EDE2'
const PEACH_BORDER = '#EAD8CF'
const TEXT = '#5C3D2E'
const MUTED = '#A8846F'
const SERIF = 'var(--font-cormorant), Georgia, serif'

type Props = {
  params: Promise<{ courseId: string; lessonId: string }>
}

function getEmbedUrl(url: string): string {
  if (url.includes('/embed/') || url.includes('/play/embed/')) return url

  const rutubeMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/)
  if (rutubeMatch) return `https://rutube.ru/play/embed/${rutubeMatch[1]}/`

  const ytWatchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (ytWatchMatch) return `https://www.youtube.com/embed/${ytWatchMatch[1]}`

  const ytShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (ytShortMatch) return `https://www.youtube.com/embed/${ytShortMatch[1]}`

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return url
}

export default async function MyCourseLesson({ params }: Props) {
  const { courseId, lessonId } = await params

  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: 'asc' } } },
  })

  if (!course) notFound()

  const lesson = course.lessons.find(l => l.id === lessonId)
  if (!lesson) notFound()

  const hasAccess = await hasCourseAccess(user.id, course.id)

  if (!hasAccess) {
    return (
      <main style={{ minHeight: 'calc(100vh - 60px)', background: PEACH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: 520, width: '100%', margin: '0 24px',
          background: BL, border: `1px solid ${BB}`,
          borderRadius: 28, padding: '52px 40px', textAlign: 'center',
        }}>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 32, color: BT, marginBottom: 12, lineHeight: 1.1 }}>
            У вас нет доступа к этому курсу
          </p>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 32, fontWeight: 300, lineHeight: 1.7 }}>
            Для просмотра уроков нужно купить курс.
          </p>
          <Link href={`/courses/${course.slug}`} style={{
            display: 'inline-flex', alignItems: 'center', borderRadius: 999,
            padding: '12px 32px', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: B, color: '#fff', textDecoration: 'none',
          }}>
            Перейти к курсу
          </Link>
        </div>
      </main>
    )
  }

  const isCompleted = !!(await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } },
  }))

  const lessonIndex = course.lessons.findIndex(l => l.id === lessonId)
  const prevLesson = course.lessons[lessonIndex - 1] ?? null
  const nextLesson = course.lessons[lessonIndex + 1] ?? null

  const embedUrl = lesson.videoUrl ? getEmbedUrl(lesson.videoUrl) : null

  return (
    <main style={{ minHeight: 'calc(100vh - 60px)', background: PEACH, color: TEXT }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 56px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: MUTED }}>
          <Link href="/my-courses" style={{ color: MUTED, textDecoration: 'none' }}>
            Мои курсы
          </Link>
          <span style={{ opacity: 0.5 }}>›</span>
          <span style={{ color: MUTED }}>{course.title}</span>
          <span style={{ opacity: 0.5 }}>›</span>
          <span style={{ color: TEXT }}>{lesson.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>

          {/* Main */}
          <section>
            {/* Lesson header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  borderRadius: 999, padding: '3px 12px',
                  fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
                  textTransform: 'uppercase', background: BL, color: BT,
                  border: `0.5px solid ${BB}`,
                }}>
                  Урок {lesson.order}
                </span>
                {isCompleted && (
                  <span style={{
                    borderRadius: 999, padding: '3px 12px',
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: '#E6F4EA', color: '#3A7A5A',
                    border: '0.5px solid #A8D5BB',
                  }}>
                    Пройдено ✓
                  </span>
                )}
              </div>
              <h1 style={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
                fontSize: 48, lineHeight: 1.05, color: TEXT, marginBottom: 0,
              }}>
                {lesson.title}
              </h1>
            </div>

            {/* Video */}
            <div style={{
              borderRadius: 20, overflow: 'hidden',
              background: embedUrl ? '#000' : BL,
              border: `1px solid ${embedUrl ? 'transparent' : BB}`,
              marginBottom: 24,
              aspectRatio: '16 / 9',
            }}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  style={{ width: '100%', height: '100%', display: 'block', border: 'none' }}
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                />
              ) : (
                <div style={{
                  height: '100%', minHeight: 300,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexDirection: 'column', gap: 12,
                }}>
                  <span style={{ fontSize: 44, opacity: 0.25 }}>▶</span>
                  <p style={{ fontSize: 13, color: MUTED, fontStyle: 'italic', fontFamily: SERIF }}>
                    Видео пока не добавлено
                  </p>
                </div>
              )}
            </div>

            {/* Content */}
            {lesson.content && (
              <div style={{
                background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`,
                borderRadius: 16, padding: '20px 24px', marginBottom: 24,
                fontSize: 14, color: TEXT, lineHeight: 1.8, fontWeight: 300,
              }}>
                {lesson.content}
              </div>
            )}

            {/* Mark complete */}
            <div style={{ marginBottom: 32 }}>
              <MarkCompleteButton
                lessonId={lessonId}
                courseSlug={course.slug}
                completed={isCompleted}
              />
            </div>

            {/* Prev / Next navigation */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', gap: 16,
              paddingTop: 24, borderTop: `1px solid ${PEACH_BORDER}`,
            }}>
              {prevLesson ? (
                <Link
                  href={`/my-courses/${courseId}/lessons/${prevLesson.id}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    borderRadius: 999, padding: '10px 22px',
                    fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: B,
                    border: `1px solid ${B}`, textDecoration: 'none',
                  }}
                >
                  ← Предыдущий урок
                </Link>
              ) : <div />}
              {nextLesson ? (
                <Link
                  href={`/my-courses/${courseId}/lessons/${nextLesson.id}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    borderRadius: 999, padding: '10px 22px',
                    fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
                    textTransform: 'uppercase', background: B, color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  Следующий урок →
                </Link>
              ) : <div />}
            </div>
          </section>

          {/* Sidebar — lesson list */}
          <aside>
            <div style={{
              background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`,
              borderRadius: 24, overflow: 'hidden',
              position: 'sticky', top: 24,
            }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${PEACH_BORDER}` }}>
                <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED, marginBottom: 4 }}>
                  {course.title}
                </p>
                <p style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>
                  Программа курса
                </p>
              </div>

              {course.lessons.map((l, i) => {
                const isCurrent = l.id === lessonId
                return (
                  <Link
                    key={l.id}
                    href={`/my-courses/${courseId}/lessons/${l.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 20px',
                      borderBottom: i < course.lessons.length - 1 ? `1px solid ${PEACH_BORDER}` : 'none',
                      background: isCurrent ? BL : 'transparent',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{
                      fontSize: 11, color: isCurrent ? BT : MUTED,
                      minWidth: 20, fontFamily: SERIF, fontStyle: 'italic',
                    }}>
                      {String(l.order).padStart(2, '0')}
                    </span>
                    <span style={{
                      fontSize: 13, color: isCurrent ? BT : TEXT,
                      fontWeight: isCurrent ? 500 : 300, flex: 1, lineHeight: 1.4,
                    }}>
                      {l.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </aside>

        </div>
      </div>
    </main>
  )
}
