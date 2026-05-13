import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '../../../lib/prisma'
import { requireAdmin } from '../../../lib/auth'
import { createLesson, deleteLesson, updateCourse } from './server-actions'

type Props = {
  params: Promise<{ courseId: string }>
}

const PEACH = '#F6EDE2'
const PEACH_SOFT = '#FFF8F4'
const PEACH_BORDER = '#EAD8CF'
const LAVENDER = '#AD82A6'
const LAVENDER_SOFT = '#F3EEF5'
const LAVENDER_BORDER = '#E8D5E8'
const TEXT = '#5C3D2E'
const MUTED = '#A8846F'
const SERIF = 'var(--font-cormorant), Georgia, serif'

export default async function EditCoursePage({ params }: Props) {
  await requireAdmin()

  const { courseId } = await params

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) {
    notFound()
  }

  const nextLessonOrder = course.lessons.length + 1

  return (
    <main style={{ minHeight: 'calc(100vh - 60px)', background: PEACH, color: TEXT }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 24px 44px' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/admin" style={{ color: MUTED, fontSize: 13, textDecoration: 'none', marginBottom: 14, display: 'inline-flex' }}>
            ← Назад в админку
          </Link>

          <h1 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 48, lineHeight: 1, marginBottom: 8 }}>
            Редактировать курс
          </h1>

          <p style={{ fontSize: 13, color: MUTED }}>
            Настройка курса, цены, публикации и уроков
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
          <section style={{ background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`, borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${PEACH_BORDER}` }}>
              <h2 style={{ fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 4 }}>
                Основные данные
              </h2>
              <p style={{ fontSize: 12, color: MUTED }}>
                Эти данные отображаются на странице курса и в каталоге
              </p>
            </div>

            <form action={updateCourse} style={{ padding: 20 }}>
              <input type="hidden" name="courseId" value={course.id} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <Field label="Название курса">
                  <input name="title" defaultValue={course.title} required style={inputStyle} />
                </Field>

                <Field label="Slug">
                  <input name="slug" defaultValue={course.slug} required placeholder="flat-belly" style={inputStyle} />
                </Field>
              </div>

              <div style={{ marginBottom: 14 }}>
                <Field label="Описание курса">
                  <textarea
                    name="description"
                    defaultValue={course.description ?? ''}
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                  />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 14, marginBottom: 14 }}>
                <Field label="Цена, ₽">
                  <input type="number" name="price" defaultValue={course.price} required min={0} style={inputStyle} />
                </Field>

                <div style={{ border: `1px solid ${PEACH_BORDER}`, borderRadius: 14, background: PEACH_SOFT, padding: '11px 14px' }}>
                  <p style={{ fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7 }}>
                    Видео
                  </p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
                    Видео добавляются ниже — отдельно для каждого урока.
                  </p>
                </div>
              </div>

              <div style={{ border: `1px solid ${PEACH_BORDER}`, borderRadius: 18, background: PEACH_SOFT, padding: 16, display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: TEXT, marginBottom: 4 }}>
                    Опубликовать курс
                  </p>
                  <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
                    Если включено, курс будет виден в каталоге для пользователей.
                  </p>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: TEXT, cursor: 'pointer' }}>
                  <input type="checkbox" name="isPublished" defaultChecked={course.isPublished} style={{ width: 16, height: 16, accentColor: LAVENDER }} />
                  Активен
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Link href="/admin" style={{ borderRadius: 999, border: `1px solid ${PEACH_BORDER}`, background: '#fff', color: MUTED, padding: '11px 22px', fontSize: 12, textDecoration: 'none' }}>
                  Отмена
                </Link>

                <button
                  type="submit"
                  style={{
                    borderRadius: 999,
                    background: LAVENDER,
                    color: '#fff',
                    padding: '11px 24px',
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </section>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`, borderRadius: 24, padding: 18 }}>
              <div style={{ height: 150, borderRadius: 18, background: 'linear-gradient(135deg, #E8D5E8 0%, #AD82A6 100%)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32 }}>
                ✦
              </div>

              <StatusBadge active={course.isPublished} />

              <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 28, lineHeight: 1.1, color: TEXT, marginTop: 12, marginBottom: 8 }}>
                {course.title}
              </h2>

              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, marginBottom: 16 }}>
                {course.description || 'Описание пока не добавлено.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <MiniStat label="Цена" value={`${course.price.toLocaleString('ru-RU')} ₽`} />
                <MiniStat label="Уроков" value={course.lessons.length} />
              </div>
            </div>
          </aside>
        </div>

        <section style={{ background: 'rgba(255,255,255,0.72)', border: `1px solid ${PEACH_BORDER}`, borderRadius: 24, overflow: 'hidden', marginTop: 20 }}>
          <form action={createLesson}>
            <input type="hidden" name="courseId" value={course.id} />

            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${PEACH_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 500, color: TEXT, marginBottom: 4 }}>
                  Добавить урок
                </h2>
                <p style={{ fontSize: 12, color: MUTED }}>
                  Создай урок внутри этого курса и добавь ссылку на видео
                </p>
              </div>

              <button type="submit" style={{ borderRadius: 999, background: LAVENDER, color: '#fff', padding: '11px 24px', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0 }}>
                + Добавить урок
              </button>
            </div>

            <div style={{ padding: 20, borderBottom: `1px solid ${PEACH_BORDER}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 14, marginBottom: 14 }}>
                <Field label="Название урока">
                  <input name="title" required placeholder="Например: Разминка" style={inputStyle} />
                </Field>

                <Field label="Порядок">
                  <input type="number" name="order" defaultValue={nextLessonOrder} required min={1} style={inputStyle} />
                </Field>
              </div>

              <div style={{ marginBottom: 14 }}>
                <Field label="Описание урока">
                  <textarea name="content" rows={3} placeholder="Краткое описание урока" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px', gap: 14, alignItems: 'end' }}>
                <Field label="Ссылка на видео">
                  <input name="videoUrl" placeholder="https://rutube.ru/video/..." style={inputStyle} />
                </Field>

                <label style={{ border: `1px solid ${PEACH_BORDER}`, borderRadius: 14, background: PEACH_SOFT, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: TEXT, cursor: 'pointer' }}>
                  <input type="checkbox" name="isFree" style={{ width: 16, height: 16, accentColor: LAVENDER }} />
                  Бесплатный урок
                </label>
              </div>
            </div>
          </form>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 110px 100px', gap: 12, padding: '12px 20px', background: PEACH_SOFT, borderBottom: `1px solid ${PEACH_BORDER}` }}>
              {['№', 'Урок', 'Видео', 'Доступ', ''].map((title) => (
                <p key={title} style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUTED }}>
                  {title}
                </p>
              ))}
            </div>

            {course.lessons.length === 0 ? (
              <div style={{ padding: '44px 20px', textAlign: 'center' }}>
                <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 24, color: MUTED, marginBottom: 8 }}>
                  Уроков пока нет
                </p>
                <p style={{ fontSize: 13, color: MUTED }}>
                  Заполни форму выше, чтобы добавить первый урок.
                </p>
              </div>
            ) : (
              course.lessons.map((lesson, index) => (
                <div key={lesson.id} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 110px 100px', gap: 12, alignItems: 'center', padding: '14px 20px', borderBottom: index < course.lessons.length - 1 ? `1px solid ${PEACH_BORDER}` : 'none' }}>
                  <p style={{ fontSize: 13, color: MUTED }}>{lesson.order}</p>

                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 4 }}>
                      {lesson.title}
                    </p>
                    <p style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lesson.content || 'Описание урока пока не добавлено'}
                    </p>
                  </div>

                  <p style={{ fontSize: 12, color: lesson.videoUrl ? TEXT : MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lesson.videoUrl || 'Видео не добавлено'}
                  </p>

                  <span style={{ display: 'inline-flex', width: 'fit-content', borderRadius: 999, padding: '5px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: lesson.isFree ? '#3A7A5A' : '#7A5278', background: lesson.isFree ? '#E6F4EA' : LAVENDER_SOFT, border: lesson.isFree ? '1px solid #A8D5BB' : `1px solid ${LAVENDER_BORDER}` }}>
                    {lesson.isFree ? 'Бесплатный' : 'Закрытый'}
                  </span>

                  <form action={deleteLesson}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="lessonId" value={lesson.id} />
                    <button type="submit" style={{ borderRadius: 10, border: '1px solid #E8C4C4', padding: '8px 10px', fontSize: 12, color: '#B85A5A', background: '#FFF4F4', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Удалить
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7 }}>
        {label}
      </span>
      {children}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 14,
  border: `1px solid ${PEACH_BORDER}`,
  background: PEACH_SOFT,
  padding: '11px 14px',
  color: TEXT,
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span style={{ display: 'inline-flex', width: 'fit-content', borderRadius: 999, padding: '5px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? '#7A5278' : '#A0502A', background: active ? LAVENDER_SOFT : '#FDE8DC', border: active ? `1px solid ${LAVENDER_BORDER}` : '1px solid #F0CDBD' }}>
      {active ? 'Активен' : 'Черновик'}
    </span>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ borderRadius: 16, border: `1px solid ${PEACH_BORDER}`, background: PEACH_SOFT, padding: 12 }}>
      <p style={{ fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: TEXT, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  )
}