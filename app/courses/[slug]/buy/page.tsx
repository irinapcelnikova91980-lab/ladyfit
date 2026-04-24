import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/auth'
import { buyCourse } from './server-actions'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BuyCoursePage({ params }: Props) {
  const { slug } = await params
  const user = await getCurrentUser()

  if (!user) {
    return <div className="p-10">Нужно войти, чтобы купить курс</div>
  }

  const course = await prisma.course.findUnique({
    where: { slug },
  })

  if (!course) {
    return <div className="p-10">Курс не найден</div>
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Покупка курса</h1>

      <div className="mt-6 rounded-xl border p-6">
        <p className="text-xl font-semibold">{course.title}</p>
        <p className="mt-2 text-gray-600">
          {course.description ?? 'Без описания'}
        </p>
        <p className="mt-4 text-2xl font-bold">{course.price} ₽</p>

        <form action={buyCourse} className="mt-6">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="slug" value={course.slug} />

          <button
            type="submit"
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            Оплатить тестово
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500">
          Сейчас это тестовая покупка без реального списания денег.
        </p>
      </div>
    </main>
  )
}