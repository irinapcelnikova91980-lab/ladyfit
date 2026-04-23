import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { makeMeAdmin, makeMeUser } from './server-actions'

const OWNER_CLERK_ID = 'user_3Bnw99FHrFWc0MkKwkdXCw9Y4Gr'

export default async function OwnerRolePage() {
  const { userId: clerkId } = await auth()

  if (!clerkId || clerkId !== OWNER_CLERK_ID) {
    notFound()
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Режим владельца</h1>

      <div className="mt-8 flex gap-4">
        <form action={makeMeUser}>
          <button
            type="submit"
            className="rounded-xl border px-5 py-2"
          >
            Сделать меня user
          </button>
        </form>

        <form action={makeMeAdmin}>
          <button
            type="submit"
            className="rounded-xl bg-black px-5 py-2 text-white"
          >
            Сделать меня admin
          </button>
        </form>
      </div>
    </main>
  )
}