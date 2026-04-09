import { createCourse } from './server-actions'

export default function NewCoursePage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Создать курс</h1>

      <form action={createCourse} className="mt-8 max-w-xl space-y-4">
        <div>
          <label className="mb-1 block font-medium">Название курса</label>
          <input
            type="text"
            name="title"
            className="w-full rounded-xl border px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Slug</label>
          <input
            type="text"
            name="slug"
            placeholder="pohudenie-30-dney"
            className="w-full rounded-xl border px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Описание</label>
          <textarea
            name="description"
            className="w-full rounded-xl border px-4 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Цена</label>
          <input
            type="number"
            name="price"
            className="w-full rounded-xl border px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Ссылка на изображение</label>
          <input
            type="text"
            name="imageUrl"
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" id="isPublished" />
          <label htmlFor="isPublished">Опубликовать сразу</label>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-2 text-white"
        >
          Создать курс
        </button>
      </form>
    </main>
  )
}