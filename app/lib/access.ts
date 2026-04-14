import { prisma } from './prisma'

export async function hasCourseAccess(userId: string, courseId: string) {
  const access = await prisma.courseAccess.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  })

  return !!access
}