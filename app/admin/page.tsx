import Link from 'next/link'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../lib/auth'
import { deleteCourse } from './delete-course/server-actions'

export default async function AdminPage() {
  await requireAdmin()

  const courses = await prisma.course.findMany({
    include: {
      lessons: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">

      {/* Заголовок */}
      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
        <h1
          className="text-4xl font-light italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Админ-панель
        </h1>
        <Link
          href="/courses/new"
          className="rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          style={{ background: '#AD82A6' }}
        >
          + Создать курс
        </Link>
      </div>

      {/* Список курсов */}
      {courses.length === 0 ? (
        <p className="py-16 text-center text-sm italic text-gray-400">
          Курсов пока нет
        </p>
      ) : (
        <div className="space-y-3">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-2xl border border-gray-100 transition-colors hover:border-[#AD82A6]"
            >
              <div className="flex items-stretch">

                {/* Лавандовая полоска */}
                <div
                  className="w-1 flex-shrink-0"
                  style={{ background: '#AD82A6' }}
                />

                {/* Тело карточки */}
                <Link
                  href={`/courses/${course.slug}`}
                  className="flex-1 px-5 py-4"
                >
                  <p className="mb-1 text-sm font-medium">{course.title}</p>
                  <p className="mb-3 text-xs font-light text-gray-400">
                    {course.description ?? 'Без описания'}
                  </p>
                  <div className="flex gap-4">
                    <p className="text-xs text-gray-400">
                      <span
                        className="mr-1 font-light"
                        style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#AD82A6' }}
                      >
                        {course.price.toLocaleString('ru-RU')}
                      </span>
                      ₽
                    </p>
                    <p className="text-xs text-gray-400">
                      <span
                        className="mr-1 font-light"
                        style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#AD82A6' }}
                      >
                        {course.lessons.length}
                      </span>
                      {course.lessons.length === 1 ? 'урок' : course.lessons.length < 5 ? 'урока' : 'уроков'}
                    </p>
                  </div>
                </Link>

                {/* Кнопки */}
                <div
                  className="flex flex-col justify-center gap-2 border-l border-gray-100 px-4 py-4"
                >
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="rounded-lg px-4 py-2 text-center text-xs font-medium uppercase tracking-wide transition-colors"
                    style={{ border: '0.5px solid #AD82A6', color: '#AD82A6' }}
                  >
                    Редактировать
                  </Link>

                  <form action={deleteCourse}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <button
                      type="submit"
                      className="w-full rounded-lg px-4 py-2 text-xs font-medium uppercase tracking-wide"
                      style={{ background: '#fdf0f0', color: '#b85a5a', border: '0.5px solid #e8c4c4' }}
                    >
                      Удалить
                    </button>
                  </form>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}