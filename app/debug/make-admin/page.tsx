import { auth } from '@clerk/nextjs/server'
import { prisma } from '../../lib/prisma'

export default async function MakeAdminPage() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return <div className="p-10">Нужно войти</div>
  }

  await prisma.user.update({
    where: { clerkId },
    data: { role: 'admin' },
  })

  return <div className="p-10">Теперь ты admin. Открой /admin</div>
}