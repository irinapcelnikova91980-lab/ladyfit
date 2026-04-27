import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './lib/prisma'
import Link from 'next/link'

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
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <section
        className="relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-2xl px-10 py-12"
        style={{ background: 'linear-gradient(135deg, #c49abf 0%, #AD82A6 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px)',
          }}
        />

        <div className="relative flex max-w-xl flex-col gap-5">
          <span
            className="w-fit rounded-full px-4 py-1 text-[10px] font-medium uppercase tracking-widest text-white"
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '0.5px solid rgba(255,255,255,0.35)',
            }}
          >
            Платформа онлайн-тренировок
          </span>

          <h1
            className="text-6xl font-light italic text-white"
            style={{ fontFamily: 'Georgia, serif', lineHeight: 1.05 }}
          >
            LadyFit
          </h1>

          <p className="max-w-md text-sm font-light text-white/75">
            Стань лучшей версией себя — в любое время и в любом месте
          </p>

          <div className="flex gap-3">
            <Link
              href="/courses"
              className="rounded-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-widest"
              style={{ color: '#AD82A6' }}
            >
              Смотреть курсы →
            </Link>

            <Link
              href="/about"
              className="rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white"
              style={{ border: '1px solid rgba(255,255,255,0.5)' }}
            >
              О тренере
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { num: '1 200+', label: 'учениц прошли курсы' },
          { num: '8 лет', label: 'тренерского опыта' },
          { num: '52', label: 'видео-урока' },
          { num: '4.9', label: 'средняя оценка' },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-center"
          >
            <div
              className="mb-1 text-3xl font-light italic"
              style={{ fontFamily: 'Georgia, serif', color: '#AD82A6' }}
            >
              {m.num}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-gray-400">
              {m.label}
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between border-b border-gray-100 pb-3">
          <h2
            className="text-3xl font-light italic"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Почему LadyFit
          </h2>
          <p className="text-sm text-gray-400">
            Три причины, по которым ученицы возвращаются
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: '✦',
              title: 'Профессионально',
              desc: 'Курсы от сертифицированного тренера с 8-летним опытом',
            },
            {
              icon: '◎',
              title: 'Удобно',
              desc: 'Занимайтесь в своём темпе и ритме — без расписания',
            },
            {
              icon: '◇',
              title: 'Результат',
              desc: 'Реальные изменения за 30 дней или возврат денег',
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-3 text-xl" style={{ color: '#AD82A6' }}>
                {f.icon}
              </div>
              <p className="mb-1 text-sm font-medium">{f.title}</p>
              <p className="text-xs font-light leading-relaxed text-gray-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between border-b border-gray-100 pb-3">
          <h2
            className="text-3xl font-light italic"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Популярные курсы
          </h2>

          <Link href="/courses" className="text-sm" style={{ color: '#AD82A6' }}>
            Все курсы →
          </Link>
        </div>

        {courses.length === 0 ? (
          <p className="py-8 text-center text-sm italic text-gray-400">
            Курсы скоро появятся
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {courses.map((course, i) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:border-[#AD82A6]"
              >
                <div
                  className="relative flex h-36 items-end p-4"
                  style={{ background: 'linear-gradient(135deg, #e8d5e8 0%, #AD82A6 100%)' }}
                >
                  <span
                    className="absolute right-4 top-3 font-light italic text-white/25"
                    style={{ fontFamily: 'Georgia, serif', fontSize: 52, lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white"
                    style={{
                      background: 'rgba(255,255,255,0.22)',
                      border: '0.5px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    Онлайн-курс
                  </span>
                </div>

                <div className="flex flex-col gap-2 p-5">
                  <p className="text-sm font-medium">{course.title}</p>

                  <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">
                    {course.description ?? ''}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className="text-xl font-light italic"
                      style={{ fontFamily: 'Georgia, serif', color: '#AD82A6' }}
                    >
                      {course.price.toLocaleString('ru-RU')} ₽
                    </span>

                    <span
                      className="grid h-7 w-7 place-items-center rounded-full text-xs"
                      style={{ border: '1px solid #AD82A6', color: '#AD82A6' }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section
        className="flex items-center justify-between gap-6 rounded-2xl p-8"
        style={{ background: '#f3eef5', border: '1px solid #e8d5e8' }}
      >
        <div className="flex flex-col gap-2">
          <span
            className="w-fit rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-widest"
            style={{ background: '#e8d5e8', color: '#AD82A6' }}
          >
            Telegram-канал
          </span>

          <h3
            className="text-xl font-light italic"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Бесплатные мини-тренировки каждую неделю
          </h3>

          <p className="text-sm text-gray-400">
            Короткие видео, чек-листы, разборы техники — в нашем Telegram.
          </p>
        </div>

        <a
          href="https://t.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white"
          style={{ background: '#AD82A6' }}
        >
          ✈ Подписаться
        </a>
      </section>

      <section className="flex flex-col gap-4">
        <h2
          className="text-3xl font-light italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Говорят ученицы
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              name: 'Анна, 32',
              course: 'Пресс',
              text: 'За 4 недели ушли 3 см с талии. Главное — наконец-то полюбила тренировки.',
            },
            {
              name: 'Мария, 28',
              course: 'Ягодицы',
              text: 'Марина объясняет так, что после первой недели понимаешь какие мышцы работают.',
            },
            {
              name: 'Елена, 41',
              course: 'Спина',
              text: 'Утром перестала просыпаться с болью в пояснице. Это бесценно.',
            },
          ].map((r) => (
            <div
              key={r.name}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6"
            >
              <p
                className="text-base font-light italic leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                «{r.text}»
              </p>

              <div className="mt-auto flex items-center gap-3">
                <div
                  className="h-9 w-9 flex-shrink-0 rounded-full"
                  style={{ background: '#f3eef5', border: '1px solid #AD82A6' }}
                />

                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-[11px] uppercase tracking-widest text-gray-400">
                    курс «{r.course}»
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="flex items-center justify-between gap-6 rounded-2xl px-8 py-8"
        style={{ border: '0.5px solid #AD82A6' }}
      >
        <h3
          className="text-3xl font-light italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Готова начать?
        </h3>

        <Link
          href="/courses"
          className="flex-shrink-0 rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white"
          style={{ background: '#AD82A6' }}
        >
          Выбрать курс
        </Link>
      </section>

      <footer className="grid grid-cols-1 gap-8 border-t border-gray-100 pt-8 pb-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span
            className="text-xl font-light italic"
            style={{ fontFamily: 'Georgia, serif', color: '#AD82A6' }}
          >
            LadyFit
          </span>
          <p className="text-xs text-gray-400">Платформа онлайн-тренировок</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Курсы
            </p>
            <Link href="/courses" className="text-xs text-gray-500 hover:text-[#AD82A6]">
              Каталог
            </Link>
            <Link href="/my-courses" className="text-xs text-gray-500 hover:text-[#AD82A6]">
              Мои курсы
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Контакты
            </p>
            <a href="https://t.me/" className="text-xs text-gray-500 hover:text-[#AD82A6]">
              Telegram
            </a>
            <a
              href="mailto:info@ladyfit.ru"
              className="text-xs text-gray-500 hover:text-[#AD82A6]"
            >
              Email
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Документы
            </p>
            <Link href="/offer" className="text-xs text-gray-500 hover:text-[#AD82A6]">
              Оферта
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-[#AD82A6]">
              Политика
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}