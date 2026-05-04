import Link from 'next/link'
import CertModal from './CertModal'

const B = '#AD82A6'
const BL = '#f3eef5'
const BB = '#e8d5e8'
const BT = '#7a5278'
const SERIF = 'var(--font-cormorant), Georgia, serif'

const certPhotos = [
  { id: 1, label: 'Сертификат тренера по коррекции фигуры', src: null },
  { id: 2, label: 'Сертификат InstructorPRO', src: null },
]

export default function AboutPage() {
  const approach = [
    'Плавная коррекция через уважение к телу',
    'Возможность встроить спорт в свою жизнь',
    'Никакого сложного оборудования — работаем с тем, что есть дома или в зале',
    'Разбираем блоки и зажимы через тело и честность',
  ]

  return (
    <div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64, alignItems: 'center' }}>
          <div>
            <span style={{
              display: 'inline-block', borderRadius: 999, padding: '4px 12px',
              fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: BL, color: BT, border: `0.5px solid ${BB}`, marginBottom: 20,
            }}>
              О тренере
            </span>
            <h1 style={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
              fontSize: 56, lineHeight: 1.05, marginBottom: 20,
            }}>
              Марина Сомра
            </h1>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.9, fontWeight: 300, marginBottom: 16 }}>
              Сертифицированный тренер по коррекции фигуры. Предлагаю тренировки по снижению веса в связке духовного и физического.
            </p>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.9, fontWeight: 300, marginBottom: 28 }}>
              Я работаю там, где фитнес встречается с душой. Разбираем блоки и зажимы через тело и честность. Для тех, кто устал от «сахарной» мотивации и готов работать с глубинным.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link
                href="/courses"
                style={{
                  display: 'inline-flex', alignItems: 'center', borderRadius: 999,
                  padding: '12px 28px', fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: B, color: '#fff', textDecoration: 'none',
                }}
              >
                Мои курсы
              </Link>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', borderRadius: 999,
                  padding: '12px 28px', fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: 'transparent', color: B, border: `1px solid ${B}`,
                  textDecoration: 'none',
                }}
              >
                Написать в Telegram
              </a>
            </div>
          </div>

          {/* Photo placeholder */}
          <div style={{
            height: 420, borderRadius: 24,
            background: `repeating-linear-gradient(45deg,${BB}33 0,${BB}33 1px,transparent 1px,transparent 16px), ${BL}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ opacity: 0.6, fontSize: 11, fontFamily: 'monospace', color: BT }}>
              фото тренера
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 64 }}>
          {[
            ['9', 'лет в фитнесе'],
            ['Тело + душа', 'глубокий подход'],
            ['InstructorPRO', 'сертификат'],
          ].map(([n, l]) => (
            <div key={l} style={{ background: '#fff', borderRadius: 20, padding: '28px 20px', textAlign: 'center', border: '1px solid #ede8e8' }}>
              <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 32, color: B, marginBottom: 6 }}>{n}</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: '#aaa' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Story + Approach */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }}>
          <div>
            <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 36, marginBottom: 20 }}>
              Моя история
            </h2>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.9, fontWeight: 300, marginBottom: 16 }}>
              Я наблюдала 8 лет одно и то же: тело не меняется, пока психика держит оборону.
            </p>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.9, fontWeight: 300 }}>
              Это открытие изменило мой подход навсегда. Сегодня я работаю на пересечении фитнеса и внутреннего состояния — там, где настоящие изменения и происходят.
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 36, marginBottom: 20 }}>
              Мой подход
            </h2>
            {approach.map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: BL, border: `1px solid ${B}`, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: BT, marginTop: 1,
                }}>✓</div>
                <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5, fontWeight: 300 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 36, marginBottom: 8 }}>
            Сертификаты
          </h2>
          <p style={{ fontSize: 13, color: '#aaa', fontWeight: 300, marginBottom: 28 }}>
            Нажмите на сертификат, чтобы посмотреть крупнее
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {certPhotos.map(cert => (
              <CertModal key={cert.id} cert={cert} />
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div style={{
          background: 'linear-gradient(135deg,#c49abf 0%,#AD82A6 100%)',
          borderRadius: 24, padding: '48px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 20px)',
          }} />
          <div style={{ position: 'relative' }}>
            <h3 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 40, color: '#fff', marginBottom: 16 }}>
              Готова начать путь?
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', marginBottom: 28, fontWeight: 300 }}>
              Выбери курс и начни работу с телом и собой уже сегодня
            </p>
            <Link
              href="/courses"
              style={{
                display: 'inline-flex', alignItems: 'center', borderRadius: 999,
                padding: '12px 28px', fontSize: 12, fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: '#fff', color: B, textDecoration: 'none',
              }}
            >
              Выбрать курс
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #ede8e8', marginTop: 80, padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: B, marginBottom: 6 }}>LadyFit</div>
            <p style={{ fontSize: 12, color: '#999', maxWidth: 260, lineHeight: 1.7 }}>
              Платформа онлайн-тренировок Марины Сомра. Там, где фитнес встречается с душой.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              ['Курсы', ['/courses', '/courses', '/courses', '/courses'], ['Подтянутое тело', 'Плоский живот', 'Упругость', 'Здоровая спина']],
              ['Контакты', ['#', '#'], ['Telegram', 'Email']],
              ['Документы', ['#', '#', '#'], ['Оферта', 'Политика', 'Возврат']],
            ].map(([title, hrefs, labels]) => (
              <div key={title as string}>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: 10 }}>
                  {title as string}
                </p>
                {(labels as string[]).map((label, i) => (
                  <Link key={label} href={(hrefs as string[])[i]} style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '24px auto 0', borderTop: '1px solid #ede8e8', paddingTop: 20, fontSize: 11, color: '#bbb' }}>
          © 2025 LadyFit. Все права защищены.
        </div>
      </footer>
    </div>
  )
}
