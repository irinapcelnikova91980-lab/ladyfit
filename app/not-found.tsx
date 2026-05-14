import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="sf404-page">
      <style>{`
        .sf404-page {
          min-height: calc(100vh - 60px);
          width: 100%;
          background: linear-gradient(180deg, #FFF3EC 0%, #F4EAF8 100%);
          color: #241939;
          overflow: hidden;
          position: relative;
        }

        .sf404-scene {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 60px);
          overflow: hidden;
        }

        .sf404-brand {
          position: absolute;
          top: 5%;
          left: 5%;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 10;
          font-family: var(--font-cormorant), Georgia, serif;
          font-style: italic;
          font-size: clamp(24px, 2vw, 34px);
          color: #AD82A6;
        }

        .sf404-mark {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #FFAE82;
          position: relative;
          flex-shrink: 0;
        }

        .sf404-mark::after {
          content: "";
          position: absolute;
          inset: 7px;
          border-radius: 50%;
          background: #B89AE3;
        }

        .sf404-tag {
          position: absolute;
          top: 6%;
          right: 6%;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #5B5172;
          z-index: 10;
        }

        .sf404-copy {
          position: absolute;
          right: 7%;
          top: 24%;
          width: min(420px, 34vw);
          z-index: 10;
        }

        .sf404-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #7A5278;
          background: #EDE5F4;
          border: 1px solid #E8D5E8;
          padding: 8px 14px;
          border-radius: 999px;
        }

        .sf404-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #F18A55;
        }

        .sf404-title {
          font-family: var(--font-cormorant), Georgia, serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(48px, 5vw, 76px);
          line-height: 0.96;
          margin: 18px 0 16px;
          color: #5C3D2E;
        }

        .sf404-text {
          font-size: clamp(14px, 1.15vw, 17px);
          line-height: 1.7;
          color: #6F5E56;
          margin: 0 0 28px;
        }

        .sf404-text strong {
          color: #5C3D2E;
          font-weight: 600;
        }

        .sf404-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sf404-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .sf404-btn:hover {
          transform: translateY(-1px);
          opacity: 0.92;
        }

        .sf404-btn-primary {
          background: #AD82A6;
          color: #fff;
        }

        .sf404-btn-secondary {
          background: rgba(255,255,255,0.75);
          color: #5C3D2E;
          border: 1px solid #EAD8CF;
        }

        .sf404-floor {
          position: absolute;
          left: 4%;
          right: 4%;
          bottom: 22%;
          height: 1px;
          background: linear-gradient(to right, transparent 0%, rgba(46,31,85,.16) 10%, rgba(46,31,85,.16) 90%, transparent 100%);
          z-index: 1;
        }

        .sf404-floor-shadow {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 28%;
          background: linear-gradient(to bottom, transparent 0%, rgba(184,154,227,.14) 55%, rgba(184,154,227,.28) 100%);
          pointer-events: none;
        }

        .sf404-digit {
          font-family: Arial Black, Impact, system-ui, sans-serif;
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: -0.06em;
          user-select: none;
          position: absolute;
          z-index: 2;
        }

        .sf404-4a {
          left: 9%;
          bottom: 22%;
          font-size: clamp(220px, 26vw, 390px);
          color: #241939;
        }

        .sf404-4b {
          left: 47%;
          bottom: 25%;
          font-size: clamp(170px, 20vw, 300px);
          color: #8765C9;
          transform: rotate(18deg);
        }

        .sf404-wheel {
          position: absolute;
          left: 26%;
          bottom: 22%;
          width: clamp(210px, 22vw, 320px);
          height: clamp(210px, 22vw, 320px);
          border-radius: 50%;
          background: #FFAE82;
          border: 8px solid #241939;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Arial Black, Impact, system-ui, sans-serif;
          font-size: clamp(165px, 18vw, 260px);
          font-weight: 900;
          color: #241939;
          line-height: 1;
          z-index: 3;
        }

        .sf404-wheel::before,
        .sf404-wheel::after {
          content: "";
          position: absolute;
          background: #241939;
          border-radius: 2px;
        }

        .sf404-wheel::before {
          width: 60%;
          height: 6px;
          top: 50%;
          left: 20%;
          transform: translateY(-50%);
        }

        .sf404-wheel::after {
          width: 6px;
          height: 60%;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
        }

        .sf404-motion {
          position: absolute;
          left: 22%;
          bottom: 38%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 3;
        }

        .sf404-motion span {
          display: block;
          height: 4px;
          background: #B89AE3;
          border-radius: 2px;
        }

        .sf404-motion span:nth-child(1) { width: 50px; }
        .sf404-motion span:nth-child(2) { width: 36px; margin-left: 8px; }
        .sf404-motion span:nth-child(3) { width: 22px; margin-left: 18px; }

        .sf404-rope {
          position: absolute;
          left: 68%;
          bottom: 43%;
          width: 13%;
          height: 2px;
          background: #241939;
          transform: rotate(-8deg);
          transform-origin: left center;
          z-index: 3;
        }

        .sf404-sign {
          position: absolute;
          left: 16%;
          top: 36%;
          transform: rotate(-6deg);
          z-index: 5;
        }

        .sf404-sign-board {
          position: relative;
          background: #fff;
          border: 2px solid #241939;
          padding: 14px 22px 16px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #241939;
          box-shadow: 6px 6px 0 #B89AE3;
          border-radius: 8px;
        }

        .sf404-strike {
          position: absolute;
          left: 8px;
          right: 8px;
          top: 50%;
          height: 2.5px;
          background: #F18A55;
          transform: translateY(-50%) rotate(-6deg);
        }

        .sf404-sign-fix {
          position: absolute;
          bottom: -22px;
          right: -12px;
          transform: rotate(-4deg);
          background: #FFCCAE;
          color: #241939;
          font-weight: 700;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 2px solid #241939;
          white-space: nowrap;
        }

        .sf404-sign-stick {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 60px;
          background: #241939;
          border-radius: 3px;
        }

        .sf404-paper {
          position: absolute;
          left: -5%;
          top: 44%;
          width: 260px;
          height: 300px;
          background: #fff;
          border: 2px solid #241939;
          transform: rotate(-8deg);
          box-shadow: 8px 8px 0 rgba(46,31,85,.08);
          z-index: 1;
        }

        .sf404-paper-lines {
          position: absolute;
          left: 18px;
          right: 18px;
          top: 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sf404-paper-lines i {
          display: block;
          height: 6px;
          background: #E8DFF7;
          border-radius: 3px;
        }

        .sf404-paper-lines i:nth-child(1) { width: 80%; }
        .sf404-paper-lines i:nth-child(2) { width: 62%; }
        .sf404-paper-lines i:nth-child(3) { width: 74%; }
        .sf404-paper-lines i:nth-child(4) { width: 48%; background: #FFE4D3; }

        .sf404-footprint {
          position: absolute;
          width: 13px;
          height: 17px;
          background: #B89AE3;
          opacity: 0.45;
          border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
          z-index: 2;
        }

        .sf404-helper {
          position: absolute;
          z-index: 5;
        }

        .sf404-puller-1 {
          left: 82%;
          bottom: 21%;
        }

        .sf404-puller-2 {
          left: 88%;
          bottom: 20%;
        }

        .sf404-sitter {
          left: 20%;
          bottom: 55%;
        }

        .sf404-tool {
          position: absolute;
          z-index: 2;
        }

        @media (max-width: 1100px) {
          .sf404-copy {
            top: 13%;
            left: 5%;
            right: auto;
            width: min(520px, 90%);
          }

          .sf404-title {
            font-size: 52px;
          }

          .sf404-4a {
            left: 6%;
            bottom: 16%;
            font-size: 260px;
          }

          .sf404-wheel {
            left: 27%;
            bottom: 17%;
            width: 220px;
            height: 220px;
            font-size: 175px;
          }

          .sf404-4b {
            left: 52%;
            bottom: 20%;
            font-size: 190px;
          }

          .sf404-rope,
          .sf404-puller-1,
          .sf404-puller-2,
          .sf404-sitter,
          .sf404-sign {
            transform: scale(0.82);
          }
        }

        @media (max-width: 720px) {
          .sf404-scene {
            min-height: calc(100vh - 60px);
          }

          .sf404-brand {
            top: 24px;
            left: 22px;
            font-size: 24px;
          }

          .sf404-tag {
            display: none;
          }

          .sf404-copy {
            top: 86px;
            left: 22px;
            width: calc(100% - 44px);
          }

          .sf404-title {
            font-size: 42px;
          }

          .sf404-text {
            font-size: 14px;
          }

          .sf404-btn {
            width: 100%;
            justify-content: center;
          }

          .sf404-4a {
            left: 8%;
            bottom: 12%;
            font-size: 170px;
          }

          .sf404-wheel {
            left: 36%;
            bottom: 13%;
            width: 140px;
            height: 140px;
            font-size: 112px;
            border-width: 6px;
          }

          .sf404-4b {
            left: 66%;
            bottom: 15%;
            font-size: 120px;
          }

          .sf404-sign,
          .sf404-paper,
          .sf404-rope,
          .sf404-helper,
          .sf404-tool,
          .sf404-motion {
            display: none;
          }
        }
      `}</style>

      <div className="sf404-scene">
        <div className="sf404-brand">
          <div className="sf404-mark" />
          <span>SomraFit</span>
        </div>

        <div className="sf404-tag">Ошибка 404</div>

        <div className="sf404-floor-shadow" />
        <div className="sf404-floor" />

        <div className="sf404-paper">
          <div className="sf404-paper-lines">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="sf404-sign">
          <div className="sf404-sign-board">
            Page not found
            <span className="sf404-strike" />
          </div>
          <div className="sf404-sign-fix">Мы почти починили</div>
          <div className="sf404-sign-stick" />
        </div>

        <div className="sf404-digit sf404-4a">4</div>

        <div className="sf404-motion">
          <span />
          <span />
          <span />
        </div>

        <div className="sf404-wheel">0</div>
        <div className="sf404-digit sf404-4b">4</div>
        <div className="sf404-rope" />

        <Footprints />

        <div className="sf404-tool" style={{ left: '7%', bottom: '7%' }}>
          <svg width="80" height="30" viewBox="0 0 70 26" style={{ transform: 'rotate(-10deg)' }}>
            <rect x="20" y="10" width="30" height="6" fill="#241939" />
            <rect x="6" y="2" width="14" height="22" fill="#F18A55" rx="2" stroke="#241939" strokeWidth="1.6" />
            <rect x="50" y="2" width="14" height="22" fill="#F18A55" rx="2" stroke="#241939" strokeWidth="1.6" />
            <rect x="0" y="6" width="6" height="14" fill="#241939" rx="1" />
            <rect x="64" y="6" width="6" height="14" fill="#241939" rx="1" />
          </svg>
        </div>

        <div className="sf404-tool" style={{ left: '74%', bottom: '6%' }}>
          <svg width="80" height="32" viewBox="0 0 70 28" style={{ transform: 'rotate(18deg)' }}>
            <rect x="0" y="11" width="48" height="6" fill="#F18A55" rx="2" />
            <rect x="42" y="2" width="22" height="24" fill="#241939" rx="2" />
          </svg>
        </div>

        <div className="sf404-helper sf404-sitter">
          <HelperSvg body="#FFAE82" small />
        </div>

        <div className="sf404-helper sf404-puller-1">
          <HelperSvg body="#FFAE82" />
        </div>

        <div className="sf404-helper sf404-puller-2">
          <HelperSvg body="#B89AE3" />
        </div>

        <div className="sf404-copy">
          <div className="sf404-eyebrow">
            <span className="sf404-dot" />
            Ошибка 404
          </div>

          <h1 className="sf404-title">Ой… страницу унесли наши помощники</h1>

          <p className="sf404-text">
            Похоже, они решили, что это <strong>часть ремонта сайта</strong>.
            Мы уже зовём их обратно — а пока заглядывайте в другие разделы.
          </p>

          <div className="sf404-actions">
            <Link href="/" className="sf404-btn sf404-btn-primary">
              Вернуться на главную
              <span>→</span>
            </Link>

            <Link href="/courses" className="sf404-btn sf404-btn-secondary">
              Посмотреть курсы
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function Footprints() {
  const prints = [
    ['5%', '86%', -10, 0.18],
    ['8%', '87%', -2, 0.27],
    ['11%', '86%', -10, 0.36],
    ['14%', '87%', -2, 0.45],
    ['17%', '86%', -10, 0.54],
    ['61%', '86%', -8, 0.18],
    ['64%', '87%', 0, 0.27],
    ['67%', '86%', -8, 0.36],
    ['70%', '87%', 0, 0.45],
    ['73%', '86%', -8, 0.54],
    ['76%', '87%', 0, 0.62],
  ]

  return (
    <>
      {prints.map(([left, top, rotate, opacity], index) => (
        <div
          key={index}
          className="sf404-footprint"
          style={{
            left: left as string,
            top: top as string,
            opacity: opacity as number,
            transform: `rotate(${rotate}deg)`,
          }}
        />
      ))}
    </>
  )
}

