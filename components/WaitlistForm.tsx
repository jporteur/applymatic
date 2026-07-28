'use client'

import { useState } from 'react'
import styles from './WaitlistForm.module.css'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) { setStatus('error'); return }
      if (data.message === 'already_registered') { setStatus('duplicate'); return }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.successBox}>
        <span className={styles.successIcon}>✓</span>
        <div>
          <p className={styles.successTitle}>You&rsquo;re on the list</p>
          <p className={styles.successSub}>We&rsquo;ll email you when early access opens.</p>
        </div>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.input}
          required
          disabled={status === 'loading'}
        />
        <button type="submit" className={styles.button} disabled={status === 'loading'}>
          {status === 'loading' ? <span className={styles.spinner} /> : 'Join waitlist'}
        </button>
      </div>
      {status === 'duplicate' && (
        <p className={styles.hint} style={{ color: 'var(--accent)' }}>
          You&rsquo;re already on the list — we&rsquo;ll be in touch soon.
        </p>
      )}
      {status === 'error' && (
        <p className={styles.hint} style={{ color: '#ff6b6b' }}>
          Something went wrong. Please try again.
        </p>
      )}
      {status === 'idle' && (
        <p className={styles.hint}>Free to start. No credit card required.</p>
      )}
    </form>
  )
}
