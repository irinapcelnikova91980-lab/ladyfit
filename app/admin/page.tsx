import Link from 'next/link'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../lib/auth'
import { deleteCourse } from './delete-course/server-actions'

const PEACH = '#F6EDE2'
const PEACH_SOFT = '#FFF8F4'
const PEACH_BORDER = '#EAD8CF'
const LAVENDER = '#AD82A6'
const LAVENDER_SOFT = '#F3EEF5'
const LAVENDER_BORDER = '#E8D5E8'
const TEXT = '#5C3D2E'
const MUTED = '#A8846F'
const SERIF = 'var(--font-cormorant), Georgia, serif'

export default async function AdminPage() {
  await requireAdmin()

  const [courses, usersCount, coursesCount, lessonsCount, publishedCoursesCount] =
    await Promise.all([
      prisma.course.findMany({
        include: {
          lessons: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.course.count({
        where: { isPublished: true },
      }),
    ])

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 60px)',
        background: PEACH,
        color: TEXT,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '32px 24px 44px',
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 20,
        }}
      >
        {/* Main content */}
        <section>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 24,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 48,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                Добрый день, Марина
              </h1>

              <p
                style={{
                  fontSize: 13,
                  color: MUTED,
                }}
              >
                Панель управления SomraFit
              </p>
            </div>

            <Link
              href="/courses/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                background: LAVENDER,
                color: '#fff',
                padding: '12px 24px',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              + Создать курс
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <StatCard
              icon="◌"
              label="Учениц"
              value={usersCount}
              sub="зарегистрировано"
            />

            <StatCard
              icon="✦"
              label="Курсов"
              value={coursesCount}
              sub="всего в базе"
            />

            <StatCard
              icon="◎"
              label="Уроков"
              value={lessonsCount}
              sub="во всех курсах"
            />

            <StatCard
              icon="◇"
              label="Опубликовано"
              value={publishedCoursesCount}
              sub="активных курсов"
            />
          </div>

          {/* Courses */}
          <div
            style={{
              background: 'rgba(255,255,255,0.72)',
              border: `1px solid ${PEACH_BORDER}`,
              borderRadius: 24,
              overflow: 'hidden',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                padding: '18px 20px',
                borderBottom: `1px solid ${PEACH_BORDER}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: TEXT,
                    marginBottom: 4,
                  }}
                >
                  Курсы
                </h2>

                <p
                  style={{
                    fontSize: 12,
                    color: MUTED,
                  }}
                >
                  Управление курсами, уроками и публикацией
                </p>
              </div>

              <Link
                href="/courses"
                style={{
                  fontSize: 12,
                  color: LAVENDER,
                  textDecoration: 'none',
                }}
              >
                Смотреть на сайте →
              </Link>
            </div>

            {courses.length === 0 ? (
              <div
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 24,
                    color: MUTED,
                    marginBottom: 12,
                  }}
                >
                  Курсов пока нет
                </p>

                <Link
                  href="/courses/new"
                  style={{
                    display: 'inline-flex',
                    borderRadius: 999,
                    background: LAVENDER,
                    color: '#fff',
                    padding: '10px 20px',
                    fontSize: 12,
                    textDecoration: 'none',
                  }}
                >
                  Создать первый курс
                </Link>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.6fr 90px 100px 110px 150px',
                    gap: 12,
                    padding: '12px 20px',
                    background: PEACH_SOFT,
                    borderBottom: `1px solid ${PEACH_BORDER}`,
                  }}
                >
                  {['Курс', 'Уроков', 'Цена', 'Статус', 'Действия'].map(
                    (title) => (
                      <p
                        key={title}
                        style={{
                          fontSize: 10,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: MUTED,
                        }}
                      >
                        {title}
                      </p>
                    ),
                  )}
                </div>

                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.6fr 90px 100px 110px 150px',
                      gap: 12,
                      alignItems: 'center',
                      padding: '14px 20px',
                      borderBottom:
                        index < courses.length - 1
                          ? `1px solid ${PEACH_BORDER}`
                          : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 54,
                          height: 42,
                          borderRadius: 12,
                          flexShrink: 0,
                          background: getCourseGradient(index),
                        }}
                      />

                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: TEXT,
                            marginBottom: 4,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {course.title}
                        </p>

                        <p
                          style={{
                            fontSize: 12,
                            color: MUTED,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {course.description || 'Описание пока не добавлено'}
                        </p>
                      </div>
                    </div>

                    <p style={{ fontSize: 13, color: TEXT }}>
                      {course.lessons.length}
                    </p>

                    <p style={{ fontSize: 13, color: TEXT }}>
                      {course.price.toLocaleString('ru-RU')} ₽
                    </p>

                    <StatusBadge active={course.isPublished} />

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Link
                        href={`/admin/courses/${course.id}`}
                        style={{
                          borderRadius: 10,
                          border: `1px solid ${PEACH_BORDER}`,
                          padding: '8px 12px',
                          fontSize: 12,
                          color: TEXT,
                          textDecoration: 'none',
                          background: '#fff',
                        }}
                      >
                        Изменить
                      </Link>

                      <form action={deleteCourse}>
                        <input type="hidden" name="courseId" value={course.id} />
                        <button
                          type="submit"
                          style={{
                            borderRadius: 10,
                            border: '1px solid #E8C4C4',
                            padding: '8px 10px',
                            fontSize: 12,
                            color: '#B85A5A',
                            background: '#FFF4F4',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Удалить
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            <InfoCard title="Контент сайта" icon="◇">
              <InfoRow label="Курсы" value={coursesCount} />
              <InfoRow label="Уроки" value={lessonsCount} />
              <InfoRow label="Опубликовано" value={publishedCoursesCount} />
            </InfoCard>

            <InfoCard title="Платежи" icon="▱">
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: MUTED,
                }}
              >
                Раздел появится после подключения платёжной системы. Здесь будут
                отображаться покупки, суммы, статусы оплат и тарифы.
              </p>
            </InfoCard>
          </div>
        </section>

        {/* Right panel */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.72)',
              border: `1px solid ${PEACH_BORDER}`,
              borderRadius: 24,
              padding: 18,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: TEXT,
                marginBottom: 16,
              }}
            >
              Быстрые действия
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <QuickAction href="/courses/new" icon="+">
                Создать курс
              </QuickAction>

              <QuickAction href="/admin/users" icon="◌">
                Ученицы
              </QuickAction>

              <QuickAction href="/admin/content" icon="◇">
                Контент
              </QuickAction>

              <QuickAction href="/admin/payments" icon="▱">
                Платежи
              </QuickAction>

              <QuickAction href="/admin/settings" icon="⚙">
                Настройки
              </QuickAction>
            </div>
          </div>

          <div
            style={{
              background: LAVENDER_SOFT,
              border: `1px solid ${LAVENDER_BORDER}`,
              borderRadius: 24,
              padding: 18,
            }}
          >
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 24,
                color: LAVENDER,
                marginBottom: 8,
              }}
            >
              Заметка
            </p>

            <p
              style={{
                fontSize: 13,
                color: '#7A5278',
                lineHeight: 1.7,
              }}
            >
              Чаты поддержки и Pro-чат добавим позже отдельным разделом, когда
              закончим основу админки, курсы, видео и платежи.
            </p>
          </div>
        </aside>
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
  value: number
  sub: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: `1px solid ${PEACH_BORDER}`,
        borderRadius: 20,
        padding: 18,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: LAVENDER_SOFT,
          border: `1px solid ${LAVENDER_BORDER}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: LAVENDER,
          marginBottom: 12,
        }}
      >
        {icon}
      </div>

      <p
        style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: MUTED,
          marginBottom: 6,
        }}
      >
        {label}
      </p>

      <p
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 30,
          fontWeight: 300,
          color: TEXT,
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </p>

      <p style={{ fontSize: 11, color: MUTED }}>{sub}</p>
    </div>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        width: 'fit-content',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        padding: '5px 12px',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: active ? '#7A5278' : '#A0502A',
        background: active ? LAVENDER_SOFT : '#FDE8DC',
        border: active
          ? `1px solid ${LAVENDER_BORDER}`
          : '1px solid #F0CDBD',
      }}
    >
      {active ? 'Активен' : 'Черновик'}
    </span>
  )
}

