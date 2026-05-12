import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Cormorant_Garamond, Jost, Fraunces, Bodoni_Moda } from 'next/font/google'
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

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
})

export const metadata = {
  title: 'SomraFit',
  description: 'Платформа онлайн-тренировок Марины Сомра. Там, где фитнес встречается с душой.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ru" className={`${cormorant.variable} ${jost.variable} ${fraunces.variable} ${bodoni.variable}`}>
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
