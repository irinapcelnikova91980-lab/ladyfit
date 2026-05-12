'use server'

import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '../../lib/prisma'
import { isOwner } from '../../lib/owner'

export async function makeMeUser() {
  const { userId: clerkId } = await auth()
  if (!isOwner(clerkId)) notFound()

  await prisma.user.update({
    where: { clerkId: clerkId! },
    data: { role: 'user' },
  })

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function makeMeAdmin() {
  const { userId: clerkId } = await auth()
  if (!isOwner(clerkId)) notFound()

  await prisma.user.update({
    where: { clerkId: clerkId! },
    data: { role: 'admin' },
  })

  revalidatePath('/', 'layout')
  redirect('/')
}
