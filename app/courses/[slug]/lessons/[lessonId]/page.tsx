import Link from 'next/link'
import { prisma } from '../../../../lib/prisma'

type Props = {
  params: Promise<{
    slug: string
    lessonId: string
  }>
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params

  const course = await prisma.course.findUnique({
    where: { slug },
  })

  if (!course) {
    return <div className="p-10">Курс не найден</div>
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  })

  if (!lesson) {
    return <div className="p-10">Урок не найден</div>
  }

  return (
    <main className="p-10">
      <Link
        href={`/courses/${course.slug}`}
        className="inline-block rounded-xl border px-4 py-2"
      >
        Назад к курсу
      </Link>

      <h1 className="mt-6 text-3xl font-bold">{lesson.title}</h1>

      <p className="mt-4 text-gray-600">
        {lesson.content ?? 'Без описания'}
      </p>

      <div className="mt-6">
        {lesson.isFree ? (
          <div className="rounded-xl border p-4">
            <p className="font-medium">Это бесплатный урок</p>

            {lesson.videoUrl ? (
              <div className="mt-4">
                <iframe
                  src={lesson.videoUrl}
                  className="h-[400px] w-full rounded-xl"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Видео пока не добавлено
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border p-6">
            <p className="text-xl font-semibold">Урок платный</p>
            <p className="mt-2 text-gray-600">
              Для просмотра этого урока позже понадобится доступ к курсу.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}