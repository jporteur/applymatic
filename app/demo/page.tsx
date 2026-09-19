'use client'

import { useState, useEffect } from 'react'
import styles from './demo.module.css'

const JOBS = [
  {
    id: 0,
    title: 'Senior Software Engineer',
    company: 'Stripe',
    location: 'Remote',
    salary: '$160k–$200k',
    posted: '2 hours ago',
    score: 92,
    logo: 'ST',
    logoColor: '#635bff',
    logoBg: '#0f0e2e',
    tags: ['React', 'TypeScript', 'Node.js', 'Payments'],
    description: 'Build and maintain core payment infrastructure used by millions of businesses. Work with React, TypeScript, and Node.js in a highly collaborative engineering culture. 5+ years experience required.',
  },
  {
    id: 1,
    title: 'Full Stack Engineer',
    company: 'Linear',
    location: 'Remote',
    salary: '$140k–$180k',
    posted: '5 hours ago',
    score: 88,
    logo: 'LN',
    logoColor: '#5e6ad2',
    logoBg: '#0d0d1a',
    tags: ['React', 'GraphQL', 'PostgreSQL', 'TypeScript'],
    description: 'Join a small, high-output team building the best issue tracker in the world. You\'ll own features end-to-end, from database schema to UI. Strong TypeScript and React skills required.',
  },
  {
    id: 2,
    title: 'Software Engineer, Platform',
    company: 'Vercel',
    location: 'Remote',
    salary: '$150k–$190k',
    posted: '1 day ago',
    score: 85,
    logo: 'VC',
    logoColor: '#ffffff',
    logoBg: '#111111',
    tags: ['Node.js', 'AWS', 'TypeScript', 'Infrastructure'],
    description: 'Work on the platform that powers millions of deployments per day. You\'ll build and scale infrastructure, improve developer experience, and work closely with product teams. Experience with cloud infrastructure required.',
  },
  {
    id: 3,
    title: 'Frontend Engineer',
    company: 'Notion',
    location: 'Hybrid NYC',
    salary: '$145k–$185k',
    posted: '2 days ago',
    score: 79,
    logo: 'NT',
    logoColor: '#ffffff',
    logoBg: '#191919',
    tags: ['React', 'TypeScript', 'Performance', 'Design Systems'],
    description: 'Build rich, collaborative document experiences used by millions of people. Deep React and TypeScript expertise required. Experience with complex UI state management and performance optimization a plus.',
  },
]

type JobState = 'pending' | 'approved' | 'skipped'
type GeneratedContent = { reasoning: string; coverLetter: string }

export default function DemoPage() {
  const [selected, setSelected] = useState<number>(0)
  const [jobStates, setJobStates] = useState<Record<number, JobState>>({ 0: 'pending', 1: 'pending', 2: 'pending', 3: 'pending' })
  const [generated, setGenerated] = useState<Record<number, GeneratedContent>>({})
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState<number[]>([])
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null)
  const [view, setView] = useState<'matches' | 'tracker' | 'criteria'>('matches')
  const [copied, setCopied] = useState(false)
  useEffect(() => {
  generateContent(0)
}, [])

  const job = JOBS[selected]
  const state = jobStates[selected]
  const content = generated[selected]

  async function selectJob(id: number) {
    setSelected(id)
    if (!generated[id]) await generateContent(id)
  }

  async function generateContent(id: number) {
    const j = JOBS[id]
    setLoading(true)
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: j.title,
          company: j.company,
          location: j.location,
          salary: j.salary,
          jobDescription: j.description,
        }),
      })
      const data = await res.json()

