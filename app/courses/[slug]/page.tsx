import Link from 'next/link'
import { prisma } from '../../lib/prisma'

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

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">{course.title}</h1>

      <p className="mt-4 text-gray-600">
        {course.description ?? 'Без описания'}
      </p>

      <p className="mt-6 text-xl font-semibold">{course.price} ₽</p>

      <div className="mt-8">
        <Link
          href={`/courses/${course.slug}/lessons/new`}
          className="inline-block rounded-xl border px-4 py-2"
        >
          Добавить урок
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Уроки</h2>

        {course.lessons.length === 0 ? (
          <p className="mt-4">Пока нет уроков</p>
        ) : (
          <div className="mt-4 space-y-4">
            {course.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/courses/${course.slug}/lessons/${lesson.id}`}
                className="block rounded-xl border p-4 hover:bg-gray-50"
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
            ))}
          </div>
        )}
      </div>
    </main>
  )
}