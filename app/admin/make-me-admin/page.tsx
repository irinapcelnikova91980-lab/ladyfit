import { auth } from '@clerk/nextjs/server'
import { prisma } from '../../lib/prisma'
import { makeMeAdmin } from './server-actions'

export default async function MakeMeAdminPage() {
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    return <div className="p-10">Нужно войти</div>
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  // 👉 Разрешаем только если уже админ
  if (!user || user.role !== 'admin') {
    return <div className="p-10">Нет доступа</div>
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Админ-панель</h1>

      <form action={makeMeAdmin} className="mt-8">
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-2 text-white"
        >
          Сделать меня админом
        </button>
      </form>
    </main>
  )
}