if (data.reasoning && data.coverLetter) {
  setGenerated(prev => ({ ...prev, [id]: data }))
} else {
  
}
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function approveJob() {
    setJobStates(prev => ({ ...prev, [selected]: 'approved' }))
    setApplied(prev => [...prev.filter(i => i !== selected), selected])
    showToast('✓', `Application submitted to ${job.company}!`)
    const next = JOBS.find(j => j.id !== selected && jobStates[j.id] === 'pending')
    if (next) setTimeout(() => selectJob(next.id), 800)
  }

  function skipJob() {
    setJobStates(prev => ({ ...prev, [selected]: 'skipped' }))
    showToast('✕', 'Role skipped')
    const next = JOBS.find(j => j.id !== selected && jobStates[j.id] === 'pending')
    if (next) setTimeout(() => selectJob(next.id), 500)
  }

  function copyLetter() {
    if (!content?.coverLetter) return
    navigator.clipboard.writeText(content.coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showToast('📋', 'Cover letter copied!')
  }

  function showToast(icon: string, msg: string) {
    setToast({ icon, msg })
    setTimeout(() => setToast(null), 2800)
  }

  const scoreColor = (s: number) => s >= 85 ? 'var(--accent)' : 'var(--blue)'
  const pendingCount = Object.values(jobStates).filter(s => s === 'pending').length

  const scoreBars = [
    { label: 'Role alignment', val: Math.min(job.score + 3, 100) },
    { label: 'Salary match',   val: Math.min(job.score - 2, 100) },
    { label: 'Skill overlap',  val: Math.min(job.score - 5, 100) },
    { label: 'Location fit',   val: job.location === 'Remote' ? 100 : 72 },
    { label: 'Seniority',      val: Math.min(job.score + 1, 100) },
  ]

  return (
    <div className={styles.shell}>

      <div className={styles.banner}>
        ✦ Interactive beta demo &mdash;{' '}
        <a href="https://applymatic-gamma.vercel.app">join the waitlist</a> for early access
      </div>

      <header className={styles.topbar}>
        <div className={styles.logo}>
          <span className={styles.logoMark} />
          Applymatic
          <span className={styles.betaBadge}>Beta</span>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.userName}>John U.</span>
          <div className={styles.avatar}>JU</div>
        </div>
      </header>

      <div className={styles.app}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div>
              <div className={styles.profileName}>John Utah</div>
              <div className={styles.profileRole}>Software Engineer · 5 yrs exp</div>
            </div>
            <div className={styles.profileStat}><span>Resume</span><span>Uploaded ✓</span></div>
            <div className={styles.profileStat}><span>Applied</span><span>{applied.length} role{applied.length !== 1 ? 's' : ''}</span></div>
            <div className={styles.profileStat}><span>Pending</span><span>{pendingCount} matches</span></div>
          </div>

          <div className={styles.sideSection}>
            <div className={styles.sideLabel}>Navigation</div>
            <div className={`${styles.navItem} ${view === 'matches' ? styles.navActive : ''}`} onClick={() => setView('matches')}>
              <span>⚡</span> Today&apos;s Matches
              {pendingCount > 0 && <span className={styles.navCount}>{pendingCount}</span>}
            </div>
            <div className={`${styles.navItem} ${view === 'tracker' ? styles.navActive : ''}`} onClick={() => setView('tracker')}>
              <span>📋</span> Applications
            </div>
            <div className={`${styles.navItem} ${view === 'criteria' ? styles.navActive : ''}`} onClick={() => setView('criteria')}>
              <span>⚙️</span> Criteria
            </div>
          </div>

          <div className={styles.sideSection}>
            <div className={styles.sideLabel}>Your Criteria</div>
            <div className={styles.tags}>
              {['🌐 Remote', '💰 $140k–$200k', '⚛️ React / TS', '🟢 Node.js', '☁️ AWS', '🗄️ PostgreSQL'].map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className={styles.main}>
          {view === 'matches' && (
            <>
              <div className={styles.feedHeader}>
                <div className={styles.feedTitle}>Today&apos;s Matches</div>
                <div className={styles.feedSub}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {JOBS.length} roles found</div>
              </div>
              {JOBS.map(j => (
                <div
                  key={j.id}
                  className={`${styles.jobCard} ${selected === j.id ? styles.jobSelected : ''} ${jobStates[j.id] === 'approved' ? styles.jobApproved : ''} ${jobStates[j.id] === 'skipped' ? styles.jobSkipped : ''}`}
                  onClick={() => selectJob(j.id)}
                >
                  <div className={styles.jobTop}>
                    <div className={styles.jobLogo} style={{ background: j.logoBg, color: j.logoColor }}>{j.logo}</div>
                    <div className={styles.jobInfo}>
                      <div className={styles.jobTitle}>{j.title}</div>
                      <div className={styles.jobCompany}>{j.company}</div>
                    </div>
                    <div className={styles.scoreBadge} style={{ color: scoreColor(j.score), background: j.score >= 85 ? 'rgba(200,240,74,0.1)' : 'rgba(92,158,255,0.1)', border: `1px solid ${j.score >= 85 ? 'rgba(200,240,74,0.28)' : 'rgba(92,158,255,0.28)'}` }}>
                      {j.score}
                    </div>
                  </div>
                  <div className={styles.jobMeta}>
                    <span>💰 {j.salary}</span>
                    <span>📍 {j.location}</span>
                    <span>⏱ {j.posted}</span>
                  </div>
                  <div className={styles.jobTags}>
                    {j.tags.map(t => <span key={t} className={styles.jobTag}>{t}</span>)}
                  </div>
                  {jobStates[j.id] === 'approved' && <span className={`${styles.statusPill} ${styles.statusApproved}`}>Applied ✓</span>}
                  {jobStates[j.id] === 'skipped' && <span className={`${styles.statusPill} ${styles.statusSkipped}`}>Skipped</span>}
                </div>
              ))}
            </>
          )}

          {view === 'tracker' && (
            <>
              <div className={styles.feedHeader}>
                <div className={styles.feedTitle}>Applications</div>
                <div className={styles.feedSub}>Track everything you&apos;ve applied to</div>
              </div>
              {applied.length === 0 ? (
                <div className={styles.empty}>No applications yet — approve a job to get started.</div>
              ) : applied.map(id => {
                const j = JOBS[id]
                return (
                  <div key={id} className={styles.trackerCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className={styles.jobLogo} style={{ background: j.logoBg, color: j.logoColor, width: 32, height: 32, fontSize: 12, borderRadius: 7 }}>{j.logo}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{j.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{j.company} · Submitted today</div>
                      </div>
                    </div>
                    <span className={styles.statusSubmitted}>Submitted</span>
                  </div>
                )
              })}
            </>
          )}

          {view === 'criteria' && (
            <>
              <div className={styles.feedHeader}>
                <div className={styles.feedTitle}>Your Criteria</div>
                <div className={styles.feedSub}>Applymatic uses these to score and filter roles daily</div>
              </div>
              <div className={styles.criteriaCard}>
                {[
                  ['Target Roles', 'Software Engineer, Full Stack Engineer, Frontend Engineer, Backend Engineer'],
                  ['Salary Range', '$140,000 – $200,000'],
                  ['Location', 'Remote preferred · Open to hybrid'],
                  ['Key Skills', 'React, TypeScript, Node.js, PostgreSQL, AWS, REST APIs'],
                  ['Minimum Score', '70 · Roles below this are filtered out automatically'],
                ].map(([label, val]) => (
                  <div key={label} className={styles.criteriaRow}>
                    <div className={styles.criteriaLabel}>{label}</div>
                    <div className={styles.criteriaVal}>{val}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* DETAIL PANEL — scrolls naturally as one tall column */}
        {view === 'matches' && (
          <aside className={styles.detail}>

            {/* Sticky job header */}
            <div className={styles.detailHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className={styles.jobLogo} style={{ background: job.logoBg, color: job.logoColor, width: 44, height: 44, fontSize: 16, borderRadius: 10 }}>{job.logo}</div>
                <div>
                  <div className={styles.detailTitle}>{job.title}</div>
                  <div className={styles.detailCompany}>{job.company}</div>
                </div>
              </div>
              <div className={styles.detailMeta}>
                <span>💰 {job.salary}</span>
                <span>📍 {job.location}</span>
                <span>⏱ {job.posted}</span>
              </div>
            </div>

            {/* Scrollable body */}
            <div className={styles.detailBody} style={{ minHeight: 0, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

              <div className={styles.scoreBox}>
                <div className={styles.scoreBoxTop}>
                  <div className={styles.scoreBoxLabel}>AI Fit Score</div>
                  <div className={styles.scoreNum} style={{ color: scoreColor(job.score) }}>{job.score}</div>
                </div>
                {loading ? (
                  <div className={styles.loadingReasoning}>
                    <div className={styles.spinner} />
                    <span>Claude is analyzing this role...</span>
                  </div>
                ) : content?.reasoning ? (
                  <div className={styles.reasoning}>{content.reasoning}</div>
                ) : (
                  <div className={styles.reasoning} style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>Loading AI analysis...</div>
                )}
                <div className={styles.scoreBars}>
                  {scoreBars.map(b => (
                    <div key={b.label} className={styles.scoreBarRow}>
                      <span className={styles.scoreBarLabel}>{b.label}</span>
                      <div className={styles.scoreBarWrap}>
                        <div className={styles.scoreBarFill} style={{ width: `${b.val}%`, background: b.val >= 85 ? 'var(--accent)' : 'var(--blue)' }} />
                      </div>
                      <span className={styles.scoreBarVal}>{b.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.letterBox} style={{ flexShrink: 0 }}>
                <div className={styles.letterHeader}>
                  <span className={styles.letterLabel}>Tailored Cover Letter</span>
                  <button className={styles.copyBtn} onClick={copyLetter} disabled={!content?.coverLetter || loading}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className={styles.letterBody}>
                  {loading ? (
                    <div className={styles.loadingLetter}>
                      <div className={styles.spinner} />
                      <span>Writing your cover letter...</span>
                    </div>
                  ) : content?.coverLetter ? (
                    <pre className={styles.letterText}>{content.coverLetter}</pre>
                  ) : (
                    <span style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>Generating cover letter...</span>
                  )}
                </div>
              </div>

            </div>

            {/* Sticky action buttons */}
            <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.btnSkip}`} onClick={skipJob} disabled={state !== 'pending' || loading}>
                {state === 'skipped' ? '✕ Skipped' : '✕ Skip'}
              </button>
              <button className={`${styles.btn} ${styles.btnApprove}`} onClick={approveJob} disabled={state !== 'pending' || loading}>
                {state === 'approved' ? '✓ Applied' : '✓ Approve & Apply'}
              </button>
            </div>

          </aside>
        )}

      </div>

      {toast && (
        <div className={styles.toast}>
          <span>{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}

    </div>
  )
}