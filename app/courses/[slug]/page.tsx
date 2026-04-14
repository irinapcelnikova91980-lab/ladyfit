import Link from 'next/link'
import { prisma } from '../../lib/prisma'
import { getCurrentUser } from '../../lib/auth'
import { hasCourseAccess } from '../../lib/access'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) {
    return <div className="p-10">Курс не найден</div>
  }

  const user = await getCurrentUser()
  const isAdmin = user?.role === 'admin'

  const hasAccess = isAdmin
    ? true
    : user
      ? await hasCourseAccess(user.id, course.id)
      : false

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">{course.title}</h1>

      <p className="mt-4 text-gray-600">
        {course.description ?? 'Без описания'}
      </p>

      <p className="mt-6 text-xl font-semibold">{course.price} ₽</p>

      <div className="mt-4">
        {hasAccess ? (
          <p className="font-medium text-green-700">
            {isAdmin ? 'Ты администратор: полный доступ к курсу' : 'У тебя есть доступ к курсу'}
          </p>
        ) : (
          <p className="font-medium text-red-700">
            Доступа к курсу пока нет
          </p>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        {isAdmin && (
          <Link
            href={`/courses/${course.slug}/lessons/new`}
            className="inline-block rounded-xl border px-4 py-2"
          >
            Добавить урок
          </Link>
        )}

        {!hasAccess && !isAdmin && (
          <Link
            href={`/courses/${course.slug}/grant-access`}
            className="inline-block rounded-xl bg-black px-4 py-2 text-white"
          >
            Выдать тестовый доступ
          </Link>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Уроки</h2>

        {course.lessons.length === 0 ? (
          <p className="mt-4">Пока нет уроков</p>
        ) : (
          <div className="mt-4 space-y-4">
            {course.lessons.map((lesson: any) => (
              <div key={lesson.id} className="rounded-xl border p-4">
                <Link
                  href={`/courses/${course.slug}/lessons/${lesson.id}`}
                  className="block hover:bg-gray-50"
                >
                  <p className="font-medium">
                    {lesson.order}. {lesson.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {lesson.content ?? 'Без описания'}
                  </p>
                  <p className="mt-2 text-sm">
                    {lesson.isFree ? 'Бесплатный урок' : 'Платный урок'}
                  </p>
                </Link>

                {isAdmin && (
                  <div className="mt-3">
                    <Link
                      href={`/admin/lessons/${lesson.id}`}
                      className="inline-block rounded-xl border px-4 py-2"
                    >
                      Редактировать урок
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}