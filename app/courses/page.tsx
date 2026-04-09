import Link from 'next/link'
import { prisma } from '../lib/prisma'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Курсы</h1>

      {courses.length === 0 ? (
        <p className="mt-4">Пока нет курсов</p>
      ) : (
        <div className="mt-4 space-y-4">
          {courses.map((course: any) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="block rounded-xl border p-4 hover:bg-gray-50 cursor-pointer"
            >
              <p className="font-medium">{course.title}</p>
              <p className="text-sm text-gray-500">
                {course.description ?? 'Без описания'}
              </p>
              <p className="mt-2 font-semibold">{course.price} ₽</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}