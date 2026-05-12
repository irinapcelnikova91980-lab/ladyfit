// Change ACTIVE_PRESET to switch the logo font globally
const ACTIVE_PRESET = 'classic' as const

const PRESETS = {
  classic: {
    fontFamily: 'var(--font-cormorant), Georgia, serif',
    fontStyle: 'italic' as const,
    fontWeight: 300,
    letterSpacing: '-0.01em',
    text: (s: string) => s,
  },
  fraunces: {
    fontFamily: 'var(--font-fraunces), serif',
    fontStyle: 'normal' as const,
    fontWeight: 500,
    letterSpacing: '-0.03em',
    text: (s: string) => s.toLowerCase(),
  },
  bodoni: {
    fontFamily: 'var(--font-bodoni), serif',
    fontStyle: 'italic' as const,
    fontWeight: 400,
    letterSpacing: '-0.02em',
    text: (s: string) => s,
  },
} as const

const B = '#AD82A6'

type Props = {
  size?: number
  color?: string
  children?: string
}

export default function Logo({ size = 22, color = B, children = 'SomraFit' }: Props) {
  const p = PRESETS[ACTIVE_PRESET]
  return (
    <span
      style={{
        fontFamily: p.fontFamily,
        fontStyle: p.fontStyle,
        fontWeight: p.fontWeight,
        fontSize: size,
        letterSpacing: p.letterSpacing,
        color,
        lineHeight: 1,
        display: 'inline-block',
      }}
    >
      {p.text(children)}
    </span>
  )
}
