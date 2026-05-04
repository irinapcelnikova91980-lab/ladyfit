import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import Navbar from './components/Navbar'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata = {
  title: 'LadyFit',
  description: 'Платформа онлайн-тренировок Марины Сомра. Там, где фитнес встречается с душой.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ru" className={`${cormorant.variable} ${jost.variable}`}>
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
