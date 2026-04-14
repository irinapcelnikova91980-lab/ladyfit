'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '../../../app/lib/prisma'

export async function makeMeAdmin() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Нужно войти в аккаунт')
  }

  await prisma.user.update({
    where: { clerkId },
    data: { role: 'admin' },
  })

  redirect('/users')
}