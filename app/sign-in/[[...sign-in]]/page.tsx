'use client'

import { useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

const B = '#AD82A6'

export default function AuthPage() {
  const router = useRouter()
  const { signIn, fetchStatus: signInFetch } = useSignIn()
  const { signUp, fetchStatus: signUpFetch } = useSignUp()

  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [firstName, setFirstName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')

  const loading = signInFetch === 'fetching' || signUpFetch === 'fetching'

  async function handleSignIn(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!signIn) return
    setError('')
    const { error: e1 } = await signIn.create({ identifier: email })
    if (e1) { setError(e1.message); return }
    const { error: e2 } = await signIn.password({ password })
    if (e2) { setError(e2.message); return }
    if (signIn.status === 'complete') {
      await signIn.finalize()
      router.push('/my-courses')
      router.refresh()
    }
  }

  async function handleSignUp(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!signUp) return
    setError('')
    const { error: e1 } = await signUp.create({ emailAddress: signUpEmail, firstName })
    if (e1) { setError(e1.message); return }
    const { error: e2 } = await signUp.password({ password: signUpPassword })
    if (e2) { setError(e2.message); return }
    const { error: e3 } = await signUp.verifications.sendEmailCode()
    if (e3) { setError(e3.message); return }
    setVerifying(true)
  }

  async function handleVerify(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!signUp) return
    setError('')
    const { error: e1 } = await signUp.verifications.verifyEmailCode({ code })
    if (e1) { setError(e1.message); return }
    if (signUp.status === 'complete') {
      await signUp.finalize()
      router.push('/my-courses')
      router.refresh()
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: 12,
    border: '1px solid #ede8e8', fontSize: 14, outline: 'none',
    background: '#fff', fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
    color: '#888', display: 'block', marginBottom: 8,
  }

  const submitBtn: React.CSSProperties = {
    width: '100%', padding: 16, borderRadius: 999, background: B,
    color: '#fff', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
    textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1, border: 'none', fontFamily: 'inherit',
    transition: 'opacity .2s',
  }

  return (
    <main style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px', background: '#f9f6f4',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic', fontWeight: 300, fontSize: 32, color: B,
          }}>
            LadyFit
          </Link>
          <p style={{ fontSize: 13, color: '#aaa', marginTop: 6, fontWeight: 300 }}>
            {verifying ? 'Введите код из письма' : isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
          </p>
        </div>

        <div style={{
          background: '#fff', borderRadius: 24, padding: '36px',
          border: '1px solid #ede8e8', boxShadow: '0 4px 32px rgba(0,0,0,.04)',
        }}>

          {/* Tab toggle */}
          {!verifying && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              background: '#f5f5f5', borderRadius: 12, padding: 4, marginBottom: 28,
            }}>
              {([['Войти', true], ['Регистрация', false]] as [string, boolean][]).map(([label, val]) => (
                <button key={label} onClick={() => { setIsLogin(val); setError('') }} style={{
                  padding: '10px', borderRadius: 10, fontSize: 13,
                  background: isLogin === val ? '#fff' : 'transparent',
                  boxShadow: isLogin === val ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                  color: isLogin === val ? '#1a1a1a' : '#888',
                  fontWeight: isLogin === val ? 500 : 300,
                  border: 'none', fontFamily: 'inherit', cursor: 'pointer',
                }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
              padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Verify email code */}
          {verifying ? (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: '#666', fontWeight: 300, lineHeight: 1.6 }}>
                Мы отправили код на <strong>{signUpEmail}</strong>. Введите его ниже.
              </p>
              <div>
                <label style={labelStyle}>Код подтверждения</label>
                <input
                  value={code} onChange={e => setCode(e.target.value)}
                  placeholder="123456" maxLength={6}
                  style={{ ...inputStyle, letterSpacing: '0.2em', fontSize: 20, textAlign: 'center' }}
                  required
                />
              </div>
              <button type="submit" disabled={loading} style={submitBtn}>
                {loading ? 'Проверяем...' : 'Подтвердить'}
              </button>
            </form>

          ) : isLogin ? (
            /* Sign-in form */
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="marina@email.com" style={inputStyle} required />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Пароль</label>
                  <button type="button" style={{
                    fontSize: 11, color: B, background: 'none',
                    border: 'none', fontFamily: 'inherit', cursor: 'pointer',
                  }}>
                    Забыли?
                  </button>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={inputStyle} required />
              </div>
              <div style={{ marginTop: 4 }}>
                <button type="submit" disabled={loading} style={submitBtn}>
                  {loading ? '...' : 'Войти'}
                </button>
              </div>
            </form>

          ) : (
            /* Sign-up form */
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Имя</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)}
                  placeholder="Марина" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)}
                  placeholder="marina@email.com" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Пароль</label>
                <input type="password" value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)}
                  placeholder="••••••••" style={inputStyle} required />
              </div>
              <div style={{ marginTop: 4 }}>
                <button type="submit" disabled={loading} style={submitBtn}>
                  {loading ? '...' : 'Создать аккаунт'}
                </button>
              </div>
            </form>
          )}

          {!verifying && (
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#aaa' }}>
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{'  '}
              <button onClick={() => { setIsLogin(!isLogin); setError('') }} style={{
                color: B, fontSize: 12, background: 'none',
                border: 'none', fontFamily: 'inherit', cursor: 'pointer',
              }}>
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
