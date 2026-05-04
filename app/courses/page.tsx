import { prisma } from '../lib/prisma'
import CoursesGrid from './CoursesGrid'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, slug: true, title: true, description: true, price: true },
  })

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <CoursesGrid courses={courses} />
    </main>
  )
}