function QuickAction({
  href,
  icon,
  children,
}: {
  href: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 14,
        border: `1px solid ${PEACH_BORDER}`,
        background: PEACH_SOFT,
        padding: '12px 14px',
        color: TEXT,
        textDecoration: 'none',
        fontSize: 13,
      }}
    >
      <span style={{ color: LAVENDER }}>{icon}</span>
      {children}
    </Link>
  )
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: `1px solid ${PEACH_BORDER}`,
        borderRadius: 24,
        padding: 18,
      }}
    >
      <h2
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: TEXT,
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ color: LAVENDER }}>{icon}</span>
        {title}
      </h2>

      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: `1px solid ${PEACH_BORDER}`,
        fontSize: 13,
      }}
    >
      <span style={{ color: MUTED }}>{label}</span>
      <span style={{ color: TEXT, fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function getCourseGradient(index: number) {
  const gradients = [
    'linear-gradient(135deg, #E8D5E8 0%, #AD82A6 100%)',
    'linear-gradient(135deg, #DCE8F0 0%, #8AAEC4 100%)',
    'linear-gradient(135deg, #F2D9CC 0%, #D9A88F 100%)',
    'linear-gradient(135deg, #EDE5F4 0%, #C7AED8 100%)',
    'linear-gradient(135deg, #D5E8E0 0%, #82A896 100%)',
  ]

  return gradients[index % gradients.length]
}