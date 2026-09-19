'use client'

import { useState, useEffect } from 'react'
import styles from './demo.module.css'

const JOBS = [
  {
    id: 0,
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salary: '$180,000 – $220,000',
    score: 94,
    tags: ['React', 'TypeScript', 'Payments'],
    jobDescription: `We're looking for a Senior Frontend Engineer to join Stripe's payments team. You'll build the interfaces that millions of businesses use to accept payments globally.

Responsibilities:
- Lead frontend architecture decisions for our payments dashboard
- Build performant, accessible React components used by 500k+ merchants
- Collaborate with design and backend teams to ship new payment features
- Mentor junior engineers and contribute to engineering culture

Requirements:
- 5+ years of frontend engineering experience
- Expert-level React and TypeScript
- Experience with payments, fintech, or high-stakes UIs
- Strong opinions about code quality and testing`,
  },
  {
    id: 1,
    title: 'Staff Software Engineer',
    company: 'Linear',
    location: 'Remote',
    salary: '$200,000 – $250,000',
    score: 88,
    tags: ['Full-Stack', 'Product', 'Tools'],
    jobDescription: `Linear is building the next generation of project management software. We're looking for a Staff Engineer who cares deeply about developer experience and product quality.

Responsibilities:
- Own large technical initiatives from design through delivery
- Improve Linear's core data model and sync engine
- Drive architectural decisions that affect the whole engineering org
- Work closely with founders on product direction

Requirements:
- 8+ years of software engineering
- Strong full-stack background (React, Node, PostgreSQL)
- Experience building real-time collaborative software
- High bar for product quality and UX`,
  },
  {
    id: 2,
    title: 'Senior Software Engineer, Platform',
    company: 'Vercel',
    location: 'Remote',
    salary: '$175,000 – $210,000',
    score: 79,
    tags: ['Infrastructure', 'Node.js', 'Edge'],
    jobDescription: `Vercel is the platform for frontend developers. We're looking for engineers to build the infrastructure that powers millions of websites.

Responsibilities:
- Build and scale edge infrastructure serving billions of requests
- Improve deploy pipelines and developer workflows
- Work on Node.js runtime and serverless function execution
- Partner with open source communities (Next.js, etc.)

Requirements:
- 4+ years of backend/infrastructure engineering
- Deep Node.js and JavaScript expertise
- Experience with cloud platforms (AWS, GCP, or Azure)
- Interest in developer tooling and DX`,
  },
  {
    id: 3,
    title: 'Product Engineer',
    company: 'Notion',
    location: 'New York, NY',
    salary: '$160,000 – $195,000',
    score: 71,
    tags: ['React', 'Product', 'Collaboration'],
    jobDescription: `Notion is building a connected workspace for teams. We're looking for Product Engineers who can blur the line between engineering and product.

Responsibilities:
- Build new Notion features end-to-end, from DB schema to UI
- Collaborate directly with product and design without heavy process
- Improve editor performance and real-time collaboration
- Contribute to Notion's design system

Requirements:
- 3+ years of product-focused engineering
- Strong React skills, ideally with complex editor/content experiences
- Ability to prototype quickly and iterate based on feedback
- Care about craft and product details`,
  },
]

const CRITERIA_TAGS = ['Remote', '$140k–$200k', 'React / TS', 'Node.js', 'AWS', 'PostgreSQL']

const NAV_ITEMS = [
  { icon: '⚡', label: "Today's Matches", count: 4, active: true },
  { icon: '📋', label: 'Applications', count: null, active: false },
  { icon: '⚙️', label: 'Criteria', count: null, active: false },
]

function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? '#4ade80' : score >= 75 ? '#5c9eff' : '#f59e0b'
  return (
    <div className={styles.scoreRing} style={{ '--score-color': color } as React.CSSProperties}>
      <span className={styles.scoreNumber} style={{ color }}>{score}</span>
      <span className={styles.scoreLabel}>match</span>
    </div>
  )
}

