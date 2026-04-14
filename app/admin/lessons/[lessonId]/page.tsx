import { auth } from '@clerk/nextjs/server'
import { prisma } from '../../../lib/prisma'
import { updateLesson } from './server-actions'
import { deleteLesson } from './delete/server-actions'

type Props = {
  params: Promise<{ lessonId: string }>
}

export default async function EditLessonPage({ params }: Props) {
  const { lessonId } = await params
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    return <div className="p-10">Нужно войти</div>
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  if (!user || user.role !== 'admin') {
    return <div className="p-10">Нет доступа</div>
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: true,
    },
  })

  if (!lesson) {
    return <div className="p-10">Урок не найден</div>
  }

  return (
    <main className="max-w-xl p-10">
      <h1 className="text-3xl font-bold">Редактировать урок</h1>

      <p className="mt-2 text-sm text-gray-500">
        Курс: {lesson.course.title}
      </p>

      <form action={updateLesson} className="mt-8 space-y-4">
        <input type="hidden" name="lessonId" value={lesson.id} />
        <input type="hidden" name="courseSlug" value={lesson.course.slug} />

        <div>
          <label className="mb-1 block font-medium">Название урока</label>
          <input
            name="title"
            defaultValue={lesson.title}
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Описание</label>
          <textarea
            name="content"
            defaultValue={lesson.content ?? ''}
            className="w-full rounded-xl border px-4 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Ссылка на видео</label>
          <input
            name="videoUrl"
            defaultValue={lesson.videoUrl ?? ''}
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Порядок урока</label>
          <input
            type="number"
            name="order"
            defaultValue={lesson.order}
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFree"
            id="isFree"
            defaultChecked={lesson.isFree}
          />
          <label htmlFor="isFree">Бесплатный урок</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-black px-6 py-2 text-white"
          >
            Сохранить
          </button>
        </div>
      </form>

      <form action={deleteLesson} className="mt-6">
        <input type="hidden" name="lessonId" value={lesson.id} />
        <input type="hidden" name="courseSlug" value={lesson.course.slug} />

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-6 py-2 text-white"
        >
          Удалить урок
        </button>
      </form>
    </main>
  )
}