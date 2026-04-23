'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

type BurgerMenuProps = {
  isLoggedIn: boolean
  role?: string | null
  isOwner: boolean
}

export default function BurgerMenu({
  isLoggedIn,
  role,
  isOwner,
}: BurgerMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Верхняя панель */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
          aria-label="Открыть меню"
        >
          <div className="space-y-1">
            <div className="h-0.5 w-5 rounded bg-black" />
            <div className="h-0.5 w-5 rounded bg-black" />
            <div className="h-0.5 w-5 rounded bg-black" />
          </div>
        </button>

        {isLoggedIn && <UserButton />}
      </div>

      {/* Затемнение фона */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Боковая панель */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-lg font-bold">LadyFit</p>
            <p className="text-xs text-gray-500">Меню</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <div className="flex h-[calc(100%-73px)] flex-col justify-between p-4">
          <nav className="flex flex-col gap-2">
            {!isLoggedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-gray-50">
                    Войти
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="w-full rounded-xl bg-black px-4 py-3 text-left text-white hover:bg-black/90">
                    Регистрация
                  </button>
                </SignUpButton>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link
                  href="/courses"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 hover:bg-gray-50"
                >
                  Курсы
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 hover:bg-gray-50"
                >
                  Админка
                </Link>

                <Link
                  href="/courses/new"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-black px-4 py-3 text-white hover:bg-black/90"
                >
                  Создать курс
                </Link>

                {isOwner && (
                  <Link
                    href="/debug/owner-role"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 hover:bg-gray-50"
                  >
                    Настройка доступа
                  </Link>
                )}
              </>
            )}

            {role === 'user' && (
              <>
                <Link
                  href="/my-courses"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 hover:bg-gray-50"
                >
                  Мои курсы
                </Link>

                <Link
                  href="/courses"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 hover:bg-gray-50"
                >
                  Все курсы
                </Link>

                {isOwner && (
                  <Link
                    href="/debug/owner-role"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 hover:bg-gray-50"
                  >
                    Режим владельца
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-black">LadyFit</p>
            <p className="mt-1">Твоя платформа тренировок.</p>
          </div>
        </div>
      </aside>
    </>
  )
}