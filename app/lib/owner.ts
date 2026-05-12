export function isOwner(clerkId?: string | null): boolean {
  const ownerId = process.env.OWNER_CLERK_ID
  return !!ownerId && clerkId === ownerId
}
