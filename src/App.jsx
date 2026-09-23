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
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[4.5rem] border-b border-white/10 transition-all duration-300 ${
        scrolled || open
          ? 'bg-[#071530]/90 shadow-[0_12px_30px_rgba(7,21,48,0.22)] backdrop-blur-md'
          : 'bg-transparent'
      } ${open ? 'bg-[#071530]/95' : ''}`}
    >
      <div className="mx-auto flex h-full w-[min(1480px,calc(100%-2rem))] items-center justify-between gap-4">
        <a className="flex min-w-0 items-center gap-3 text-white" href="#top" onClick={close}>
          <img src="/images/emblem.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
          <span className="flex min-w-0 flex-col">
            <strong className="font-[Cormorant_Garamond] text-[1.15rem] font-semibold tracking-[0.01em] text-white">
              JASKM
            </strong>
            <span className="overflow-hidden text-[0.68rem] text-white/75 whitespace-nowrap text-ellipsis">
              Sholashahar, Chattogram
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={close}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white/80 transition-colors duration-200 hover:text-[#e6d4a3]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            className="hidden rounded-sm border border-white/35 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:border-[#e6d4a3] hover:text-[#e6d4a3] md:inline-flex"
            href={site.portal}
            target="_blank"
            rel="noreferrer"
          >
            Student Portal
          </a>
          <a
            className="inline-flex items-center justify-center rounded-sm bg-[#c4a14a] px-4 py-2 text-sm font-medium text-[#071530] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#e6d4a3]"
            href="#admission"
          >
            Admission
          </a>
          <button
            className={`grid h-10 w-10 place-items-center text-white md:hidden ${open ? 'is-open' : ''}`}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-0.5 w-5 bg-current before:absolute before:-top-1.5 before:left-0 before:block before:h-0.5 before:w-5 before:bg-current before:content-[''] after:absolute after:top-1.5 after:left-0 after:block after:h-0.5 after:w-5 after:bg-current after:content-['']" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#071530]/95 md:hidden">
          <ul className="mx-auto flex w-[min(1280px,calc(100%-2rem))] flex-col gap-2 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  className="block border-b border-white/10 px-1 py-3 text-sm font-medium text-white/80 last:border-none"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative z-0 grid min-h-screen items-start overflow-hidden bg-[#071530] text-white" id="top" aria-label="Welcome">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/campus/admin-building.jpg"
          alt=""
          width={1051}
          height={640}
          fetchPriority="high"
          className="h-full w-full scale-100 object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,21,48,0.88),rgba(7,21,48,0.55)_48%,rgba(15,70,48,0.35))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,21,48,0.75),transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto w-[min(1280px,calc(100%-2rem))] grid gap-8 pb-16 pt-32 md:pb-20 md:pt-32">
        <div className="flex items-center gap-4 md:gap-5">
          <img
            src="/images/emblem.png"
            alt="JASKM emblem"
            width={120}
            height={120}
            className="h-[clamp(5.5rem,14vw,7.5rem)] w-[clamp(5.5rem,14vw,7.5rem)] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] animate-float-slow"
          />
          <div>
            <h1 className="m-0 max-w-[14ch] font-[Cormorant_Garamond] text-[clamp(2.6rem,7vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.025em] text-white">
              Jamea Ahmadia Sunnia Kamil Madrasah
            </h1>
            <p className="mt-2 font-[Hind_Siliguri] text-[clamp(1.05rem,2.4vw,1.35rem)] font-medium text-[#e6d4a3]">
              {site.nameBn}
            </p>
          </div>
        </div>

        <p className="m-0 max-w-[34rem] text-[clamp(1rem,2vw,1.15rem)] font-light leading-7 text-white/90">
          A Chattogram home of Qur’anic learning and prophetic love — forming scholars and citizens
          for this world and the hereafter since {about.established}.
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[0.82rem] tracking-[0.04em] text-white/70">
          <span className="before:mr-2 before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#c4a14a] before:align-middle">
            {site.location}
          </span>
          <span className="before:mr-2 before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#c4a14a] before:align-middle">
            EIIN {site.eiin}
          </span>
          <span className="before:mr-2 before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#c4a14a] before:align-middle">
            Code {site.madrasahCode}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-3">
          <a
            className="inline-flex items-center justify-center rounded-sm bg-[#c4a14a] px-5 py-3 text-sm font-medium text-[#071530] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#e6d4a3]"
            href="#admission"
          >
            Admission 2026
          </a>
          <a
            className="inline-flex items-center justify-center rounded-sm border border-white/40 bg-transparent px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-[#e6d4a3] hover:text-[#e6d4a3]"
            href="#about"
          >
            Our story
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.18em] text-white/55 animate-[bob_2.4s_ease-in-out_infinite]">
        Scroll
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="relative z-10 -mt-px overflow-hidden bg-[#edf5f2] py-16 md:py-24" id="about">
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(26,107,69,0.38),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(12,33,72,0.16),transparent_32%)]" />
      </div>
      <div className="relative mx-auto grid w-[min(1280px,calc(100%-2rem))] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="relative overflow-hidden rounded-[4px]">
          <img
            src="/images/campus/sl-01.jpg"
            alt="Students and campus life at JASKM"
            width={960}
            height={540}
            className="h-[32rem] w-full object-cover shadow-[0_24px_60px_rgba(7,21,48,0.18)] lg:h-[38rem]"
          />
          <img
            src="/images/campus/dome.jpg"
            alt=""
            width={390}
            height={607}
            aria-hidden="true"
            className="absolute -bottom-2 right-[4%] w-[min(38%,200px)] drop-shadow-[0_18px_30px_rgba(7,21,48,0.35)] animate-float-slow"
          />
        </div>

        <div className="text-[#0e1a2b]">
          <div className="mb-8 max-w-[36rem]">
            <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#1a6b45]">
              About the Madrasah
            </span>
            <h2 className="m-0 font-[Cormorant_Garamond] text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0c2148]">
              Seventy years of Sunni scholarship in Chattogram
            </h2>
          </div>

          <p className="mb-5 text-[1.12rem] leading-8 text-[#0e1a2b]">{about.summary}</p>
          <p className="mb-6 border-l-4 border-[#1a6b45] bg-[#1a6b45]/5 p-5 font-[Cormorant_Garamond] text-[1.3rem] italic leading-7 text-[#071530]">
            {mission}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#0c2148]/10 py-5 md:grid-cols-4">
            {about.highlights.map((item) => (
              <div key={item.label}>
                <strong className="block font-[Cormorant_Garamond] text-[1.55rem] leading-none text-[#071530]">
                  {item.value}
                </strong>
                <span className="mt-2 block text-[0.75rem] font-medium uppercase tracking-[0.06em] text-[#3d4f63]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <ul className="mt-6 grid gap-4">
            {about.timeline.map((item) => (
              <li key={item.year} className="grid grid-cols-[5.5rem_1fr] gap-4 align-baseline">
                <time className="font-[Cormorant_Garamond] text-[1.15rem] font-bold text-[#0f4630]">
                  {item.year}
                </time>
                <span className="text-base leading-7 text-[#0e1a2b]">{item.text}</span>
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
    <section className="relative bg-[#edf3f8] py-16 md:py-24" id="messages">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,33,72,0.06),transparent_40%)]" />
      <div className="relative mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="reveal mb-10 max-w-[36rem]">
          <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#1a6b45]">
            Leadership
          </span>
          <h2 className="m-0 font-[Cormorant_Garamond] text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0c2148]">
            Chairman & Principal
          </h2>
          <p className="mt-3 text-[1.08rem] leading-7 text-[#3d4f63]">
            Words of guidance from the governing body and the academic leadership of JASKM.
          </p>
        </div>

        <div className="grid gap-6">
          {messages.map((item) => (
            <article
              key={item.role}
              className="reveal group relative grid gap-6 overflow-hidden rounded-[22px] border border-[#0c2148]/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(240,244,247,0.96))] p-5 shadow-[0_18px_42px_rgba(7,21,48,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(7,21,48,0.12)] md:grid-cols-[220px_1fr] md:gap-8 md:p-7 lg:p-8"
            >
              <div className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(180deg,#1a6b45,#c4a14a)]" />
              <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
                <img
                  src={item.image}
                  alt={item.name}
                  width={180}
                  height={180}
                  loading="lazy"
                  className="h-[180px] w-[180px] rounded-[18px] border border-[#0c2148]/10 bg-[#e8eef4] object-cover object-top shadow-[0_18px_28px_rgba(7,21,48,0.12)] transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="mt-4">
                  <span className="mb-2 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#1a6b45]">
                    {item.role}
                  </span>
                  <h3 className="m-0 font-[Cormorant_Garamond] text-[1.55rem] leading-[1.2] text-[#071530]">
                    {item.name}
                  </h3>
                </div>
              </div>

              <div className="relative z-10 flex items-center border-l border-[#c4a14a]/30 pl-0 md:pl-5">
                <div className="flex h-full items-center">
                  <div className="mr-3 hidden text-[3.5rem] leading-none text-[#0c2148]/10 md:block font-[Cormorant_Garamond]">
                    “
                  </div>
                  <div className="space-y-4">
                    {item.body.map((para) => (
                      <p key={para.slice(0, 48)} className="m-0 text-[1.02rem] leading-8 text-[#0e1a2b]">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
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
    <section className="bg-[linear-gradient(160deg,#0c2148_0%,#0f4630_100%)] py-16 text-white md:py-24" id="admission">
      <div className="mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="reveal mb-10 max-w-[36rem]">
          <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#e6d4a3]">
            Admission
          </span>
          <h2 className="m-0 font-[Cormorant_Garamond] text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            Join the Jamea family
          </h2>
          <p className="mt-3 text-[1.08rem] leading-7 text-white/75">{admission.intro}</p>
        </div>

        <div className="reveal grid gap-4 md:grid-cols-3">
          {admission.actions.map((action) => (
            <a
              key={action.title}
              className="group grid gap-3 rounded-[4px] border border-white/15 bg-white/5 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#c4a14a] hover:bg-white/10"
              href={action.href}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              <h3 className="m-0 font-[Cormorant_Garamond] text-[1.45rem] text-white">{action.title}</h3>
              <p className="m-0 text-[0.95rem] leading-6 text-white/70">{action.text}</p>
              <span className="mt-1 text-sm font-semibold text-[#e6d4a3]">{action.cta} →</span>
            </a>
          ))}
        </div>

        <ol className="reveal mt-10 grid gap-4 md:grid-cols-4">
          {admission.steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-[#c4a14a]/55 pt-4">
              <span className="font-[Cormorant_Garamond] text-[1.4rem] font-semibold text-[#c4a14a]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="mt-2">
                <h3 className="m-0 text-[1.05rem] text-white">{step.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-6 text-white/70">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {admissionNotices.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 font-[Cormorant_Garamond] text-[1.6rem] text-white">Latest admission circulars & results</h3>
            <ul className="overflow-hidden rounded-[4px] border border-white/15 bg-white/5">
              {admissionNotices.slice(0, 6).map((notice) => (
                <li
                  key={`${notice.title}-${notice.date}`}
                  className="flex flex-col items-start gap-3 border-b border-white/10 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#e6d4a3]">
                      {notice.category}
                    </span>
                    <strong className="bn mt-1 block break-words text-base font-semibold text-white">{notice.title}</strong>
                    <time className="mt-1 block text-[0.82rem] text-[#e6d4a3]">{formatNoticeDate(notice.date)}</time>
                  </div>
                  {notice.file ? (
                    <a
                      href={notice.file}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center justify-center rounded-sm border border-[#e6d4a3]/40 px-3 py-1.5 text-[0.82rem] font-semibold text-[#e6d4a3] transition-colors duration-200 hover:bg-[#c4a14a] hover:text-[#071530]"
                    >
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
    <section className="relative bg-[#edf5f2] py-16 md:py-24" id="programs">
      <div className="mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="reveal mb-10 max-w-[36rem]">
          <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#1a6b45]">
            Academics
          </span>
          <h2 className="m-0 font-[Cormorant_Garamond] text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0c2148]">
            Pathways from first class to Kamil
          </h2>
          <p className="mt-3 text-[1.08rem] leading-7 text-[#3d4f63]">
            Six connected stages of Islamic education — from Ebtedayee foundations through Honours
            and Masters under Islamic Arabic University.
          </p>
        </div>

        <div className="grid gap-0 border-t border-[#0c2148]/10 md:grid-cols-2 md:[background:linear-gradient(90deg,transparent_49.5%,rgba(12,33,72,0.12)_49.5%,rgba(12,33,72,0.12)_50.5%,transparent_50.5%)]">
          {programs.map((program, index) => (
            <article
              key={program.title}
              className="reveal border-b border-[#0c2148]/10 p-6 transition-all duration-300 hover:pl-3 md:p-7 md:pr-6 md:[&:nth-child(2n)]:pl-6 md:[&:nth-child(2n)]:pr-0"
            >
              <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#c4a14a]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="m-0 mb-2 font-[Cormorant_Garamond] text-[1.65rem] font-semibold text-[#0c2148]">
                {program.title}
              </h3>
              <p className="m-0 max-w-[36ch] text-[0.98rem] leading-7 text-[#0e1a2b]/80">{program.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Patrons() {
  return (
    <section className="bg-[#071530] py-16 text-white md:py-24" id="patrons">
      <div className="mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="reveal mb-10 max-w-[36rem]">
          <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#c4a14a]">
            Spiritual lineage
          </span>
          <h2 className="m-0 font-[Cormorant_Garamond] text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            Founder & patrons
          </h2>
          <p className="mt-3 text-[1.08rem] leading-7 text-white/65">
            Guided by the light of Syed Ahmad Shah Sirikoti (R.A.) and the continuing care of his noble family.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {patrons.map((patron) => (
            <figure key={patron.name} className="reveal group text-center">
              <img
                src={patron.image}
                alt={patron.name}
                width={320}
                height={420}
                loading="lazy"
                className="mb-4 aspect-[3/4] w-full rounded-[4px] object-cover object-top grayscale-[0.15] transition-all duration-300 group-hover:-translate-y-1 group-hover:grayscale-0"
              />
              <figcaption>
                <h3 className="m-0 mb-1 font-[Cormorant_Garamond] text-[1.2rem] font-semibold text-white">
                  {patron.name}
                </h3>
                <span className="text-[0.8rem] uppercase tracking-[0.06em] text-[#e6d4a3]">{patron.role}</span>
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
    <section className="bg-[#eef4f8] py-16 md:py-24" id="campus">
      <div className="mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="reveal mb-10 max-w-[36rem]">
          <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#1a6b45]">
            Campus
          </span>
          <h2 className="m-0 font-[Cormorant_Garamond] text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0c2148]">
            A place built for learning and belonging
          </h2>
          <p className="mt-3 text-[1.08rem] leading-7 text-[#3d4f63]">
            From the green dome that marks the skyline to hostels that house a thousand students,
            the campus is designed for disciplined, warm student life.
          </p>
        </div>

        <div className="grid gap-14">
          {campusFeatures.map((feature) => (
            <article
              key={feature.title}
              className="reveal grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12"
            >
              <img
                src={feature.image}
                alt={feature.title}
                width={1051}
                height={640}
                loading="lazy"
                className="h-[16rem] w-full rounded-[4px] object-cover md:h-[18rem] lg:h-[20rem]"
              />
              <div>
                <h3 className="mb-3 font-[Cormorant_Garamond] text-[clamp(1.8rem,3vw,2.4rem)] font-semibold text-[#0c2148]">
                  {feature.title}
                </h3>
                <p className="m-0 max-w-[34ch] text-[1.05rem] leading-7 text-[#0e1a2b]/85">{feature.text}</p>
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
    <section className="bg-[#edf4f1] py-16 md:py-24" id="notices">
      <div className="mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="reveal mb-10 max-w-[36rem]">
          <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#1a6b45]">
            Notices
          </span>
          <h2 className="m-0 font-[Cormorant_Garamond] text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0c2148]">
            Recent notices
          </h2>
          <p className="mt-3 text-[1.08rem] leading-7 text-[#3d4f63]">
            Official circulars, results, and campus announcements from the madrasah office.
          </p>
        </div>

        <ul className="reveal overflow-hidden rounded-[4px] border border-[#0c2148]/10 bg-white">
          {items.slice(0, 10).map((notice) => (
            <li
              key={`${notice.title}-${notice.date}`}
              className="flex items-center justify-between gap-4 border-b border-[#0c2148]/10 px-5 py-4 last:border-b-0"
            >
              <div>
                <span className="inline-block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#0f4630]">
                  {notice.category}
                </span>
                <strong className="bn mt-1 block text-[1.02rem] font-semibold text-[#071530]">{notice.title}</strong>
                <time className="mt-1 block text-[0.82rem] text-[#3d4f63]">{formatNoticeDate(notice.date)}</time>
              </div>
              {notice.file ? (
                <a
                  href={notice.file}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-sm border border-[#0c2148] px-3 py-1.5 text-[0.82rem] font-semibold text-[#0c2148] transition-colors duration-200 hover:bg-[#0c2148] hover:text-white"
                >
                  Open
                </a>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="reveal mt-14 max-w-[36rem]">
          <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#1a6b45]">
            Campus life
          </span>
          <h2 className="m-0 font-[Cormorant_Garamond] text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0c2148]">
            Recent highlights
          </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="reveal group relative min-h-[280px] overflow-hidden rounded-[4px] text-white">
              <img
                src={item.image}
                alt=""
                width={800}
                height={600}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,21,48,0.92),rgba(7,21,48,0.2)_55%,transparent_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <time className="mb-2 block text-[0.75rem] uppercase tracking-[0.1em] text-[#e6d4a3]">{item.date}</time>
                <h3 className="m-0 font-[Cormorant_Garamond] text-[1.45rem] font-semibold leading-[1.2]">{item.title}</h3>
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
    <section className="py-16 md:py-24" id="contact">
      <div className="mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="reveal grid overflow-hidden rounded-[4px] bg-[#071530] text-white shadow-[0_24px_60px_rgba(7,21,48,0.18)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 md:p-10">
            <span className="mb-3 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#c4a14a]">
              Visit us
            </span>
            <h2 className="m-0 mb-3 font-[Cormorant_Garamond] text-[clamp(2rem,3.5vw,2.8rem)] font-semibold">
              Contact & location
            </h2>
            <p className="m-0 mb-7 text-white/65">Reach the office, explore the campus map, or follow official channels.</p>

            <ul className="mb-7 grid gap-4">
              <li className="grid gap-1">
                <span className="text-[0.72rem] uppercase tracking-[0.12em] text-[#c4a14a]">Address</span>
                <strong className="font-medium text-white">{site.address}</strong>
              </li>
              <li className="grid gap-1">
                <span className="text-[0.72rem] uppercase tracking-[0.12em] text-[#c4a14a]">Phone</span>
                <a className="font-medium text-white transition-colors duration-200 hover:text-[#e6d4a3]" href={`tel:${site.phone.replace(/\s/g, '')}`}>
                  {site.phone}
                </a>
              </li>
              <li className="grid gap-1">
                <span className="text-[0.72rem] uppercase tracking-[0.12em] text-[#c4a14a]">Mobile</span>
                <a className="font-medium text-white transition-colors duration-200 hover:text-[#e6d4a3]" href={`tel:${site.mobile.replace(/-/g, '')}`}>
                  {site.mobile}
                </a>
              </li>
              <li className="grid gap-1">
                <span className="text-[0.72rem] uppercase tracking-[0.12em] text-[#c4a14a]">Email</span>
                <div>
                  {site.emails.map((email) => (
                    <div key={email}>
                      <a className="block font-medium text-white transition-colors duration-200 hover:text-[#e6d4a3]" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </div>
                  ))}
                </div>
              </li>
            </ul>

            <div className="flex gap-3">
              <a className="rounded-sm border border-white/25 px-3 py-2 text-[0.82rem] transition-colors duration-200 hover:border-[#c4a14a] hover:text-[#e6d4a3]" href={site.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a className="rounded-sm border border-white/25 px-3 py-2 text-[0.82rem] transition-colors duration-200 hover:border-[#c4a14a] hover:text-[#e6d4a3]" href={site.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
              <a className="rounded-sm border border-white/25 px-3 py-2 text-[0.82rem] transition-colors duration-200 hover:border-[#c4a14a] hover:text-[#e6d4a3]" href={site.portal} target="_blank" rel="noreferrer">
                Portal
              </a>
            </div>
          </div>

          <div className="min-h-[360px]">
            <iframe
              title="JASKM on Google Maps"
              src={site.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full min-h-[360px] w-full border-0 grayscale-[0.25] contrast-105"
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
    <footer className="relative bg-[#071530] py-14 text-white/70">
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(196,161,74,0.2),transparent_28%)]" />
      </div>
      <div className="relative mx-auto w-[min(1280px,calc(100%-2rem))]">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="flex gap-4">
            <img src="/images/emblem.png" alt="" width={64} height={64} className="h-16 w-16 object-contain" />
            <div>
              <h3 className="m-0 mb-2 font-[Cormorant_Garamond] text-[1.4rem] font-semibold text-white">{site.shortName}</h3>
              <p className="bn m-0 text-base text-white/90">{site.nameBn}</p>
              <p className="mt-3 text-[0.9rem] leading-6 text-white/70">{site.tagline}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#c4a14a]">Explore</h4>
            <ul className="grid gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a className="text-white/70 transition-colors duration-200 hover:text-white" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#c4a14a]">Important links</h4>
            <ul className="grid gap-2">
              {links.map((item) => (
                <li key={item.href}>
                  <a className="text-white/70 transition-colors duration-200 hover:text-white" href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-6 text-[0.85rem]">
          <span>© {year} {site.name}. All rights reserved.</span>
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
      <main className="overflow-x-hidden">
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
