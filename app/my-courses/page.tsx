import { redirect } from 'next/navigation'
import { prisma } from '../lib/prisma'
import { getCurrentUser } from '../lib/auth'
import MyCoursesClient from './MyCoursesClient'

function checkStreak(dates: string[], n: number): boolean {
  const unique = [...new Set(dates)].sort()
  if (unique.length < n) return false
  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1])
    const curr = new Date(unique[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      streak++
      if (streak >= n) return true
    } else {
      streak = 1
    }
  }
  return streak >= n
}

export default async function MyCoursesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const accesses = await prisma.courseAccess.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: { lessons: { select: { id: true }, orderBy: { order: 'asc' } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const progress = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
    select: { lessonId: true, createdAt: true },
  })

  type ProgressRow = { lessonId: string; createdAt: Date }
  const completedIds = new Set(progress.map((p: ProgressRow) => p.lessonId))
  const progressDates = progress.map((p: ProgressRow) => p.createdAt.toISOString().slice(0, 10))

  const courses = accesses.map(a => ({
    ...a.course,
    completedCount: a.course.lessons.filter(l => completedIds.has(l.id)).length,
  }))

  const achievements = [
    {
      icon: '🏆',
      title: 'Первый урок',
      desc: 'Просмотрен первый урок',
      earned: completedIds.size >= 1,
    },
    {
      icon: '🔥',
      title: '7 дней подряд',
      desc: 'Тренировки 7 дней кряду',
      earned: checkStreak(progressDates, 7),
    },
    {
      icon: '⭐',
      title: 'Курс завершён',
      desc: 'Пройден полный курс',
      earned: courses.some(c => c.lessons.length > 0 && c.completedCount === c.lessons.length),
    },
    {
      icon: '💪',
      title: '30 уроков',
      desc: 'Просмотрено 30 уроков',
      earned: completedIds.size >= 30,
    },
  ]

  return <MyCoursesClient courses={courses} achievements={achievements} />
}
