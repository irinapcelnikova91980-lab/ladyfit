import { grantAccess } from './server-actions'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function GrantAccessPage({ params }: Props) {
  const { slug } = await params

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Выдать доступ к курсу</h1>

      <form action={grantAccess} className="mt-8">
        <input type="hidden" name="slug" value={slug} />

        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-2 text-white"
        >
          Выдать мне доступ
        </button>
      </form>
    </main>
  )
}