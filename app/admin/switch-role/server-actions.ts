'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '../../lib/prisma'

export async function makeMeUser() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Нужно войти')
  }

  await prisma.user.update({
    where: { clerkId },
    data: { role: 'user' },
  })

  revalidatePath('/')
  revalidatePath('/courses')
  revalidatePath('/admin')
  revalidatePath('/my-courses')

  redirect('/')
}

export async function makeMeAdmin() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Нужно войти')
  }

  await prisma.user.update({
    where: { clerkId },
    data: { role: 'admin' },
  })

  revalidatePath('/')
  revalidatePath('/courses')
  revalidatePath('/admin')
  revalidatePath('/my-courses')

  redirect('/')
}