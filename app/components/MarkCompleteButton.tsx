'use client'

import { useTransition } from 'react'
import { markLessonComplete } from '../actions/progress'

const B = '#AD82A6'
const BL = '#f3eef5'
const BB = '#e8d5e8'

type Props = {
  lessonId: string
  courseSlug: string
  completed: boolean
}

export default function MarkCompleteButton({ lessonId, courseSlug, completed }: Props) {
  const [pending, startTransition] = useTransition()

  if (completed) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        borderRadius: 999, padding: '10px 22px',
        background: BL, border: `1px solid ${BB}`,
        fontSize: 13, color: '#7a5278', fontWeight: 500,
      }}>
        <span>✓</span> Урок завершён
      </div>
    )
  }

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => markLessonComplete(lessonId, courseSlug))}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        borderRadius: 999, padding: '10px 22px',
        background: pending ? BB : B, color: '#fff',
        border: 'none', fontSize: 13, fontWeight: 500,
        cursor: pending ? 'wait' : 'pointer',
        fontFamily: 'inherit', transition: 'background .15s',
      }}
    >
      {pending ? 'Сохраняю...' : '✓ Отметить урок как просмотренный'}
    </button>
  )
}
