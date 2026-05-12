import { requireAdmin } from '../../lib/auth'
import { isOwner } from '../../lib/owner'
import { prisma } from '../../lib/prisma'
import { changeUserRole, deleteUser } from './server-actions'

const B = '#AD82A6'
const BL = '#f3eef5'
const BT = '#7a5278'

export default async function AdminUsersPage() {
  await requireAdmin()

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ede8e8', paddingBottom: 16, marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 40 }}>
          Пользователи
        </h1>
        <span style={{ fontSize: 12, color: '#aaa' }}>{users.length} чел.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {users.map((user) => {
          const owner = isOwner(user.clerkId)
          return (
            <div
              key={user.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: '#fff', borderRadius: 16,
                border: `1px solid ${owner ? '#d9c2d9' : '#ede8e8'}`,
                padding: '14px 20px',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: owner ? B : '#ede8e8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: owner ? '#fff' : '#888',
              }}>
                {(user.name?.[0] ?? user.email[0]).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                    {user.name ?? user.email}
                  </p>
                  {owner && (
                    <span style={{
                      fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                      textTransform: 'uppercase', borderRadius: 999,
                      padding: '2px 8px', background: BL, color: BT,
                      border: `0.5px solid ${B}`,
                    }}>
                      Владелец
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{user.email}</p>
              </div>

              {/* Role change */}
              <form action={changeUserRole} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="hidden" name="userId" value={user.id} />
                <select
                  name="role"
                  defaultValue={user.role}
                  style={{
                    fontSize: 12, borderRadius: 8, padding: '6px 10px',
                    border: '1px solid #ede8e8', background: '#fafafa',
                    color: '#555', fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  type="submit"
                  style={{
                    fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
                    textTransform: 'uppercase', borderRadius: 999,
                    padding: '6px 14px', background: BL, color: BT,
                    border: `0.5px solid ${B}`, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Сохранить
                </button>
              </form>

              {/* Delete — disabled for owner */}
              {!owner && (
                <form action={deleteUser}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    style={{
                      fontSize: 11, borderRadius: 8, padding: '6px 12px',
                      background: '#fdf0f0', color: '#b85a5a',
                      border: '0.5px solid #e8c4c4', cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Удалить
                  </button>
                </form>
              )}

              {owner && (
                <span style={{ fontSize: 11, color: '#ccc', minWidth: 60, textAlign: 'right' }}>
                  защищён
                </span>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