export default function DemoPage() {
  const [selectedJob, setSelectedJob] = useState(0)
  const [reasoning, setReasoning] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [actionTaken, setActionTaken] = useState<Record<number, 'approved' | 'skipped'>>({})
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')

  async function generateContent(jobId: number) {
    const job = JOBS[jobId]
    setLoading(true)
    setReasoning('')
    setCoverLetter('')
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          jobDescription: job.jobDescription,
        }),
      })
      const data = await res.json()
      setReasoning(data.reasoning || '')
      setCoverLetter(data.coverLetter || '')
    } catch {
      setReasoning('Unable to generate analysis.')
      setCoverLetter('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateContent(0)
  }, [])

  function selectJob(id: number) {
    setSelectedJob(id)
    generateContent(id)
    setMobileView('detail')
  }

  function handleAction(action: 'approved' | 'skipped') {
    setActionTaken(prev => ({ ...prev, [selectedJob]: action }))
  }

  const job = JOBS[selectedJob]

  const jobListPanel = (
    <div className={styles.jobList}>
      {/* Persona */}
      <div className={styles.persona}>
        <div className={styles.personaAvatar}>JU</div>
        <div className={styles.personaInfo}>
          <div className={styles.personaName}>John Utah</div>
          <div className={styles.personaTitle}>Software Engineer · 5 yrs exp</div>
        </div>
        <div className={styles.personaBadge}>Demo</div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Resume</span>
          <span className={styles.statValue}>Uploaded ✓</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Applied</span>
          <span className={styles.statValue}>0 roles</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Pending</span>
          <span className={styles.statValue}>4 matches</span>
        </div>
      </div>

      {/* Nav */}
      <div className={styles.navSection}>
        <div className={styles.navLabel}>Navigation</div>
        {NAV_ITEMS.map(item => (
          <div key={item.label} className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}>
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navItemLabel}>{item.label}</span>
            {item.count && <span className={styles.navCount}>{item.count}</span>}
          </div>
        ))}
      </div>

      {/* Criteria */}
      <div className={styles.criteriaSection}>
        <div className={styles.navLabel}>Your Criteria</div>
        <div className={styles.criteriaTagsWrap}>
          {CRITERIA_TAGS.map(tag => (
            <span key={tag} className={styles.criteriaTag}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Match count */}
      <div className={styles.matchCount}>4 matches found</div>

      {/* Job cards */}
      {JOBS.map(j => (
        <div
          key={j.id}
          className={`${styles.jobCard} ${selectedJob === j.id ? styles.jobCardActive : ''} ${actionTaken[j.id] ? styles.jobCardActioned : ''}`}
          onClick={() => selectJob(j.id)}
        >
          <div className={styles.jobCardTop}>
            <div className={styles.jobCardInfo}>
              <div className={styles.jobCardTitle}>{j.title}</div>
              <div className={styles.jobCardCompany}>{j.company}</div>
              <div className={styles.jobCardLocation}>{j.location}</div>
            </div>
            <ScoreRing score={j.score} />
          </div>
          <div className={styles.jobCardTags}>
            {j.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          {actionTaken[j.id] && (
            <div className={`${styles.actionedBadge} ${actionTaken[j.id] === 'approved' ? styles.actionedApproved : styles.actionedSkipped}`}>
              {actionTaken[j.id] === 'approved' ? '✓ Approved' : '✗ Skipped'}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const detailPanel = (
    <div className={styles.detailPanel}>
      <div className={styles.detailHeader}>
        <button className={styles.backButton} onClick={() => setMobileView('list')}>
          ← Back
        </button>
        <div className={styles.detailHeaderInfo}>
          <h2 className={styles.detailTitle}>{job.title}</h2>
          <div className={styles.detailMeta}>
            <span>{job.company}</span>
            <span className={styles.dot}>·</span>
            <span>{job.location}</span>
            <span className={styles.dot}>·</span>
            <span>{job.salary}</span>
          </div>
        </div>
        <ScoreRing score={job.score} />
      </div>

      <div className={styles.detailBody} style={{ overflowY: 'scroll', flex: 1, minHeight: 0 }}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.aiIcon}>✦</span> AI Analysis
          </h3>
          {loading ? (
            <div className={styles.loadingPulse}>
              <div className={styles.loadingLine} />
              <div className={styles.loadingLine} style={{ width: '80%' }} />
              <div className={styles.loadingLine} style={{ width: '60%' }} />
            </div>
          ) : (
            <p className={styles.reasoning}>{reasoning}</p>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Cover Letter</h3>
          {loading ? (
            <div className={styles.loadingPulse}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.loadingLine} style={{ width: `${85 + Math.random() * 15}%` }} />
              ))}
            </div>
          ) : (
            <div className={styles.letterBox} style={{ flexShrink: 0 }}>
              <pre className={styles.letterText}>{coverLetter}</pre>
            </div>
          )}
        </section>

        <div className={styles.actionBar}>
          {actionTaken[selectedJob] ? (
            <div className={`${styles.actionConfirm} ${actionTaken[selectedJob] === 'approved' ? styles.actionConfirmApprove : styles.actionConfirmSkip}`}>
              {actionTaken[selectedJob] === 'approved' ? '✓ Application queued for submission' : '✗ Job skipped'}
            </div>
          ) : (
            <>
              <button className={styles.btnSkip} onClick={() => handleAction('skipped')}>Skip</button>
              <button className={styles.btnApprove} onClick={() => handleAction('approved')}>Approve & Submit</button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.logo}>Applymatic</div>
        <div className={styles.demoTag}>Live Demo</div>
      </div>

      {/* Desktop */}
      <div className={styles.layout}>
        {jobListPanel}
        {detailPanel}
      </div>

      {/* Mobile */}
      <div className={styles.mobileLayout}>
        {mobileView === 'list' ? jobListPanel : detailPanel}
      </div>
    </div>
  )
}