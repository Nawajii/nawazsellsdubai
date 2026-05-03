'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const STATS = [
  { value: 200, suffix: '+', label: 'Nationalities Investing' },
  { value: 0, suffix: '%', label: 'Income Tax', static: true },
  { value: 7, suffix: '%+', label: 'Average Gross Yield' },
  { value: 1, prefix: '#', suffix: '', label: 'Safest City Globally' },
]

const WHY = [
  { icon: '🏛', title: 'Zero Income Tax', body: 'No capital gains tax. No inheritance tax. No income tax. Every dirham of yield stays with you.' },
  { icon: '📈', title: '7%+ Gross Yields', body: 'Dubai consistently outperforms London, Singapore, and Mumbai across most residential asset classes.' },
  { icon: '🌍', title: 'Gateway City', body: '8 hours from 80% of the world\'s population. Capital flows equally from East and West.' },
  { icon: '🏠', title: 'Golden Visa', body: 'A AED 2M+ investment unlocks a 10-year UAE residency visa for you and your family.' },
  { icon: '🔒', title: 'Regulated Market', body: 'Escrow-protected payments. Government-backed developer oversight. Strong investor protections.' },
  { icon: '💎', title: 'Capital Appreciation', body: 'Prime Dubai communities appreciated 20–40% through 2022–2024. Structural demand continues.' },
]

const PILLARS = [
  { h: 'Data-Driven', p: 'IRR models and yield projections, not marketing decks.' },
  { h: 'Investor-First', p: 'Your ROI is the brief. Always.' },
  { h: 'Off-Plan Specialist', p: 'Deep expertise in Dubai\'s off-plan and secondary markets.' },
  { h: 'Global Investors', p: 'Serving investors from across the world looking at Dubai.' },
]

const STEPS_LOAD = ['Searching project database…', 'Evaluating developer track record…', 'Computing yield model…', 'Running 3-year scenarios…', 'Preparing your brief…']

type Brief = {
  project: string; developer: string; developer_score: number; developer_note: string
  location: string; overview: string; price_sqft: string; gross_yield: string; net_yield: string
  bear: string; base: string; bull: string; payment_plan: string; handover: string
  golden_visa: boolean; verdict: 'BUY' | 'WATCH' | 'AVOID'; verdict_note: string; key_risk: string
}

function useInView(ref: React.RefObject<HTMLElement>, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

function Counter({ target, prefix = '', suffix = '', duration = 1800 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, 0.6)
  useEffect(() => {
    if (!inView || target === 0) { setCount(target); return }
    let start = 0; const step = target / (duration / 16)
    const iv = setInterval(() => { start = Math.min(start + step, target); setCount(Math.floor(start)); if (start >= target) clearInterval(iv) }, 16)
    return () => clearInterval(iv)
  }, [inView, target, duration])
  return <div ref={ref} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: '#C9A84C', lineHeight: 1, marginBottom: 6 }}>{prefix}{count}{suffix}</div>
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>)
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(32px)', transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s` }}>
      {children}
    </div>
  )
}

function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[
        { w: 600, h: 600, top: '-10%', left: '-10%', dur: '20s', color: 'rgba(201,168,76,.06)' },
        { w: 400, h: 400, top: '40%', right: '-8%', dur: '25s', color: 'rgba(20,184,166,.05)' },
        { w: 300, h: 300, bottom: '10%', left: '30%', dur: '18s', color: 'rgba(201,168,76,.04)' },
      ].map((o, i) => (
        <div key={i} style={{ position: 'absolute', width: o.w, height: o.h, top: o.top, left: (o as any).left, right: (o as any).right, bottom: (o as any).bottom, borderRadius: '50%', background: o.color, filter: 'blur(80px)', animation: `float${i} ${o.dur} ease-in-out infinite alternate` }} />
      ))}
    </div>
  )
}

