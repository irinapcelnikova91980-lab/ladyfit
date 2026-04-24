import Link from 'next/link'
import { prisma } from '../../lib/prisma'
import { getCurrentUser } from '../../lib/auth'
import { hasCourseAccess } from '../../lib/access'

type Props = {
  params: Promise<{ slug: string }>
}

const BRAND = '#AD82A6'
const BRAND_LIGHT = '#f3eef5'
const BRAND_BORDER = '#d9c2d9'
const BRAND_TEXT = '#7a5278'

export default async function CoursePage({ params }: Props) {
  const { slug } = await params

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) {
    return <div className="p-10">Курс не найден</div>
  }

  const user = await getCurrentUser()
  const isAdmin = user?.role === 'admin'

  const hasAccess = isAdmin
    ? true
    : user
      ? await hasCourseAccess(user.id, course.id)
      : false

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">

      {/* Шапка-герой */}
      <div
        style={{ background: BRAND }}
        className="relative mb-8 flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl px-10 py-12"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px)',
          }}
        />
        <span
          className="mb-4 w-fit rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest text-white"
          style={{ background: 'rgba(255,255,255,0.2)', border: '0.5px solid rgba(255,255,255,0.35)' }}
        >
          Онлайн-курс
        </span>
        <h1 className="mb-2 text-5xl font-light italic text-white" style={{ fontFamily: 'Georgia, serif' }}>
          {course.title}
        </h1>
        <p className="text-sm font-light tracking-wide text-white/70">
          <span className="mr-1 text-2xl text-white">{course.price} ₽</span>
          единоразово
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">

        {/* Левая колонка */}
        <div>
          <p className="mb-6 text-sm font-light leading-relaxed text-gray-500">
            {course.description ?? 'Описание курса появится здесь.'}
          </p>

          {/* Блок доступа */}
          <div
            className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
            style={{ background: BRAND_LIGHT, border: `0.5px solid ${BRAND_BORDER}`, color: BRAND_TEXT }}
          >
            {hasAccess ? (
              <>
                🔓
                <span>
                  {isAdmin ? 'Ты администратор: полный доступ к курсу' : 'У тебя есть доступ к курсу'}
                </span>
              </>
            ) : (
              <>
                🔒
                <span>Доступа к курсу пока нет</span>
              </>
            )}
          </div>

          {/* Кнопка добавить урок для админа */}
          {isAdmin && (
            <div className="mb-6">
              <Link
                href={`/courses/${course.slug}/lessons/new`}
                className="inline-block rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
              >
                + Добавить урок
              </Link>
            </div>
          )}

          {/* Список уроков */}
          <div>
            <p className="mb-4 border-b border-gray-100 pb-3 text-xs uppercase tracking-widest text-gray-400">
              Программа курса
            </p>

            {course.lessons.length === 0 ? (
              <p className="py-10 text-center text-sm italic text-gray-400">
                Уроки пока не добавлены
              </p>
            ) : (
              <div>
                {course.lessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className="flex items-start gap-4 border-b border-gray-100 py-4"
                  >
                    <span className="min-w-[28px] text-xl font-light text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                      {String(lesson.order).padStart(2, '0')}
                    </span>

                    <div className="flex-1">
                      {hasAccess || lesson.isFree ? (
                        <Link href={`/courses/${course.slug}/lessons/${lesson.id}`}>
                          <p className="text-sm font-medium hover:opacity-60 transition-opacity">
                            {lesson.title}
                          </p>
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-gray-400">{lesson.title}</p>
                      )}
                      {lesson.content && (
                        <p className="mt-1 text-xs text-gray-400">{lesson.content}</p>
                      )}
                    </div>

                    <div className="mt-0.5 shrink-0">
                      {lesson.isFree ? (
                        <span
                          className="rounded-full px-2 py-1 text-xs uppercase tracking-wide"
                          style={{ background: BRAND_LIGHT, color: BRAND_TEXT, border: `0.5px solid ${BRAND_BORDER}` }}
                        >
                          Бесплатно
                        </span>
                      ) : hasAccess ? null : (
                        <span className="text-xs text-gray-300">🔒</span>
                      )}

                      {isAdmin && (
                        <Link
                          href={`/admin/lessons/${lesson.id}`}
                          className="ml-2 inline-block rounded-lg border border-gray-200 px-3 py-1 text-xs hover:bg-gray-50"
                        >
                          Редактировать
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка — карточка покупки */}
        {!hasAccess && !isAdmin && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <p className="mb-1 text-4xl font-light" style={{ fontFamily: 'Georgia, serif' }}>
              {course.price} ₽
            </p>
            <p className="mb-5 text-xs uppercase tracking-widest text-gray-400">
              Полный доступ навсегда
            </p>

            <Link
              href={`/courses/${course.slug}/buy`}
              className="block w-full rounded-xl py-3 text-center text-sm font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              style={{ background: BRAND }}
            >
              Купить курс
            </Link>

            <div className="my-5 h-px bg-gray-200" />

            {[
              'Доступ ко всем урокам',
              'Видео в высоком качестве',
              'Доступ с любого устройства',
              'Без ограничений по времени',
            ].map((f) => (
              <div key={f} className="mb-3 flex items-center gap-3 text-xs text-gray-500">
                <div className="h-1 w-1 shrink-0 rounded-full" style={{ background: BRAND }} />
                {f}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}