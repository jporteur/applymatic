import { supabase } from '@/lib/supabase'
import WaitlistForm from '@/components/WaitlistForm'
import styles from './page.module.css'

// Fetch live waitlist count from Supabase at request time (server component)
async function getWaitlistCount(): Promise<number> {
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
  if (error || count === null) return 0
  return count
}

const steps = [
  {
    num: '01',
    title: 'Set your criteria',
    body: 'Tell us your target roles, stack, salary, and location. Upload your resume once. Takes two minutes.',
  },
  {
    num: '02',
    title: 'We find and score every match',
    body: 'Each morning, our AI scans thousands of new postings across LinkedIn, Indeed, and company sites — ranking each one against your background and experience.',
  },
  {
    num: '03',
    title: 'Approve in 60 seconds',
    body: 'You get a daily digest with matched jobs, AI fit scores, and a tailored cover letter for each. Tap approve on the ones you want.',
  },
  {
    num: '04',
    title: 'We handle the rest',
    body: "We submit the application, fill every ATS form field, and attach your resume. You'll never copy-paste your work history again.",
  },
]

const features = [
  { label: 'Multi-source scanning',   desc: 'LinkedIn, Indeed, Greenhouse, Lever — all in one place' },
  { label: 'AI fit scoring',          desc: 'Each job scored 0–100 against your actual tech background' },
  { label: 'Tailored cover letters',  desc: 'Written per role, not a template with your name dropped in' },
  { label: 'Human-in-the-loop',       desc: 'You approve every application before it goes out — always' },
  { label: 'ATS form filling',        desc: 'Every field, every dropdown, every upload — handled automatically' },
  { label: 'Application tracker',     desc: 'Pipeline view of every role you\'ve applied to, all in one place' },
]

const problems = [
  { before: 'Spend hours searching job boards',         after: 'Get a curated list every morning' },
  { before: 'Rewrite cover letters from scratch',       after: 'AI drafts one per role in seconds' },
  { before: 'Copy-paste your work history endlessly',   after: 'One upload, applied everywhere' },
  { before: 'Apply to the wrong roles by mistake',      after: 'Every job scored before you see it' },
]

export default async function Home() {
  const waitlistCount = await getWaitlistCount()
  const displayCount = Math.max(waitlistCount, 1).toLocaleString()

  return (
    <main className={styles.main}>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoMark} />
          Applymatic
        </div>
        <div className={styles.navLinks}>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={`${styles.badge} animate-fade-up`}>
          <span className={styles.badgeDot} />
          Built for tech workers
        </div>

        <h1 className={`${styles.headline} animate-fade-up delay-1`}>
          Apply smarter,<br />
          <span className={styles.accentText}>not more.</span>
        </h1>

        <p className={`${styles.subhead} animate-fade-up delay-2`}>
          AI finds matching roles, writes tailored cover letters,<br className={styles.desktopBreak} />
          and submits applications for you. You approve — we handle the rest.
        </p>

        <p className={`${styles.mission} animate-fade-up delay-3`}>
          While we don&rsquo;t guarantee placement, we do guarantee a thorough and thoughtful
          experience resulting in more high quality role matches.
        </p>

        <div className="animate-fade-up delay-4">
          <WaitlistForm />
        </div>

        <p className={`${styles.socialProof} animate-fade-up delay-5`}>
          Join <strong>{displayCount}+</strong> tech workers already on the waitlist
        </p>

        {/* Stats bar */}
        <div className={`${styles.statsBar} animate-fade-up delay-6`}>
          <div className={styles.stat}>
            <span className={styles.statNum}>50+</span>
            <span className={styles.statLabel}>applications / week on Pro</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>3 min</span>
            <span className={styles.statLabel}>avg daily review time</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>LinkedIn, Indeed + more</span>
            <span className={styles.statLabel}>sources scanned daily</span>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className={styles.section}>
        <div className={styles.beforeAfter}>
          <div className={styles.beforeCol}>
            <p className={styles.colLabel}>Before</p>
            {problems.map((p, i) => (
              <div key={i} className={styles.beforeItem}>
                <span className={styles.crossIcon}>✕</span>
                {p.before}
              </div>
            ))}
          </div>
          <div className={styles.arrowCol}>
            <div className={styles.arrowLine} />
          </div>
          <div className={styles.afterCol}>
            <p className={styles.colLabel} style={{ color: 'var(--accent)' }}>After</p>
            {problems.map((p, i) => (
              <div key={i} className={styles.afterItem}>
                <span className={styles.checkIcon}>✓</span>
                {p.after}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.section} id="how-it-works">
        <p className={styles.sectionLabel}>How it works</p>
        <h2 className={styles.sectionTitle}>Four steps, zero grinding</h2>
        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.num} className={styles.stepCard}>
              <span className={styles.stepNum}>{step.num}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>What&rsquo;s included</p>
        <h2 className={styles.sectionTitle}>Everything you need,<br />nothing you don&rsquo;t</h2>
        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.label} className={styles.featureCard}>
              <div className={styles.featureDot} />
              <div>
                <p className={styles.featureLabel}>{f.label}</p>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.section} id="pricing">
        <p className={styles.sectionLabel}>Pricing</p>
        <h2 className={styles.sectionTitle}>Pays for itself with one interview</h2>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <p className={styles.planName}>Free</p>
            <p className={styles.planPrice}>$0</p>
            <p className={styles.planDesc}>5 job matches/week, AI scoring. No credit card required.</p>
          </div>
          <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
            <div className={styles.popularBadge}>Most popular</div>
            <p className={styles.planName}>Pro</p>
            <div className={styles.planPriceRow}>
              <p className={styles.planPrice}>$19</p>
              <p className={styles.planPer}>/mo</p>
            </div>
            <p className={styles.planDesc}>50 matches/week, tailored cover letters, auto-apply up to 25 jobs/week.</p>
          </div>
          <div className={styles.pricingCard}>
            <p className={styles.planName}>Accelerator</p>
            <div className={styles.planPriceRow}>
              <p className={styles.planPrice}>$39</p>
              <p className={styles.planPer}>/mo</p>
            </div>
            <p className={styles.planDesc}>Unlimited matches, unlimited auto-apply, resume tailoring per role.</p>
          </div>
        </div>
        <p className={styles.pricingNote}>
          Pricing locked for waitlist members. Join now to secure early-access rates.
        </p>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.ctaTitle}>Stop grinding applications.<br />Start getting interviews.</h2>
        <WaitlistForm />
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <span className={styles.logoMark} style={{ width: 16, height: 16 }} />
          Applymatic
        </div>
        <p className={styles.footerNote}>
          Questions? <a href="mailto:jporteur@gmail.com">jporteur@gmail.com</a>
        </p>
      </footer>

    </main>
  )
}
