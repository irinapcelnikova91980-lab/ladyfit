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

  // reset password flow: null | 'email' | 'code' | 'new_password'
  const [resetStep, setResetStep] = useState<null | 'email' | 'code' | 'new_password'>(null)
  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [resetNewPassword, setResetNewPassword] = useState('')

  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)

  const loading = signInFetch === 'fetching' || signUpFetch === 'fetching'

  const pwdRules = [
    { label: 'Минимум 8 символов', ok: (p: string) => p.length >= 8 },
    { label: 'Заглавная буква (A–Z)', ok: (p: string) => /[A-Z]/.test(p) },
    { label: 'Строчная буква (a–z)', ok: (p: string) => /[a-z]/.test(p) },
    { label: 'Цифра (0–9)', ok: (p: string) => /\d/.test(p) },
  ]

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

  async function handleResetSend(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!signIn) return
    setError('')
    const { error: e1 } = await signIn.create({ identifier: resetEmail })
    if (e1) { setError(e1.message); return }
    const { error: e2 } = await signIn.resetPasswordEmailCode.sendCode()
    if (e2) { setError(e2.message); return }
    setResetStep('code')
  }

  async function handleResetVerify(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!signIn) return
    setError('')
    const { error: e1 } = await signIn.resetPasswordEmailCode.verifyCode({ code: resetCode })
    if (e1) { setError(e1.message); return }
    setResetStep('new_password')
  }

  async function handleResetSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!signIn) return
    setError('')
    const { error: e1 } = await signIn.resetPasswordEmailCode.submitPassword({ password: resetNewPassword, signOutOfOtherSessions: true })
    if (e1) { setError(e1.message); return }
    if (signIn.status === 'complete') {
      await signIn.finalize()
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
      justifyContent: 'center', padding: '40px 24px', background: '#F6EDE2',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic', fontWeight: 300, fontSize: 32, color: B,
          }}>
            SomraFit
          </Link>
          <p style={{ fontSize: 13, color: '#aaa', marginTop: 6, fontWeight: 300 }}>
            {resetStep === 'email' ? 'Восстановление пароля'
              : resetStep === 'code' ? 'Введите код из письма'
              : resetStep === 'new_password' ? 'Новый пароль'
              : verifying ? 'Введите код из письма'
              : isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
          </p>
        </div>

        <div style={{
          background: '#fff', borderRadius: 24, padding: '36px',
          border: '1px solid #ede8e8', boxShadow: '0 4px 32px rgba(0,0,0,.04)',
        }}>

          {/* Tab toggle */}
          {!verifying && !resetStep && (
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

          {/* Reset password — step 1: enter email */}
          {resetStep === 'email' ? (
            <form onSubmit={handleResetSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: '#666', fontWeight: 300, lineHeight: 1.6 }}>
                Введите email, и мы отправим код для сброса пароля.
              </p>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                  placeholder="marina@email.com" style={inputStyle} required />
              </div>
              <button type="submit" disabled={loading} style={submitBtn}>
                {loading ? 'Отправляем...' : 'Отправить код'}
              </button>
            </form>

          ) : resetStep === 'code' ? (
            /* Reset password — step 2: verify code */
            <form onSubmit={handleResetVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: '#666', fontWeight: 300, lineHeight: 1.6 }}>
                Мы отправили код на <strong>{resetEmail}</strong>. Введите его ниже.
              </p>
              <div>
                <label style={labelStyle}>Код подтверждения</label>
                <input
                  value={resetCode} onChange={e => setResetCode(e.target.value)}
                  placeholder="123456" maxLength={6}
                  style={{ ...inputStyle, letterSpacing: '0.2em', fontSize: 20, textAlign: 'center' }}
                  required
                />
              </div>
              <button type="submit" disabled={loading} style={submitBtn}>
                {loading ? 'Проверяем...' : 'Подтвердить'}
              </button>
            </form>

          ) : resetStep === 'new_password' ? (
            /* Reset password — step 3: new password */
            <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: '#666', fontWeight: 300, lineHeight: 1.6 }}>
                Придумайте новый пароль для вашего аккаунта.
              </p>
              <div>
                <label style={labelStyle}>Новый пароль</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    value={resetNewPassword} onChange={e => setResetNewPassword(e.target.value)}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }} required
                  />
                  <button type="button" onClick={() => setShowResetPassword(v => !v)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#bbb', padding: 0,
                  }}>
                    {showResetPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {resetNewPassword.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {pwdRules.map(r => (
                      <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                        <span style={{ color: r.ok(resetNewPassword) ? '#3a7a5a' : '#bbb', fontWeight: 500, lineHeight: 1 }}>
                          {r.ok(resetNewPassword) ? '✓' : '○'}
                        </span>
                        <span style={{ color: r.ok(resetNewPassword) ? '#3a7a5a' : '#999' }}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading} style={submitBtn}>
                {loading ? 'Сохраняем...' : 'Сохранить пароль'}
              </button>
            </form>

          ) : verifying ? (
            /* Sign-up email verification */
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
                  <button type="button" onClick={() => { setResetEmail(email); setResetStep('email'); setError('') }} style={{
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
                <div style={{ position: 'relative' }}>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }} required
                  />
                  <button type="button" onClick={() => setShowSignUpPassword(v => !v)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#bbb', padding: 0,
                  }}>
                    {showSignUpPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {signUpPassword.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {pwdRules.map(r => (
                      <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                        <span style={{ color: r.ok(signUpPassword) ? '#3a7a5a' : '#bbb', fontWeight: 500, lineHeight: 1 }}>
                          {r.ok(signUpPassword) ? '✓' : '○'}
                        </span>
                        <span style={{ color: r.ok(signUpPassword) ? '#3a7a5a' : '#999' }}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 4 }}>
                <button type="submit" disabled={loading} style={submitBtn}>
                  {loading ? '...' : 'Создать аккаунт'}
                </button>
              </div>
            </form>
          )}

          {!verifying && !resetStep && (
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

          {resetStep && (
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#aaa' }}>
              <button onClick={() => { setResetStep(null); setError('') }} style={{
                color: B, fontSize: 12, background: 'none',
                border: 'none', fontFamily: 'inherit', cursor: 'pointer',
              }}>
                ← Назад к входу
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
