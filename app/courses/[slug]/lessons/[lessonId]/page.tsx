import Link from 'next/link'
import { prisma } from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'
import { hasCourseAccess } from '../../../../lib/access'
import MarkCompleteButton from '../../../../components/MarkCompleteButton'

const B = '#AD82A6'
const BL = '#f3eef5'
const BB = '#e8d5e8'
const SERIF = 'var(--font-cormorant), Georgia, serif'

type Props = {
  params: Promise<{
    slug: string
    lessonId: string
  }>
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: 'asc' } } },
  })

  if (!course) return <div style={{ padding: 40 }}>Курс не найден</div>

  const lesson = course.lessons.find(l => l.id === lessonId)
  if (!lesson) return <div style={{ padding: 40 }}>Урок не найден</div>

  const user = await getCurrentUser()
  const isAdmin = user?.role === 'admin'

  const hasAccess = isAdmin
    ? true
    : user
      ? await hasCourseAccess(user.id, course.id)
      : false

  const canWatch = isAdmin || lesson.isFree || hasAccess

  const isCompleted = user
    ? !!(await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId } },
      }))
    : false

  const lessonIndex = course.lessons.findIndex(l => l.id === lessonId)
  const prevLesson = course.lessons[lessonIndex - 1] ?? null
  const nextLesson = course.lessons[lessonIndex + 1] ?? null

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: '#aaa' }}>
        <Link href="/courses" style={{ color: '#aaa', textDecoration: 'none' }}>Курсы</Link>
        <span>›</span>
        <Link href={`/courses/${course.slug}`} style={{ color: '#aaa', textDecoration: 'none' }}>{course.title}</Link>
        <span>›</span>
        <span style={{ color: '#555' }}>{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{
            borderRadius: 999, padding: '3px 12px',
            fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', background: BL, color: '#7a5278',
            border: `0.5px solid ${BB}`,
          }}>
            Урок {lesson.order}
          </span>
          {lesson.isFree && (
            <span style={{
              borderRadius: 999, padding: '3px 12px',
              fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
              textTransform: 'uppercase', background: '#f0f8f0', color: '#4a8a4a',
              border: '0.5px solid #c0e0c0',
            }}>
              Бесплатно
            </span>
          )}
        </div>
        <h1 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 44, lineHeight: 1.1 }}>
          {lesson.title}
        </h1>
      </div>

      {canWatch ? (
        <div>
          {/* Video area */}
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            background: lesson.videoUrl ? '#000' : BL,
            border: `1px solid ${BB}`,
            marginBottom: 28,
          }}>
            {lesson.videoUrl ? (
              <iframe
                src={lesson.videoUrl}
                style={{ width: '100%', height: 440, display: 'block', border: 'none' }}
                allowFullScreen
              />
            ) : (
              <div style={{
                height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12,
              }}>
                <span style={{ fontSize: 40, opacity: 0.3 }}>▶</span>
                <p style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic', fontFamily: SERIF }}>
                  Видео пока не добавлено
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          {lesson.content && (
            <div style={{
              background: '#fff', borderRadius: 16, border: '1px solid #ede8e8',
              padding: '24px 28px', marginBottom: 28,
              fontSize: 14, color: '#444', lineHeight: 1.8, fontWeight: 300,
            }}>
              {lesson.content}
            </div>
          )}

          {/* Mark complete — only for authenticated users */}
          {user && (
            <div style={{ marginBottom: 32 }}>
              <MarkCompleteButton
                lessonId={lessonId}
                courseSlug={slug}
                completed={isCompleted}
              />
            </div>
          )}

          {/* Lesson navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingTop: 24, borderTop: '1px solid #ede8e8' }}>
            {prevLesson ? (
              <Link href={`/courses/${slug}/lessons/${prevLesson.id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 999, padding: '10px 22px',
                fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: B,
                border: `1px solid ${B}`, textDecoration: 'none',
              }}>
                ← Предыдущий урок
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link href={`/courses/${slug}/lessons/${nextLesson.id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 999, padding: '10px 22px',
                fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase', background: B, color: '#fff',
                textDecoration: 'none',
              }}>
                Следующий урок →
              </Link>
            ) : <div />}
          </div>
        </div>
      ) : (
        <div style={{
          borderRadius: 20, border: `1px solid ${BB}`,
          background: BL, padding: '40px 32px', textAlign: 'center',
        }}>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 24, marginBottom: 12 }}>
            Урок закрыт
          </p>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24, fontWeight: 300 }}>
            Для просмотра этого урока нужен доступ к курсу.
          </p>
          <Link href={`/courses/${course.slug}`} style={{
            display: 'inline-flex', alignItems: 'center', borderRadius: 999,
            padding: '12px 28px', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: B, color: '#fff', textDecoration: 'none',
          }}>
            Получить доступ
          </Link>
        </div>
      )}
    </main>
  )
}
