import { prisma } from '../lib/prisma'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Пользователи</h1>

      <div className="mt-6 space-y-4">
        {users.length === 0 ? (
          <p>Пользователей пока нет</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="rounded-xl border p-4">
              <p><strong>id:</strong> {user.id}</p>
              <p><strong>clerkId:</strong> {user.clerkId}</p>
              <p><strong>email:</strong> {user.email}</p>
              <p><strong>name:</strong> {user.name ?? '—'}</p>
              <p><strong>role:</strong> {user.role}</p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}