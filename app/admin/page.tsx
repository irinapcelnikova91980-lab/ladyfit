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
    <main className="p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Админ-панель</h1>

        <Link
          href="/courses/new"
          className="rounded-xl bg-black px-4 py-2 text-white"
        >
          Создать курс
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {courses.length === 0 ? (
          <p>Курсов пока нет</p>
        ) : (
          courses.map((course: any) => (
            <div
              key={course.id}
              className="rounded-xl border p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="block flex-1"
                >
                  <p className="text-xl font-semibold">{course.title}</p>
                  <p className="text-sm text-gray-600">
                    {course.description ?? 'Без описания'}
                  </p>
                  <p className="mt-2 font-medium">{course.price} ₽</p>
                  <p className="text-sm text-gray-500">
                    Уроков: {course.lessons.length}
                  </p>
                </Link>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="rounded-xl border px-4 py-2 text-center"
                  >
                    Редактировать
                  </Link>

                  <form action={deleteCourse}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <button
                      type="submit"
                      className="rounded-xl bg-red-600 px-4 py-2 text-white"
                    >
                      Удалить
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}