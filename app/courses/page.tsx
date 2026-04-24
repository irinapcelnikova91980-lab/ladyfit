import Link from 'next/link'
import { prisma } from '../lib/prisma'

const BRAND = '#AD82A6'

const cardTops = [
  'linear-gradient(135deg, #e8d5e8 0%, #AD82A6 100%)',
  'linear-gradient(135deg, #dce8f0 0%, #8aaec4 100%)',
  'linear-gradient(135deg, #e8e4d5 0%, #b8a882 100%)',
  'linear-gradient(135deg, #d5e8e0 0%, #82a896 100%)',
  'linear-gradient(135deg, #e8dcd5 0%, #a8907e 100%)',
]

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">

      {/* Заголовок */}
      <div className="mb-8 flex items-baseline justify-between border-b border-gray-100 pb-4">
        <h1
          className="text-4xl font-light italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Курсы
        </h1>
        <span className="text-xs uppercase tracking-widest text-gray-400">
          {courses.length}{' '}
          {courses.length === 1 ? 'курс' : courses.length < 5 ? 'курса' : 'курсов'}
        </span>
      </div>

      {courses.length === 0 ? (
        <p className="py-16 text-center text-sm italic text-gray-400">
          Пока нет курсов
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course: any, index: number) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 transition-colors hover:border-[#AD82A6]"
            >
              {/* Цветная шапка */}
              <div
                className="relative flex h-32 items-end p-4"
                style={{ background: cardTops[index % cardTops.length] }}
              >
                <span
                  className="absolute right-4 top-2 font-light text-white/25"
                  style={{ fontFamily: 'Georgia, serif', fontSize: '48px', lineHeight: 1 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="rounded-full bg-white/25 px-3 py-1 text-[10px] uppercase tracking-widest text-white">
                  Онлайн-курс
                </span>
              </div>

              {/* Тело карточки */}
              <div className="flex flex-1 flex-col bg-white p-4">
                <p className="mb-1.5 text-sm font-medium">{course.title}</p>
                <p className="mb-4 text-xs font-light leading-relaxed text-gray-400">
                  {course.description ?? 'Описание появится здесь'}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span
                    className="text-xl font-light"
                    style={{ fontFamily: 'Georgia, serif', color: BRAND }}
                  >
                    {course.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full border text-xs"
                    style={{ borderColor: BRAND, color: BRAND }}
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}