function HelperSvg({
  body,
  small = false,
}: {
  body: string
  small?: boolean
}) {
  const width = small ? 63 : 74
  const height = small ? 81 : 116

  return (
    <svg width={width} height={height} viewBox="0 0 70 110">
      <rect x="22" y="78" width="10" height="28" fill="#241939" rx="2" />
      <rect x="38" y="78" width="10" height="28" fill="#241939" rx="2" />
      <rect x="20" y="102" width="14" height="6" fill="#241939" rx="2" />
      <rect x="36" y="102" width="14" height="6" fill="#241939" rx="2" />

      <path d="M16 40 Q35 30 54 40 L52 80 Q35 86 18 80 Z" fill={body} />
      <rect x="18" y="68" width="34" height="4" fill="#241939" opacity=".25" />

      <path d="M52 46 Q66 50 66 60 L60 62 Q56 56 50 56 Z" fill={body} />
      <path d="M18 46 Q4 50 4 60 L10 62 Q14 56 20 56 Z" fill={body} />

      <circle cx="64" cy="60" r="5" fill="#241939" />
      <circle cx="6" cy="60" r="5" fill="#241939" />

      <circle cx="35" cy="26" r="16" fill={body} />
      <path d="M19 26 Q35 14 51 26 L51 22 Q35 8 19 22 Z" fill="#241939" />
      <circle cx="30" cy="28" r="1.6" fill="#241939" />
      <circle cx="40" cy="28" r="1.6" fill="#241939" />
      <path
        d="M35 8 Q39 4 42 9"
        stroke="#241939"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}