import { auth } from '@clerk/nextjs/server'
import { prisma } from '../../../lib/prisma'
import { updateCourse } from './server-actions'

type Props = {
  params: Promise<{ courseId: string }>
}

export default async function EditCoursePage({ params }: Props) {
  const { courseId } = await params
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

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  })

  if (!course) {
    return <div className="p-10">Курс не найден</div>
  }

  return (
    <main className="max-w-xl p-10">
      <h1 className="text-3xl font-bold">Редактировать курс</h1>

      <form action={updateCourse} className="mt-8 space-y-4">
        <input type="hidden" name="courseId" value={course.id} />

        <div>
          <label className="mb-1 block font-medium">Название</label>
          <input
            name="title"
            defaultValue={course.title}
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Описание</label>
          <textarea
            name="description"
            defaultValue={course.description ?? ''}
            className="w-full rounded-xl border px-4 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Цена</label>
          <input
            type="number"
            name="price"
            defaultValue={course.price}
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <button className="rounded-xl bg-black px-6 py-2 text-white">
          Сохранить
        </button>
      </form>
    </main>
  )
}