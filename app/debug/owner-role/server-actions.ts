'use server'

import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '../../lib/prisma'

const OWNER_CLERK_ID = 'user_3Bnw99FHrFWc0MkKwkdXCw9Y4Gr'

export async function makeMeUser() {
  const { userId: clerkId } = await auth()

  if (!clerkId || clerkId !== OWNER_CLERK_ID) {
    notFound()
  }

  await prisma.user.update({
    where: { clerkId },
    data: { role: 'user' },
  })

  revalidatePath('/')
  revalidatePath('/courses')
  revalidatePath('/admin')
  revalidatePath('/my-courses')
  revalidatePath('/debug/owner-role')

  redirect('/')
}

export async function makeMeAdmin() {
  const { userId: clerkId } = await auth()

  if (!clerkId || clerkId !== OWNER_CLERK_ID) {
    notFound()
  }

  await prisma.user.update({
    where: { clerkId },
    data: { role: 'admin' },
  })

  revalidatePath('/')
  revalidatePath('/courses')
  revalidatePath('/admin')
  revalidatePath('/my-courses')
  revalidatePath('/debug/owner-role')

  redirect('/')
}