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
        update: {
          email,
          name: user.firstName ?? null,
        },
        create: {
          clerkId: userId,
          email,
          name: user.firstName ?? null,
        },
      })
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">

      {/* Герой */}
      <div
        className="relative mb-10 flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl px-10 py-12"
        style={{ background: '#AD82A6' }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px)',
          }}
        />
        <span
          className="mb-5 w-fit rounded-full px-4 py-1 text-[10px] font-medium uppercase tracking-widest text-white"
          style={{ background: 'rgba(255,255,255,0.2)', border: '0.5px solid rgba(255,255,255,0.35)' }}
        >
          Платформа онлайн-тренировок
        </span>
        <h1
          className="mb-3 text-6xl font-light italic text-white"
          style={{ fontFamily: 'Georgia, serif', lineHeight: 1.05 }}
        >
          LadyFit
        </h1>
        <p className="mb-7 text-sm font-light text-white/75">
          Стань лучшей версией себя — в любое время и в любом месте
        </p>
        <Link
          href="/courses"
          className="flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-widest"
          style={{ color: '#AD82A6' }}
        >
          Смотреть курсы →
        </Link>
      </div>

      {/* Три фичи */}
      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: '✦', title: 'Профессионально', desc: 'Курсы от сертифицированного тренера' },
          { icon: '◎', title: 'Удобно', desc: 'Занимайтесь в своём темпе и ритме' },
          { icon: '◇', title: 'Результат', desc: 'Реальные изменения за 30 дней' },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
          >
            <div className="mb-3 text-xl" style={{ color: '#AD82A6' }}>{f.icon}</div>
            <p className="mb-1 text-sm font-medium">{f.title}</p>
            <p className="text-xs font-light leading-relaxed text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="flex items-center justify-between rounded-2xl px-8 py-7"
        style={{ border: '0.5px solid #AD82A6' }}
      >
        <span
          className="text-2xl font-light italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Готова начать?
        </span>
        <Link
          href="/courses"
          className="rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white"
          style={{ background: '#AD82A6' }}
        >
          Выбрать курс
        </Link>
      </div>

    </main>
  )
}