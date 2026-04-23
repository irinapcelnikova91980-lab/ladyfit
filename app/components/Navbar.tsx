import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { getCurrentUser } from '../lib/auth'
import BurgerMenu from './BurgerMenu'

const OWNER_CLERK_ID = 'user_3Bnw99FHrFWc0MkKwkdXCw9Y4G'

export default async function Navbar() {
  noStore()

  const { userId: clerkId } = await auth()
  const user = await getCurrentUser()
  const role = user?.role
  const isOwner = clerkId === OWNER_CLERK_ID

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center py-4">
        
        {/* 👈 БУРГЕР ПРЯМО В КРАЙНЕМ ЛЕВОМ УГЛУ */}
        <div className="absolute left-0 pl-4">
          <BurgerMenu
            isLoggedIn={!!user}
            role={role}
            isOwner={isOwner}
          />
        </div>

        {/* 🧠 ЛОГОТИП ПО ЦЕНТРУ */}
        <Link href="/" className="text-lg font-bold text-gray-900">
          LadyFit
        </Link>

        {/* 👤 ПРАВЫЙ КРАЙ */}
        <div className="absolute right-0 pr-4">
          {user && <UserButton />}
        </div>
      </div>
    </header>
  )
}