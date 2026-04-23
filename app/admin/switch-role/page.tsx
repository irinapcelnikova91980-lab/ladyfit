import { requireAuth } from '../../lib/auth'
import { makeMeAdmin, makeMeUser } from './server-actions'

export default async function SwitchRolePage() {
  await requireAuth()

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Переключение роли</h1>

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