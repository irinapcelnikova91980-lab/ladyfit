import { createLesson } from './server-actions'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function NewLessonPage({ params }: Props) {
  const { slug } = await params

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Добавить урок</h1>

      <form action={createLesson} className="mt-8 max-w-xl space-y-4">
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label className="mb-1 block font-medium">Название урока</label>
          <input
            type="text"
            name="title"
            className="w-full rounded-xl border px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Описание</label>
          <textarea
            name="content"
            className="w-full rounded-xl border px-4 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Ссылка на видео</label>
          <input
            type="text"
            name="videoUrl"
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Порядок урока</label>
          <input
            type="number"
            name="order"
            className="w-full rounded-xl border px-4 py-2"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isFree" id="isFree" />
          <label htmlFor="isFree">Бесплатный урок</label>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-2 text-white"
        >
          Создать урок
        </button>
      </form>
    </main>
  )
}