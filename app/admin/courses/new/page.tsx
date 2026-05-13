import Link from 'next/link'
import { requireAdmin } from '../../../lib/auth'
import { createCourse } from './server-actions'

const PEACH = '#F6DED2'
const PEACH_SOFT = '#FFF8F4'
const PEACH_BORDER = '#EAD8CF'
const LAVENDER = '#AD82A6'
const LAVENDER_SOFT = '#F3EEF5'
const LAVENDER_BORDER = '#E8D5E8'
const TEXT = '#5C3D2E'
const MUTED = '#A8846F'
const SERIF = 'var(--font-cormorant), Georgia, serif'

export default async function NewAdminCoursePage() {
  await requireAdmin()

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
          maxWidth: 1120,
          margin: '0 auto',
          padding: '32px 24px 44px',
        }}
      >
        <Link
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: MUTED,
            fontSize: 13,
            textDecoration: 'none',
            marginBottom: 14,
          }}
        >
          ← Назад в админку
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 20,
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
              Новый курс
            </h1>

            <p
              style={{
                fontSize: 13,
                color: MUTED,
              }}
            >
              Создаём основу курса. Уроки и видео добавим после создания.
            </p>
          </div>

          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              border: `1px solid ${PEACH_BORDER}`,
              background: '#fff',
              color: TEXT,
              padding: '11px 18px',
              fontSize: 12,
              fontWeight: 500,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            Отмена
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: 20,
            alignItems: 'start',
          }}
        >
          <section
            style={{
              background: 'rgba(255,255,255,0.72)',
              border: `1px solid ${PEACH_BORDER}`,
              borderRadius: 24,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '18px 20px',
                borderBottom: `1px solid ${PEACH_BORDER}`,
              }}
            >
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: TEXT,
                  marginBottom: 4,
                }}
              >
                Основные данные
              </h2>

              <p
                style={{
                  fontSize: 12,
                  color: MUTED,
                }}
              >
                Эти данные будут отображаться в каталоге и на странице курса
              </p>
            </div>

            <form action={createCourse} style={{ padding: 20 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <Field label="Название курса">
                  <input
                    name="title"
                    required
                    placeholder="Например: Плоский живот"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Slug">
                  <input
                    name="slug"
                    required
                    placeholder="flat-belly"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div style={{ marginBottom: 14 }}>
                <Field label="Описание курса">
                  <textarea
                    name="description"
                    rows={6}
                    placeholder="Кратко опишите, для кого курс, какой результат получит ученица и что внутри"
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      lineHeight: 1.7,
                    }}
                  />
                </Field>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <Field label="Цена, ₽">
                  <input
                    type="number"
                    name="price"
                    required
                    min={0}
                    placeholder="4900"
                    style={inputStyle}
                  />
                </Field>

                <div
                  style={{
                    border: `1px solid ${PEACH_BORDER}`,
                    borderRadius: 14,
                    background: PEACH_SOFT,
                    padding: '11px 14px',
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: MUTED,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 7,
                    }}
                  >
                    Видео
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      lineHeight: 1.6,
                    }}
                  >
                    Видео добавляются отдельно внутри уроков после создания курса.
                  </p>
                </div>
              </div>

              <div
                style={{
                  border: `1px solid ${PEACH_BORDER}`,
                  borderRadius: 18,
                  background: PEACH_SOFT,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  marginBottom: 18,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: TEXT,
                      marginBottom: 4,
                    }}
                  >
                    Опубликовать курс сразу
                  </p>

                  <p
                    style={{
                      fontSize: 12,
                      color: MUTED,
                      lineHeight: 1.6,
                    }}
                  >
                    Если включено, курс сразу появится в каталоге для пользователей.
                    Если выключено — останется черновиком.
                  </p>
                </div>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: TEXT,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="checkbox"
                    name="isPublished"
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: LAVENDER,
                    }}
                  />
                  Активен
                </label>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                }}
              >
                <Link
                  href="/admin"
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${PEACH_BORDER}`,
                    background: '#fff',
                    color: MUTED,
                    padding: '11px 22px',
                    fontSize: 12,
                    textDecoration: 'none',
                  }}
                >
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
                  Создать курс
                </button>
              </div>
            </form>
          </section>

          <aside
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.72)',
                border: `1px solid ${PEACH_BORDER}`,
                borderRadius: 24,
                padding: 18,
              }}
            >
              <div
                style={{
                  height: 150,
                  borderRadius: 18,
                  background:
                    'linear-gradient(135deg, #E8D5E8 0%, #AD82A6 100%)',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 34,
                }}
              >
                ✦
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  width: 'fit-content',
                  borderRadius: 999,
                  padding: '5px 12px',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#A0502A',
                  background: '#FDE8DC',
                  border: '1px solid #F0CDBD',
                  marginBottom: 12,
                }}
              >
                Новый курс
              </span>

              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 28,
                  lineHeight: 1.1,
                  color: TEXT,
                  marginBottom: 8,
                }}
              >
                Основа курса
              </p>

              <p
                style={{
                  fontSize: 13,
                  color: MUTED,
                  lineHeight: 1.7,
                }}
              >
                Сначала создаём карточку курса. Потом открываем редактирование и
                добавляем уроки с видео, описанием и порядком.
              </p>
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
                Подсказка
              </p>

              <p
                style={{
                  fontSize: 13,
                  color: '#7A5278',
                  lineHeight: 1.7,
                }}
              >
                Slug лучше писать латиницей без пробелов: например{' '}
                <b>flat-belly</b>, <b>healthy-back</b>, <b>strong-body</b>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label style={{ display: 'block' }}>
      <span
        style={{
          display: 'block',
          fontSize: 10,
          color: MUTED,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 7,
        }}
      >
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