export default function Home() {
  const [project, setProject] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [gated, setGated] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [ring, setRing] = useState({ x: 0, y: 0 })
  const [heroLoaded, setHeroLoaded] = useState(false)
  const briefRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100)
    const onScroll = () => { setScrolled(window.scrollY > 50); setScrollY(window.scrollY) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { setCursor({ x: e.clientX, y: e.clientY }) }
    window.addEventListener('mousemove', onMove)
    const animate = () => {
      ringRef.current.x += (cursor.x - ringRef.current.x) * 0.1
      ringRef.current.y += (cursor.y - ringRef.current.y) * 0.1
      setRing({ x: ringRef.current.x, y: ringRef.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', onMove); if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [cursor.x, cursor.y])

  useEffect(() => {
    if (!loading) return
    setStepIdx(0)
    const iv = setInterval(() => setStepIdx(i => Math.min(i + 1, STEPS_LOAD.length - 1)), 800)
    return () => clearInterval(iv)
  }, [loading])

  async function generate() {
    if (!project.trim()) return
    setLoading(true); setBrief(null); setGated(true)
    try {
      const res = await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project }) })
      const data = await res.json()
      setBrief(data)
      setTimeout(() => briefRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } catch { alert('Could not generate brief. Please try again.') }
    setLoading(false)
  }

  function submitLead() {
    if (!name.trim() || !phone.trim()) { alert('Please enter your name and WhatsApp number.'); return }
    if (!brief) return
    const msg = encodeURIComponent(`Hi Nawaz! I just got the investment brief for *${brief.project}* from your website.\n\nName: ${name}\nProject: ${brief.project}\nGross Yield: ${brief.gross_yield} | Verdict: ${brief.verdict}\n\nI'd love a personalised analysis.`)
    window.open(`https://wa.me/971563281781?text=${msg}`, '_blank')
    setGated(false)
  }

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
  const vc = { BUY: '#14B8A6', WATCH: '#C9A84C', AVOID: '#EF4444' }

  const N = '#060D1B', N2 = '#0C1628', G = '#C9A84C', T = '#14B8A6', C = '#F0EAD6', M = '#8A7F6E'
  const gb = '1px solid rgba(255,255,255,.07)'
  const glass = 'rgba(255,255,255,.04)'

  return (
    <main style={{ background: N, color: C, fontFamily: 'Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#C9A84C}
        input,button{font-family:Inter,sans-serif;outline:none}
        input::placeholder{color:#8A7F6E}
        @keyframes float0{0%{transform:translate(0,0) scale(1)}100%{transform:translate(40px,60px) scale(1.1)}}
        @keyframes float1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-30px,40px) scale(1.15)}}
        @keyframes float2{0%{transform:translate(0,0)}100%{transform:translate(50px,-30px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.95)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scanline{0%{top:-100%}100%{top:200%}}
        .hero-word{display:inline-block;opacity:0;animation:slideUp .8s ease forwards}
        .nav-link{color:#8A7F6E;font-size:12px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;position:relative;transition:color .3s}
        .nav-link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:#C9A84C;transition:width .3s}
        .nav-link:hover{color:#C9A84C}.nav-link:hover::after{width:100%}
        .why-card{background:#0C1628;padding:36px;transition:background .3s,transform .3s,box-shadow .3s;cursor:default;position:relative;overflow:hidden}
        .why-card::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:2px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);transition:left .5s}
        .why-card:hover{background:rgba(201,168,76,.05);transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,.4)}
        .why-card:hover::before{left:100%}
        .pillar{padding:18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-left:2px solid #C9A84C;transition:background .3s,transform .3s}
        .pillar:hover{background:rgba(201,168,76,.05);transform:translateX(4px)}
        .stat-card{padding:44px 32px;text-align:center;position:relative;overflow:hidden;transition:background .3s}
        .stat-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,.03),transparent);opacity:0;transition:opacity .3s}
        .stat-card:hover::after{opacity:1}
        .cta-primary{padding:15px 38px;background:#C9A84C;color:#060D1B;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;border:none;cursor:pointer;text-decoration:none;display:inline-block;position:relative;overflow:hidden;transition:transform .2s}
        .cta-primary::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.15);transform:translateX(-100%);transition:transform .4s}
        .cta-primary:hover{transform:translateY(-2px)}.cta-primary:hover::after{transform:translateX(0)}
        .cta-secondary{padding:15px 38px;border:1px solid rgba(240,234,214,.25);color:#F0EAD6;font-size:11px;letter-spacing:.12em;text-transform:uppercase;background:transparent;cursor:pointer;text-decoration:none;display:inline-block;transition:all .3s}
        .cta-secondary:hover{border-color:#F0EAD6;background:rgba(255,255,255,.04);transform:translateY(-2px)}
        .inp-row{display:flex;border:1px solid rgba(255,255,255,.07);overflow:hidden;transition:border-color .3s,box-shadow .3s}
        .inp-row:focus-within{border-color:#C9A84C;box-shadow:0 0 0 1px rgba(201,168,76,.2)}
        .gen-btn{padding:18px 32px;background:#C9A84C;color:#060D1B;border:none;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;cursor:pointer;min-width:160px;transition:background .2s,transform .1s}
        .gen-btn:hover{background:#E2C473}.gen-btn:disabled{opacity:.6;cursor:not-allowed}
        .gen-btn:active:not(:disabled){transform:scale(.98)}
        .wa-btn{padding:12px 22px;background:#25D366;color:#fff;border:none;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .2s;white-space:nowrap}
        .wa-btn:hover{background:#1DB954;transform:translateY(-1px)}
        .brief-card{padding:22px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);transition:border-color .3s}
        .brief-card:hover{border-color:rgba(201,168,76,.25)}
        .sc-card{padding:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);text-align:center;transition:transform .3s}
        .sc-card:hover{transform:translateY(-3px)}
        @media(max-width:768px){
          nav .nm{display:none}
          nav{padding:14px 20px !important}
          .stats-grid{grid-template-columns:1fr 1fr !important}
          .stat-card{border-right:none !important;border-bottom:1px solid rgba(255,255,255,.07)}
          .cards-grid,.pillar-grid,.scen-grid{grid-template-columns:1fr !important}
          .about-grid{grid-template-columns:1fr !important;gap:36px !important}
          .why-grid{grid-template-columns:1fr !important}
          .hero-btns{flex-direction:column;align-items:center}
          section,.ai-section,.about-section{padding:72px 20px !important}
          .footer-inner{flex-direction:column;align-items:center;text-align:center}
          .gate-form{flex-direction:column}
          .bh-inner{flex-direction:column;gap:12px}
        }
      `}</style>

      {/* CURSOR */}
      <div style={{ position: 'fixed', left: cursor.x, top: cursor.y, width: 5, height: 5, background: G, borderRadius: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9999, transition: 'opacity .3s' }} />
      <div style={{ position: 'fixed', left: ring.x, top: ring.y, width: 32, height: 32, border: `1px solid rgba(201,168,76,.4)`, borderRadius: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9998 }} />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: scrolled ? '14px 48px' : '24px 48px', background: scrolled ? 'rgba(6,13,27,.92)' : 'rgba(6,13,27,.6)', backdropFilter: 'blur(20px)', borderBottom: scrolled ? gb : '1px solid transparent', transition: 'all .4s' }} className="nm-nav">
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, letterSpacing: '.06em', color: C }}>Nawaz<span style={{ color: G }}>.</span></span>
        <div className="nm" style={{ display: 'flex', gap: 36 }}>
          {['Get a Brief', 'About', 'Why Dubai'].map((l, i) => <a key={i} href={['#ai', '#about', '#why'][i]} className="nav-link">{l}</a>)}
        </div>
        <a href="https://wa.me/971563281781" target="_blank" style={{ padding: '9px 22px', border: `1px solid ${G}`, color: G, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all .3s' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = G; (e.target as HTMLElement).style.color = N }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = G }}>
          Book a Call
        </a>
      </nav>

      {/* HERO */}
      <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/skyline.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `translateY(${scrollY * 0.3}px)`, willChange: 'transform' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(6,13,27,.35) 0%,rgba(6,13,27,.2) 40%,rgba(6,13,27,.95) 100%)' }} />
        <FloatingOrbs />
        {/* Scanline effect */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: .04 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#C9A84C,transparent)', animation: 'scanline 6s linear infinite' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, padding: '0 24px' }}>
          <div style={{ opacity: heroLoaded ? 1 : 0, transition: 'opacity .5s', marginBottom: 22 }}>
            <span style={{ fontSize: 11, letterSpacing: '.32em', textTransform: 'uppercase', color: G }}>Off-Plan Specialist &nbsp;·&nbsp; Dubai</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(52px,9vw,108px)', fontWeight: 300, lineHeight: 1.02, marginBottom: 28 }}>
            {['Your', 'Private'].map((w, i) => <span key={i} className="hero-word" style={{ animationDelay: `${.3 + i * .1}s`, marginRight: '0.25em' }}>{w}</span>)}
            <br />
            <em style={{ color: G, fontStyle: 'italic' }}>
              {['Investment', 'Analyst'].map((w, i) => <span key={i} className="hero-word" style={{ animationDelay: `${.5 + i * .1}s`, marginRight: '0.25em' }}>{w}</span>)}
            </em>
            <br />
            {['in', 'Dubai'].map((w, i) => <span key={i} className="hero-word" style={{ animationDelay: `${.7 + i * .1}s`, marginRight: '0.25em' }}>{w}</span>)}
          </h1>
          <p style={{ fontSize: 15, color: M, maxWidth: 520, margin: '0 auto 44px', fontWeight: 300, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'none' : 'translateY(16px)', transition: 'all .8s .8s' }}>
            Not a salesperson. A data-driven advisor for investors seeking yield, capital growth, and tax-free wealth in Dubai.
          </p>
          <div className="hero-btns" style={{ display: 'flex', gap: 16, justifyContent: 'center', opacity: heroLoaded ? 1 : 0, transition: 'opacity .8s 1s' }}>
            <a href="#ai" className="cta-primary">Get a Free Investment Brief</a>
            <a href="#about" className="cta-secondary">About Nawaz</a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s 1.4s', animation: heroLoaded ? 'pulse 2.5s ease-in-out 1.4s infinite' : 'none' }}>
          <div style={{ width: 1, height: 48, background: `linear-gradient(${G}, transparent)` }} />
          <span style={{ fontSize: 9, letterSpacing: '.25em', textTransform: 'uppercase', color: M }}>Scroll</span>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: N2, borderTop: gb, borderBottom: gb }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-card" style={{ borderRight: i < 3 ? gb : 'none' }}>
            {s.static ? (
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 300, color: G, lineHeight: 1, marginBottom: 6 }}>0%</div>
            ) : (
              <Counter target={s.value} prefix={s.prefix || ''} suffix={s.suffix} />
            )}
            <div style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: M }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI SECTION */}
      <section id="ai" className="ai-section" style={{ padding: '100px 48px', position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal><p style={{ fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase', color: T, marginBottom: 14 }}>Analyst Intelligence</p></Reveal>
          <Reveal delay={.1}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(34px,5vw,64px)', fontWeight: 300, lineHeight: 1.06, marginBottom: 16 }}>
              Analyse Any Dubai Project<br /><em style={{ color: G }}>the Way Institutions Do</em>
            </h2>
          </Reveal>
          <Reveal delay={.2}>
            <p style={{ fontSize: 14, color: M, maxWidth: 560, margin: '0 auto' }}>
              Enter any off-plan project. Get the same depth of analysis institutional investors use — developer track record, yield projections, payment plan quality, and capital appreciation scenarios. Instantly.
            </p>
          </Reveal>
          <Reveal delay={.3}>
            <div className="inp-row" style={{ marginTop: 44 }}>
              <input value={project} onChange={e => setProject(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()}
                style={{ flex: 1, padding: '18px 24px', background: glass, border: 'none', color: C, fontSize: 14 }}
                placeholder="e.g. Sobha Siniya Island, Ramada Residences, Binghatti Aurora…" />
              <button onClick={generate} disabled={loading} className="gen-btn">{loading ? 'Analysing…' : 'Generate Brief'}</button>
            </div>
          </Reveal>

          {loading && (
            <div style={{ padding: '64px 0', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 60, height: 60, margin: '0 auto 24px' }}>
                <div style={{ position: 'absolute', inset: 0, border: `1.5px solid rgba(255,255,255,.07)`, borderTopColor: G, borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 8, border: `1px solid rgba(201,168,76,.2)`, borderBottomColor: T, borderRadius: '50%', animation: 'spin 1.2s linear infinite reverse' }} />
              </div>
              <div style={{ fontSize: 12, color: M, letterSpacing: '.1em', marginBottom: 20 }}>Analysing project…</div>
              <div style={{ maxWidth: 300, margin: '0 auto' }}>
                {STEPS_LOAD.slice(0, stepIdx + 1).map((s, i) => (
                  <div key={i} style={{ fontSize: 11, color: i === stepIdx ? G : M, margin: '5px 0', transition: 'color .3s', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    <span style={{ color: i < stepIdx ? T : i === stepIdx ? G : M, fontSize: 10 }}>{i < stepIdx ? '✓' : i === stepIdx ? '›' : '○'}</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {brief && !loading && (
            <div ref={briefRef} style={{ textAlign: 'left', marginTop: 44, animation: 'fadeIn .6s ease' }}>
              {/* Header */}
              <div className="bh-inner" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 22, borderBottom: gb, marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: T, marginBottom: 6 }}>Investment Brief</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300 }}>{brief.project}</div>
                  <div style={{ fontSize: 13, color: M, marginTop: 4 }}>{brief.location}</div>
                </div>
                <div style={{ padding: '8px 20px', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 600, background: `${vc[brief.verdict]}15`, color: vc[brief.verdict], border: `1px solid ${vc[brief.verdict]}`, animation: 'pulse 2s ease-in-out infinite' }}>{brief.verdict}</div>
              </div>
              {/* Overview */}
              <p style={{ fontSize: 13, color: M, lineHeight: 1.9, marginBottom: 28, borderLeft: `2px solid ${G}`, paddingLeft: 18 }}>{brief.overview}</p>
              {/* Cards */}
              <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Gross Yield (Est.)', val: brief.gross_yield, sub: 'Net yield: ' + brief.net_yield },
                  { label: 'Price per sqft', val: brief.price_sqft, sub: 'Handover: ' + brief.handover },
                  { label: 'Developer', val: brief.developer, sub: stars(brief.developer_score) + ' ' + brief.developer_note, small: true, starColor: G },
                  { label: 'Payment Plan', val: brief.payment_plan, sub: brief.golden_visa ? '✓ Golden Visa Eligible' : '✗ Below Golden Visa threshold', subColor: brief.golden_visa ? T : M, small: true },
                ].map((c, i) => (
                  <div key={i} className="brief-card">
                    <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: M, marginBottom: 8 }}>{c.label}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: c.small ? 20 : 28, fontWeight: 400, color: G }}>{c.val}</div>
                    <div style={{ fontSize: 11, color: (c as any).subColor || M, marginTop: 6 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
              {/* Scenarios */}
              <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: M, marginBottom: 14 }}>3-Year Capital Appreciation Scenarios</div>
              <div className="scen-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
                {[{ l: 'Bear Case', v: brief.bear, c: '#EF4444' }, { l: 'Base Case', v: brief.base, c: G }, { l: 'Bull Case', v: brief.bull, c: T }].map((s, i) => (
                  <div key={i} className="sc-card">
                    <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: M, marginBottom: 8 }}>{s.l}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
              {/* Gate */}
              {gated ? (
                <div style={{ position: 'relative' }}>
                  <div style={{ filter: 'blur(8px)', opacity: .4, pointerEvents: 'none', userSelect: 'none' }}>
                    {['Analyst Verdict', 'Key Risk'].map((l, i) => (
                      <div key={i} style={{ padding: 22, background: glass, border: gb, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: M }}>{l}</div>
                        <div style={{ height: 14, background: 'rgba(255,255,255,.07)', width: ['80%', '60%'][i], margin: '8px 0', borderRadius: 2 }} />
                        <div style={{ height: 14, background: 'rgba(255,255,255,.07)', width: ['55%', '40%'][i], borderRadius: 2 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,transparent,rgba(6,13,27,.95) 40%)', gap: 16, padding: 32 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, textAlign: 'center' }}>Your full brief is ready.</div>
                    <div style={{ fontSize: 13, color: M, textAlign: 'center', maxWidth: 420, lineHeight: 1.7 }}>Enter your WhatsApp to receive the complete analysis — analyst verdict, key risks, and a personalised note from Nawaz.</div>
                    <div className="gate-form" style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 500, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {[{ v: name, s: setName, p: 'Your name' }, { v: phone, s: setPhone, p: 'WhatsApp (+91 or +971…)' }].map((f, i) => (
                        <input key={i} value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p}
                          style={{ flex: 1, minWidth: 160, padding: '13px 18px', background: glass, border: gb, color: C, fontSize: 13 }} />
                      ))}
                      <button onClick={submitLead} className="wa-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Send to WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ animation: 'fadeIn .6s ease' }}>
                  <div style={{ padding: 22, background: glass, border: `1px solid ${vc[brief.verdict]}`, borderLeft: `3px solid ${vc[brief.verdict]}`, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: M, marginBottom: 8 }}>Analyst Verdict — {brief.verdict}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.85 }}>{brief.verdict_note}</div>
                  </div>
                  <div style={{ padding: 22, background: glass, border: gb, marginBottom: 20 }}>
                    <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: M, marginBottom: 8 }}>Key Risk</div>
                    <div style={{ fontSize: 13, color: M, lineHeight: 1.85 }}>{brief.key_risk}</div>
                  </div>
                  <div style={{ padding: 28, background: 'rgba(20,184,166,.06)', border: `1px solid ${T}`, textAlign: 'center' }}>
                    <div style={{ fontSize: 13, color: T, marginBottom: 16 }}>Want a personalised analysis with your budget, timeline and goals?</div>
                    <a href="https://wa.me/971563281781" target="_blank" className="cta-primary">Book a Private Briefing with Nawaz</a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section" style={{ padding: '100px 48px' }}>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: -20, left: -20, right: 20, bottom: 20, border: `1px solid rgba(201,168,76,.2)`, transition: 'border-color .3s' }} />
              <div style={{ width: '100%', aspectRatio: '3/4', background: `linear-gradient(135deg, ${N2}, rgba(20,184,166,.08))`, border: gb, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 80, fontWeight: 300, color: 'rgba(201,168,76,.15)', letterSpacing: '-.02em' }}>N.</span>
              </div>
              {/* Gold accent bar */}
              <div style={{ position: 'absolute', bottom: -1, left: -1, right: -1, height: 3, background: `linear-gradient(90deg, ${G}, transparent)` }} />
            </div>
          </Reveal>
          <div>
            <Reveal><p style={{ fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase', color: T, marginBottom: 14 }}>About</p></Reveal>
            <Reveal delay={.1}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(34px,4vw,58px)', fontWeight: 300, lineHeight: 1.06, marginBottom: 22 }}>More Analyst.<br /><em style={{ color: G }}>Less Agent.</em></h2></Reveal>
            <Reveal delay={.2}><p style={{ fontSize: 13, color: M, lineHeight: 1.9, marginBottom: 14 }}>I'm Nawaz — an independent property advisor specialising in off-plan investments and secondary market transactions for serious investors looking at Dubai.</p></Reveal>
            <Reveal delay={.25}><p style={{ fontSize: 13, color: M, lineHeight: 1.9, marginBottom: 14 }}>B.Com Honours from SRCC Delhi. Indian Army background. I bring discipline, rigor, and an analyst-first lens to every client engagement — IRR models, yield scenarios, and institutional-grade briefs included.</p></Reveal>
            <Reveal delay={.3}><p style={{ fontSize: 13, color: M, lineHeight: 1.9, marginBottom: 32 }}>My clients don't get a brochure. They get a private investment brief.</p></Reveal>
            <Reveal delay={.35}>
              <div className="pillar-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {PILLARS.map((c, i) => (
                  <div key={i} className="pillar">
                    <h4 style={{ fontSize: 12, fontWeight: 500, marginBottom: 5, letterSpacing: '.04em' }}>{c.h}</h4>
                    <p style={{ fontSize: 11, color: M, lineHeight: 1.65 }}>{c.p}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY DUBAI */}
      <section id="why" style={{ padding: '100px 48px', background: N2, position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal><p style={{ fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase', color: T, marginBottom: 14 }}>The Investment Case</p></Reveal>
          <Reveal delay={.1}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(34px,5vw,64px)', fontWeight: 300, lineHeight: 1.06, marginBottom: 56 }}>Why Smart Capital<br /><em style={{ color: G }}>Moves to Dubai</em></h2></Reveal>
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,.06)' }}>
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * .07}>
                <div className="why-card" style={{ height: '100%' }}>
                  <div style={{ fontSize: 24, marginBottom: 18 }}>{w.icon}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, marginBottom: 12 }}>{w.title}</h3>
                  <p style={{ fontSize: 12, color: M, lineHeight: 1.8 }}>{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '48px', borderTop: gb }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20 }}>Nawaz<span style={{ color: G }}>.</span></span>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[['LinkedIn', 'https://www.linkedin.com/in/syed-nawaz-573aa9131/'], ['Instagram', 'https://instagram.com/nawazsellsdubai'], ['YouTube', 'https://youtube.com/@nawaz'], ['WhatsApp', 'https://wa.me/971563281781']].map(([l, h]) => (
              <a key={l} href={h} target="_blank" className="nav-link">{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 11, color: M }}>© 2026 nawazsellsdubai.com</span>
        </div>
      </footer>
    </main>
  )
}
