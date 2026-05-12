import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './lib/prisma'
import Link from 'next/link'

const B = '#AD82A6'
const BL = '#f3eef5'
const BB = '#e8d5e8'

const SERIF = 'var(--font-cormorant), Georgia, serif'

const CARD_TOPS = [
  'linear-gradient(135deg,#e8d5e8 0%,#AD82A6 100%)',
  'linear-gradient(135deg,#dce8f0 0%,#8aaec4 100%)',
  'linear-gradient(135deg,#e8e4d5 0%,#b8a882 100%)',
]

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress
    if (email) {
      await prisma.user.upsert({
        where: { clerkId: userId },
        update: { email, name: user.firstName ?? null },
        create: { clerkId: userId, email, name: user.firstName ?? null },
      })
    }
  }

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { lessons: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Hero */}
      <section style={{
        position: 'relative', minHeight: 380, borderRadius: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #c49abf 0%, #AD82A6 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '48px 48px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px)',
        }} />
        <div style={{ position: 'relative', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{
            display: 'inline-block', width: 'fit-content',
            borderRadius: 999, padding: '4px 16px',
            fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#fff',
            background: 'rgba(255,255,255,0.2)',
            border: '0.5px solid rgba(255,255,255,0.35)',
          }}>
            Платформа онлайн-тренировок
          </span>
          <h1 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 72, color: '#fff', lineHeight: 1 }}>
            SomraFit
          </h1>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.75)', maxWidth: 380 }}>
            Стань лучшей версией себя — в любое время и в любом месте
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/courses" style={{
              borderRadius: 999, background: '#fff', color: B,
              padding: '12px 28px', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
            }}>
              Смотреть курсы →
            </Link>
            <Link href="/about" style={{
              borderRadius: 999, color: '#fff',
              padding: '12px 28px', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.5)',
            }}>
              О тренере
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { num: '1 200+', label: 'учениц прошли курсы' },
          { num: '8 лет', label: 'тренерского опыта' },
          { num: '52', label: 'видео-урока' },
          { num: '4.9', label: 'средняя оценка' },
        ].map((m) => (
          <div key={m.label} style={{
            background: '#fff', borderRadius: 20, border: '1px solid #ede8e8',
            padding: '24px 16px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 32, color: B, fontWeight: 300, marginBottom: 6 }}>
              {m.num}
            </div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa' }}>
              {m.label}
            </div>
          </div>
        ))}
      </section>

      {/* Why SomraFit */}
      <section>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #ede8e8', paddingBottom: 16, marginBottom: 20 }}>
          <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 36 }}>Почему SomraFit</h2>
          <p style={{ fontSize: 12, color: '#aaa' }}>Три причины, по которым ученицы возвращаются</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { icon: '✦', title: 'Профессионально', desc: 'Курсы от сертифицированного тренера с 8-летним опытом' },
            { icon: '◎', title: 'Удобно', desc: 'Занимайтесь в своём темпе и ритме — без расписания' },
            { icon: '◇', title: 'Результат', desc: 'Реальные изменения за 30 дней или возврат денег' },
          ].map((f) => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 20, border: '1px solid #ede8e8', padding: '28px 24px' }}>
              <div style={{ fontSize: 20, color: B, marginBottom: 12 }}>{f.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: '#aaa', lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular courses */}
      <section>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #ede8e8', paddingBottom: 16, marginBottom: 20 }}>
          <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 36 }}>Популярные курсы</h2>
          <Link href="/courses" style={{ fontSize: 12, color: B, textDecoration: 'none' }}>Все курсы →</Link>
        </div>

        {courses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: 14, padding: '60px 0', fontStyle: 'italic', fontFamily: SERIF }}>
            Курсы скоро появятся
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {courses.map((course, i) => (
              <Link key={course.id} href={`/courses/${course.slug}`} style={{
                borderRadius: 20, overflow: 'hidden',
                border: '1px solid #ede8e8', background: '#fff',
                textDecoration: 'none', display: 'block',
              }}>
                <div style={{
                  height: 140, position: 'relative',
                  background: CARD_TOPS[i % CARD_TOPS.length],
                  display: 'flex', alignItems: 'flex-end', padding: 16,
                }}>
                  <span style={{
                    position: 'absolute', right: 16, top: 8,
                    fontFamily: SERIF, fontSize: 52, fontWeight: 300,
                    color: 'rgba(255,255,255,.2)', lineHeight: 1,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    borderRadius: 999, padding: '4px 12px',
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#fff',
                    background: 'rgba(255,255,255,.22)',
                    border: '0.5px solid rgba(255,255,255,.35)',
                  }}>Онлайн-курс</span>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{course.title}</p>
                  <p style={{
                    fontSize: 12, color: '#888', lineHeight: 1.6, fontWeight: 300, marginBottom: 16,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  } as React.CSSProperties}>{course.description ?? ''}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: B }}>
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
            ))}
          </div>
        )}
      </section>

      {/* Telegram banner */}
      <section style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        borderRadius: 20, padding: '32px 40px',
        background: BL, border: `1px solid ${BB}`,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{
            display: 'inline-block', width: 'fit-content',
            borderRadius: 999, padding: '4px 12px', fontSize: 10,
            fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: BB, color: B,
          }}>Telegram-канал</span>
          <h3 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 24 }}>
            Бесплатные мини-тренировки каждую неделю
          </h3>
          <p style={{ fontSize: 13, color: '#aaa', fontWeight: 300 }}>
            Короткие видео, чек-листы, разборы техники — в нашем Telegram.
          </p>
        </div>
        <a href="https://t.me/" target="_blank" rel="noopener noreferrer" style={{
          flexShrink: 0, borderRadius: 999, background: B, color: '#fff',
          padding: '12px 28px', fontSize: 11, fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
        }}>
          ✈ Подписаться
        </a>
      </section>

      {/* Reviews */}
      <section>
        <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 36, marginBottom: 20 }}>
          Говорят ученицы
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { name: 'Анна, 32', course: 'Пресс', text: 'За 4 недели ушли 3 см с талии. Главное — наконец-то полюбила тренировки.' },
            { name: 'Мария, 28', course: 'Ягодицы', text: 'Марина объясняет так, что после первой недели понимаешь какие мышцы работают.' },
            { name: 'Елена, 41', course: 'Спина', text: 'Утром перестала просыпаться с болью в пояснице. Это бесценно.' },
          ].map((r) => (
            <div key={r.name} style={{
              background: '#fff', borderRadius: 20, border: '1px solid #ede8e8',
              padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 16, fontWeight: 300, lineHeight: 1.6, color: '#444', flex: 1 }}>
                «{r.text}»
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: BL, border: `1px solid ${B}`, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</p>
                  <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa' }}>курс «{r.course}»</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        borderRadius: 20, padding: '40px 48px',
        border: `1px solid ${B}`,
      }}>
        <h3 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 36 }}>Готова начать?</h3>
        <Link href="/courses" style={{
          flexShrink: 0, borderRadius: 999, background: B, color: '#fff',
          padding: '12px 28px', fontSize: 11, fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
        }}>
          Выбрать курс
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #ede8e8', paddingTop: 32, paddingBottom: 16, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
        <div>
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: B, display: 'block', marginBottom: 6 }}>SomraFit</span>
          <p style={{ fontSize: 12, color: '#aaa' }}>Платформа онлайн-тренировок</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { title: 'Курсы', links: [{ label: 'Каталог', href: '/courses' }, { label: 'Мои курсы', href: '/my-courses' }] },
            { title: 'Контакты', links: [{ label: 'Telegram', href: 'https://t.me/' }, { label: 'Email', href: 'mailto:info@somrafit.ru' }] },
            { title: 'Документы', links: [{ label: 'Оферта', href: '/offer' }, { label: 'Политика', href: '/privacy' }] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 12 }}>{col.title}</p>
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 8, textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </footer>

    </main>
  )
}
