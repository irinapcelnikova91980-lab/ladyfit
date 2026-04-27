import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center"
      style={{ background: 'linear-gradient(160deg, #c49abf 0%, #AD82A6 50%, #9b6d9b 100%)' }}
    >
      {/* Полосатый паттерн как в герое */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px)' }}
      />

      {/* Навигация сверху */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5">
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-widest text-white/70 transition hover:text-white"
        >
          ← Страница не найдена
        </Link>
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-widest text-white/70 transition hover:text-white"
        >
          Назад
        </Link>
      </div>

      {/* Большая цифра 404 */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <span
          className="font-light italic leading-none text-white"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(120px, 20vw, 220px)',
            letterSpacing: '-0.03em',
            textShadow: '0 8px 40px rgba(0,0,0,0.15)',
            opacity: 0.95,
          }}
        >
          404
        </span>

        <div className="flex flex-col gap-3 max-w-md">
          <h1
            className="text-2xl font-light italic text-white"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Кажется, эта страница ушла на тренировку
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Мы не нашли то, что вы искали. Давайте вернёмся туда, где всё на своих местах.
          </p>
        </div>

        <Link
          href="/"
          className="mt-2 flex items-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-medium uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{ color: '#AD82A6' }}
        >
          Вернуться на главную
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-white"
            style={{ background: '#AD82A6' }}
          >
            →
          </span>
        </Link>
      </div>

      {/* Облака снизу */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Задний слой облаков */}
          <ellipse cx="200" cy="180" rx="180" ry="80" fill="white" opacity="0.15" />
          <ellipse cx="320" cy="175" rx="140" ry="70" fill="white" opacity="0.15" />
          <ellipse cx="700" cy="185" rx="200" ry="85" fill="white" opacity="0.12" />
          <ellipse cx="900" cy="178" rx="160" ry="72" fill="white" opacity="0.15" />
          <ellipse cx="1200" cy="182" rx="190" ry="80" fill="white" opacity="0.13" />
          <ellipse cx="1380" cy="176" rx="150" ry="68" fill="white" opacity="0.15" />

          {/* Средний слой */}
          <ellipse cx="100" cy="190" rx="160" ry="90" fill="white" opacity="0.25" />
          <ellipse cx="280" cy="185" rx="130" ry="75" fill="white" opacity="0.22" />
          <ellipse cx="500" cy="192" rx="170" ry="88" fill="white" opacity="0.2" />
          <ellipse cx="780" cy="188" rx="150" ry="80" fill="white" opacity="0.25" />
          <ellipse cx="1050" cy="190" rx="180" ry="88" fill="white" opacity="0.22" />
          <ellipse cx="1300" cy="186" rx="160" ry="82" fill="white" opacity="0.24" />

          {/* Передний слой */}
          <ellipse cx="0" cy="200" rx="150" ry="100" fill="white" opacity="0.5" />
          <ellipse cx="200" cy="195" rx="180" ry="95" fill="white" opacity="0.5" />
          <ellipse cx="420" cy="198" rx="160" ry="92" fill="white" opacity="0.45" />
          <ellipse cx="650" cy="200" rx="190" ry="100" fill="white" opacity="0.5" />
          <ellipse cx="900" cy="196" rx="170" ry="95" fill="white" opacity="0.48" />
          <ellipse cx="1130" cy="200" rx="185" ry="98" fill="white" opacity="0.5" />
          <ellipse cx="1350" cy="197" rx="175" ry="96" fill="white" opacity="0.5" />
          <ellipse cx="1500" cy="200" rx="160" ry="100" fill="white" opacity="0.5" />
        </svg>
      </div>
    </main>
  )
}