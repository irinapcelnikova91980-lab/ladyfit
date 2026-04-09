import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'LadyFit',
  description: 'Платформа фитнес-тренера',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>
        <ClerkProvider>
          <header className="flex items-center justify-between border-b px-6 py-4">
            <div className="text-xl font-bold">LadyFit</div>

            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="rounded-xl border px-4 py-2">Войти</button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="rounded-xl bg-black px-4 py-2 text-white">
                    Регистрация
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>

          <main>{children}</main>
        </ClerkProvider>
      </body>
    </html>
  )
}