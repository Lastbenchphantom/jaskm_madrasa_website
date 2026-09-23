import { useEffect, useState } from 'react'
import { fetchNotices } from './api/notices'
import {
  about,
  admission,
  campusFeatures,
  formatNoticeDate,
  highlights,
  isAdmissionNotice,
  links,
  messages,
  mission,
  nav,
  patrons,
  programs,
  site,
} from './data/content'

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.reveal'))
    if (!nodes.length) return undefined

    const show = (el) => el.classList.add('is-visible')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
    )

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
      if (inView) show(node)
      else observer.observe(node)
    })

    const fallback = window.setTimeout(() => {
      nodes.forEach(show)
    }, 1800)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])
}

function Header() {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header${scrolled || open ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container nav-inner">
        <a className="brand" href="#top" onClick={close}>
          <img src="/images/emblem.png" alt="" width={44} height={44} />
          <span className="brand-text">
            <strong>JASKM</strong>
            <span>Sholashahar, Chattogram</span>
          </span>
        </a>

        <ul className="nav-links">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={close}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <a className="btn btn-ghost" href={site.portal} target="_blank" rel="noreferrer">
            Student Portal
          </a>
          <a className="btn btn-primary" href="#admission">
            Admission
          </a>
          <button
            className={`menu-toggle${open ? ' is-open' : ''}`}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top" aria-label="Welcome">
      <div className="hero-media" aria-hidden="true">
        <img
          src="/images/campus/admin-building.jpg"
          alt=""
          width={1051}
          height={640}
          fetchPriority="high"
        />
      </div>
      <div className="hero-pattern" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-brand">
          <img src="/images/emblem.png" alt="JASKM emblem" width={120} height={120} />
          <div className="hero-brand-copy">
            <h1>Jamea Ahmadia Sunnia Kamil Madrasah</h1>
            <p className="bn">{site.nameBn}</p>
          </div>
        </div>

        <p className="hero-lead">
          A Chattogram home of Qur’anic learning and prophetic love — forming scholars and citizens
          for this world and the hereafter since {about.established}.
        </p>

        <div className="hero-meta">
          <span>{site.location}</span>
          <span>EIIN {site.eiin}</span>
          <span>Code {site.madrasahCode}</span>
        </div>

        <div className="hero-ctas">
          <a className="btn btn-primary" href="#admission">
            Admission 2026
          </a>
          <a className="btn btn-ghost" href="#about">
            Our story
          </a>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        Scroll
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container about-grid">
        <div className="about-visual">
          <img
            src="/images/campus/sl-01.jpg"
            alt="Students and campus life at JASKM"
            width={960}
            height={540}
          />
          <img
            className="dome-float"
            src="/images/campus/dome.jpg"
            alt=""
            width={390}
            height={607}
            aria-hidden="true"
          />
        </div>

        <div className="about-copy">
          <div className="section-head">
            <span className="eyebrow">About the Madrasah</span>
            <h2>Seventy years of Sunni scholarship in Chattogram</h2>
          </div>
          <p className="about-lead">{about.summary}</p>
          <p className="mission">{mission}</p>

          <div className="stat-row">
            {about.highlights.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <ul className="timeline">
            {about.timeline.map((item) => (
              <li key={item.year}>
                <time>{item.year}</time>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Messages() {
  return (
    <section className="section messages-section" id="messages">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Leadership</span>
          <h2>Chairman & Principal</h2>
          <p>Words of guidance from the governing body and the academic leadership of JASKM.</p>
        </div>

        <div className="message-stack">
          {messages.map((item) => (
            <article className="message-block reveal" key={item.role}>
              <div className="message-person">
                <img src={item.image} alt={item.name} width={180} height={180} loading="lazy" />
                <div>
                  <span className="eyebrow">{item.role}</span>
                  <h3>{item.name}</h3>
                </div>
              </div>
              <div className="message-body">
                {item.body.map((para) => (
                  <p key={para.slice(0, 48)}>{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Admission({ admissionNotices }) {
  return (
    <section className="section admission-section" id="admission">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Admission</span>
          <h2>Join the Jamea family</h2>
          <p>{admission.intro}</p>
        </div>

        <div className="admission-actions reveal">
          {admission.actions.map((action) => (
            <a
              className="admission-action"
              key={action.title}
              href={action.href}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              <h3>{action.title}</h3>
              <p>{action.text}</p>
              <span>{action.cta} →</span>
            </a>
          ))}
        </div>

        <ol className="admission-steps reveal">
          {admission.steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-num">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {admissionNotices.length > 0 && (
          <div className="admission-circulars reveal">
            <h3>Latest admission circulars & results</h3>
            <ul className="notice-list compact">
              {admissionNotices.slice(0, 6).map((notice) => (
                <li key={`${notice.title}-${notice.date}`}>
                  <div>
                    <span className="notice-cat">{notice.category}</span>
                    <strong className="bn">{notice.title}</strong>
                    <time>{formatNoticeDate(notice.date)}</time>
                  </div>
                  {notice.file ? (
                    <a href={notice.file} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function Programs() {
  return (
    <section className="section programs" id="programs">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Academics</span>
          <h2>Pathways from first class to Kamil</h2>
          <p>
            Six connected stages of Islamic education — from Ebtedayee foundations through Honours
            and Masters under Islamic Arabic University.
          </p>
        </div>

        <div className="program-list">
          {programs.map((program, index) => (
            <article className="program-item reveal" key={program.title}>
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{program.title}</h3>
              <p>{program.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Patrons() {
  return (
    <section className="section patrons-band" id="patrons">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: 'var(--brass)' }}>
            Spiritual lineage
          </span>
          <h2>Founder & patrons</h2>
          <p>
            Guided by the light of Syed Ahmad Shah Sirikoti (R.A.) and the continuing care of his
            noble family.
          </p>
        </div>

        <div className="patron-row">
          {patrons.map((patron) => (
            <figure className="patron reveal" key={patron.name}>
              <img src={patron.image} alt={patron.name} width={320} height={420} loading="lazy" />
              <figcaption>
                <h3>{patron.name}</h3>
                <span>{patron.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Campus() {
  return (
    <section className="section" id="campus">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Campus</span>
          <h2>A place built for learning and belonging</h2>
          <p>
            From the green dome that marks the skyline to hostels that house a thousand students,
            the campus is designed for disciplined, warm student life.
          </p>
        </div>

        <div className="campus-stack">
          {campusFeatures.map((feature) => (
            <article className="campus-feature reveal" key={feature.title}>
              <img
                src={feature.image}
                alt={feature.title}
                width={1051}
                height={640}
                loading="lazy"
              />
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Notices({ items }) {
  return (
    <section className="section notices-section" id="notices">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Notices</span>
          <h2>Recent notices</h2>
          <p>Official circulars, results, and campus announcements from the madrasah office.</p>
        </div>

        <ul className="notice-list reveal">
          {items.slice(0, 10).map((notice) => (
            <li key={`${notice.title}-${notice.date}`}>
              <div>
                <span className="notice-cat">{notice.category}</span>
                <strong className="bn">{notice.title}</strong>
                <time>{formatNoticeDate(notice.date)}</time>
              </div>
              {notice.file ? (
                <a href={notice.file} target="_blank" rel="noreferrer">
                  Open
                </a>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="section-head reveal" style={{ marginTop: '3.5rem' }}>
          <span className="eyebrow">Campus life</span>
          <h2>Recent highlights</h2>
        </div>

        <div className="notice-rail">
          {highlights.map((item) => (
            <article className="notice reveal" key={item.title}>
              <img src={item.image} alt="" width={800} height={600} loading="lazy" />
              <div className="notice-body">
                <time>{item.date}</time>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-panel reveal">
          <div className="contact-info">
            <span className="eyebrow" style={{ color: 'var(--brass)' }}>
              Visit us
            </span>
            <h2>Contact & location</h2>
            <p>Reach the office, explore the campus map, or follow official channels.</p>

            <ul className="contact-list">
              <li>
                <span>Address</span>
                <strong>{site.address}</strong>
              </li>
              <li>
                <span>Phone</span>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
              </li>
              <li>
                <span>Mobile</span>
                <a href={`tel:${site.mobile.replace(/-/g, '')}`}>{site.mobile}</a>
              </li>
              <li>
                <span>Email</span>
                <div>
                  {site.emails.map((email) => (
                    <div key={email}>
                      <a href={`mailto:${email}`}>{email}</a>
                    </div>
                  ))}
                </div>
              </li>
            </ul>

            <div className="socials">
              <a href={site.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href={site.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
              <a href={site.portal} target="_blank" rel="noreferrer">
                Portal
              </a>
            </div>
          </div>

          <div className="contact-map">
            <iframe
              title="JASKM on Google Maps"
              src={site.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/images/emblem.png" alt="" width={64} height={64} />
            <div>
              <h3>{site.shortName}</h3>
              <p className="bn">{site.nameBn}</p>
              <p style={{ marginTop: '0.75rem' }}>{site.tagline}</p>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Important links</h4>
            <ul>
              {links.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span>
            EIIN {site.eiin} · Madrasah Code {site.madrasahCode}
          </span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [notices, setNotices] = useState([])
  useReveal()

  useEffect(() => {
    let alive = true
    fetchNotices().then((rows) => {
      if (alive) setNotices(rows)
    })
    return () => {
      alive = false
    }
  }, [])

  const admissionNotices = notices.filter(isAdmissionNotice)

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Messages />
        <Admission admissionNotices={admissionNotices} />
        <Programs />
        <Patrons />
        <Campus />
        <Notices items={notices} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
