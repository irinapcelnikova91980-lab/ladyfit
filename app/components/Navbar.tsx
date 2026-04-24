import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { getCurrentUser } from '../lib/auth'
import BurgerMenu from './BurgerMenu'

const OWNER_CLERK_ID = 'user_3Bnw99FHrFWc0MkKwkdXCw9Y4Gr'

export default async function Navbar() {
  noStore()

  const { userId: clerkId } = await auth()
  const user = await getCurrentUser()
  const role = user?.role
  const isOwner = clerkId === OWNER_CLERK_ID

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex w-full items-center px-2 py-4">

        {/* Левый блок: бургер + профиль вплотную */}
        <div className="flex items-center gap-1">
  {user && <UserButton />}
  <BurgerMenu isLoggedIn={!!user} role={role} isOwner={isOwner} />
</div>

        {/* Логотип строго по центру */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-lg font-bold text-gray-900">
            LadyFit
          </Link>
        </div>

      </div>
    </header>
  )
}