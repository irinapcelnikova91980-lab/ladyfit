import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './lib/prisma'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    const user = await currentUser()

    const email = user?.emailAddresses?.[0]?.emailAddress

    if (email) {
      await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
          email,
          name: user.firstName ?? null,
        },
        create: {
          clerkId: userId,
          email,
          name: user.firstName ?? null,
        },
      })
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">LadyFit</h1>
      <p className="mt-4">Стань лучшей версией себя</p>
    </main>
  )
}