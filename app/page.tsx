'use client'
import { useState, useEffect, useRef } from 'react'

const STATS = [
  { value: 200, suffix: '+', label: 'Nationalities Investing' },
  { value: 0, suffix: '%', label: 'Income Tax', static: true },
  { value: 7, suffix: '%+', label: 'Average Gross Yield' },
  { value: 1, prefix: '#', suffix: '', label: 'Safest City Globally' },
]

const WHY = [
  { icon: '🏛', title: 'Zero Income Tax', body: 'No capital gains tax. No inheritance tax. No income tax. Every dirham of yield stays with you.' },
  { icon: '📈', title: '7%+ Gross Yields', body: 'Dubai consistently outperforms London, Singapore, and Mumbai across most residential asset classes.' },
  { icon: '🌍', title: 'Gateway City', body: "8 hours from 80% of the world's population. Capital flows equally from East and West." },
  { icon: '🏠', title: 'Golden Visa', body: 'A AED 2M+ investment unlocks a 10-year UAE residency visa for you and your family.' },
  { icon: '🔒', title: 'Regulated Market', body: 'Escrow-protected payments. Government-backed developer oversight. Strong investor protections.' },
  { icon: '💎', title: 'Capital Appreciation', body: 'Prime Dubai communities appreciated 20–40% through 2022–2024. Structural demand continues.' },
]

const PILLARS = [
  { h: 'Data-Driven', p: 'IRR models and yield projections, not marketing decks.' },
  { h: 'Investor-First', p: 'Your ROI is the brief. Always.' },
  { h: 'Off-Plan Specialist', p: "Deep expertise in Dubai's off-plan and secondary markets." },
  { h: 'Global Investors', p: 'Serving investors from across the world looking at Dubai.' },
]

const LOAD_STEPS = ['Searching project database…','Evaluating developer track record…','Computing yield model…','Running 3-year scenarios…','Preparing your brief…']

const IMG = '/blueprint.png'

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

function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>, 0.6)
  useEffect(() => {
    if (!inView || target === 0) { setCount(target); return }
    let s = 0; const step = target / 60
    const iv = setInterval(() => { s = Math.min(s + step, target); setCount(Math.floor(s)); if (s >= target) clearInterval(iv) }, 20)
    return () => clearInterval(iv)
  }, [inView, target])
  return <div ref={ref} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:52, fontWeight:300, color:'#C9A84C', lineHeight:1, marginBottom:6 }}>{prefix}{count}{suffix}</div>
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<HTMLElement>)
  return <div ref={ref} style={{ opacity:inView?1:0, transform:inView?'none':'translateY(28px)', transition:`opacity .7s ease ${delay}s, transform .7s ease ${delay}s` }}>{children}</div>
}

export default function Home() {
  const [assembled, setAssembled] = useState(false)
  const [doorsOpen, setDoorsOpen] = useState(false)
  const [heroText, setHeroText] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [project, setProject] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [gated, setGated] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [ring, setRing] = useState({ x: -100, y: -100 })
  const ringRef = useRef({ x: -100, y: -100 })
  const briefRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setTimeout(() => setAssembled(true), 300) }, [])

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY
      setScrolled(sy > 50)
      if (sy > 80 && !doorsOpen) { setDoorsOpen(true); setTimeout(() => setHeroText(false), 200) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [doorsOpen])

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    let raf: number
    const animate = () => {
      ringRef.current.x += (cursor.x - ringRef.current.x) * 0.1
      ringRef.current.y += (cursor.y - ringRef.current.y) * 0.1
      setRing({ ...ringRef.current })
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [cursor.x, cursor.y])

  useEffect(() => {
    if (!loading) return
    setStepIdx(0)
    const iv = setInterval(() => setStepIdx(i => Math.min(i + 1, LOAD_STEPS.length - 1)), 800)
    return () => clearInterval(iv)
  }, [loading])

  async function generate() {
    if (!project.trim()) return
    setLoading(true); setBrief(null); setGated(true)
    setTimeout(() => briefRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    try {
      const res = await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project }) })
      setBrief(await res.json())
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
  const vc: Record<string,string> = { BUY:'#14B8A6', WATCH:'#C9A84C', AVOID:'#EF4444' }
  const N='#060D1B', N2='#0C1628', G='#C9A84C', T='#14B8A6', C='#F0EAD6', M='#8A7F6E'
  const gb='1px solid rgba(255,255,255,.07)'
  const ez='cubic-bezier(0.76,0,0.24,1)'

  return (
    <main style={{ background:N, color:C, fontFamily:'Inter,sans-serif', minHeight:'100vh', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#C9A84C}
        input,button{font-family:Inter,sans-serif;outline:none}
        input::placeholder{color:#8A7F6E}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(201,168,76,0)}50%{box-shadow:0 0 50px rgba(201,168,76,.12)}}
        @keyframes scanline{0%{top:-10%}100%{top:110%}}
        @keyframes wordIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
        .hero-word{display:inline-block;opacity:0;animation:wordIn .9s cubic-bezier(0.34,1.3,0.64,1) forwards}
        .nav-link{color:#8A7F6E;font-size:12px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;position:relative;transition:color .3s}
        .nav-link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:#C9A84C;transition:width .3s}
        .nav-link:hover{color:#C9A84C}.nav-link:hover::after{width:100%}
        .why-card{background:#0C1628;padding:36px;transition:background .3s,transform .3s;position:relative;overflow:hidden;height:100%}
        .why-card::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:2px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);transition:left .5s}
        .why-card:hover{background:rgba(201,168,76,.05);transform:translateY(-4px)}
        .why-card:hover::before{left:100%}
        .pillar{padding:18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-left:2px solid #C9A84C;transition:background .3s,transform .3s}
        .pillar:hover{background:rgba(201,168,76,.05);transform:translateX(4px)}
        .brief-card{padding:22px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);transition:border-color .3s}
        .brief-card:hover{border-color:rgba(201,168,76,.3)}
        .sc-card{padding:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);text-align:center;transition:transform .3s}
        .sc-card:hover{transform:translateY(-4px)}
        .cta-p{padding:15px 38px;background:#C9A84C;color:#060D1B;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;border:none;cursor:pointer;text-decoration:none;display:inline-block;transition:all .2s}
        .cta-p:hover{background:#E2C473;transform:translateY(-2px)}
        .cta-s{padding:15px 38px;border:1px solid rgba(240,234,214,.25);color:#F0EAD6;font-size:11px;letter-spacing:.12em;text-transform:uppercase;background:transparent;cursor:pointer;text-decoration:none;display:inline-block;transition:all .3s}
        .cta-s:hover{border-color:#F0EAD6;transform:translateY(-2px)}
        .wa-btn{padding:12px 22px;background:#25D366;color:#fff;border:none;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .2s;white-space:nowrap}
        .wa-btn:hover{background:#1DB954;transform:translateY(-1px)}
        .gen-btn{padding:20px 40px;background:#C9A84C;color:#060D1B;border:none;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;cursor:pointer;min-width:180px;transition:background .2s}
        .gen-btn:hover{background:#E2C473}.gen-btn:disabled{opacity:.6;cursor:not-allowed}
        @media(max-width:768px){
          nav{padding:14px 20px !important}.nm-links{display:none !important}
          .stats-g{grid-template-columns:1fr 1fr !important}
          .cards-g,.pillar-g,.scen-g,.about-g,.why-g{grid-template-columns:1fr !important}
          .about-g{gap:36px !important}
          section{padding:72px 20px !important}
          footer{flex-direction:column;align-items:center;text-align:center}
          .gate-form{flex-direction:column}
          .bh-r{flex-direction:column;gap:12px}
          .search-wrap{flex-direction:column !important}
          .gen-btn{min-width:unset;width:100%}
        }
      `}</style>

      {/* CURSOR */}
      <div style={{ position:'fixed', left:cursor.x, top:cursor.y, width:5, height:5, background:G, borderRadius:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none', zIndex:9999 }} />
      <div style={{ position:'fixed', left:ring.x, top:ring.y, width:32, height:32, border:'1px solid rgba(201,168,76,.4)', borderRadius:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none', zIndex:9998 }} />

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'space-between', padding:scrolled?'14px 48px':'24px 48px', background:scrolled?'rgba(6,13,27,.92)':'rgba(6,13,27,.3)', backdropFilter:'blur(20px)', borderBottom:scrolled?gb:'1px solid transparent', transition:'all .4s' }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, letterSpacing:'.06em' }}>Nawaz<span style={{color:G}}>.</span></span>
        <div className="nm-links" style={{ display:'flex', gap:36 }}>
          {['Get a Brief','About','Why Dubai'].map((l,i)=><a key={i} href={['#brief-section','#about','#why'][i]} className="nav-link">{l}</a>)}
        </div>
        <a href="https://wa.me/971563281781" target="_blank" style={{ padding:'9px 22px', border:`1px solid ${G}`, color:G, fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', textDecoration:'none', transition:'all .3s' }}
          onMouseEnter={e=>{(e.target as HTMLElement).style.background=G;(e.target as HTMLElement).style.color=N}}
          onMouseLeave={e=>{(e.target as HTMLElement).style.background='transparent';(e.target as HTMLElement).style.color=G}}>
          Book a Call
        </a>
      </nav>

      {/* ══════════════════════════════════ */}
      {/* HERO                              */}
      {/* ══════════════════════════════════ */}
      <section style={{ height:'100vh', position:'relative', overflow:'hidden' }}>

        {/* BASE IMAGE */}
        <div style={{ position:'absolute', inset:0, zIndex:1, backgroundImage:`url('${IMG}')`, backgroundSize:'cover', backgroundPosition:'center', transform:assembled?'scale(1)':'scale(1.1)', filter:assembled?'blur(0)':'blur(4px)', transition:'transform 1.6s cubic-bezier(0.34,1.2,0.64,1), filter 1.2s ease' }} />

        {/* FRAGMENT 1 — Palm Jebel Ali — bottom left */}
        <div style={{ position:'absolute', bottom:0, left:0, width:'45%', height:'55%', zIndex:2, pointerEvents:'none', backgroundImage:`url('${IMG}')`, backgroundSize:'200% 200%', backgroundPosition:'0% 100%', clipPath:'polygon(0 25%,100% 0,100% 100%,0 100%)', transform:assembled?'translate(0,0)':'translate(-60px,80px)', opacity:assembled?1:0, transition:'transform 1.3s cubic-bezier(0.34,1.3,0.64,1) .15s, opacity .9s ease .15s', mixBlendMode:'screen' }} />

        {/* FRAGMENT 2 — Dubai Islands — top right */}
        <div style={{ position:'absolute', top:0, right:0, width:'40%', height:'45%', zIndex:2, pointerEvents:'none', backgroundImage:`url('${IMG}')`, backgroundSize:'200% 200%', backgroundPosition:'100% 0%', clipPath:'polygon(0 0,100% 0,100% 75%,15% 100%)', transform:assembled?'translate(0,0)':'translate(60px,-70px)', opacity:assembled?1:0, transition:'transform 1.3s cubic-bezier(0.34,1.3,0.64,1) .3s, opacity .9s ease .3s', mixBlendMode:'screen' }} />

        {/* FRAGMENT 3 — Palm Jumeirah — center */}
        <div style={{ position:'absolute', top:'20%', left:'20%', width:'50%', height:'60%', zIndex:2, pointerEvents:'none', backgroundImage:`url('${IMG}')`, backgroundSize:'180% 180%', backgroundPosition:'40% 50%', clipPath:'polygon(10% 0,90% 5%,100% 95%,0 100%)', transform:assembled?'translate(0,0)':'translate(-40px,30px)', opacity:assembled?1:0, transition:'transform 1.5s cubic-bezier(0.34,1.2,0.64,1) .05s, opacity 1s ease .05s', mixBlendMode:'screen' }} />

        {/* DARK OVERLAY */}
        <div style={{ position:'absolute', inset:0, zIndex:3, background:'linear-gradient(180deg,rgba(6,13,27,.2) 0%,rgba(6,13,27,.05) 35%,rgba(6,13,27,.8) 100%)' }} />

        {/* SCANLINE */}
        <div style={{ position:'absolute', inset:0, zIndex:4, overflow:'hidden', pointerEvents:'none', opacity:.04 }}>
          <div style={{ position:'absolute', left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${G},transparent)`, animation:'scanline 8s linear infinite' }} />
        </div>

        {/* LEFT DOOR */}
        <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'50%', zIndex:10, overflow:'hidden', transform:doorsOpen?'translateX(-101%)':'translateX(0)', transition:`transform 1s ${ez} .05s` }}>
          <div style={{ position:'absolute', top:0, bottom:0, left:0, width:'200%', backgroundImage:`url('${IMG}')`, backgroundSize:'cover', backgroundPosition:'left center' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(6,13,27,.25),rgba(6,13,27,.05) 40%,rgba(6,13,27,.7))' }} />
          <div style={{ position:'absolute', top:0, right:0, bottom:0, width:2, background:`linear-gradient(180deg,transparent,${G},transparent)`, boxShadow:`0 0 24px ${G}` }} />
        </div>

        {/* RIGHT DOOR */}
        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'50%', zIndex:10, overflow:'hidden', transform:doorsOpen?'translateX(101%)':'translateX(0)', transition:`transform 1s ${ez} .05s` }}>
          <div style={{ position:'absolute', top:0, bottom:0, right:0, width:'200%', backgroundImage:`url('${IMG}')`, backgroundSize:'cover', backgroundPosition:'right center' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(6,13,27,.25),rgba(6,13,27,.05) 40%,rgba(6,13,27,.7))' }} />
          <div style={{ position:'absolute', top:0, left:0, bottom:0, width:2, background:`linear-gradient(180deg,transparent,${G},transparent)`, boxShadow:`0 0 24px ${G}` }} />
        </div>

        {/* HERO TEXT */}
        <div style={{ position:'absolute', inset:0, zIndex:11, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px', opacity:heroText?1:0, transform:heroText?'none':'translateY(-20px)', transition:'opacity .5s, transform .5s', pointerEvents:heroText?'auto':'none' }}>
          <p style={{ fontSize:11, letterSpacing:'.32em', textTransform:'uppercase', color:G, marginBottom:22, opacity:assembled?1:0, transition:'opacity .8s .5s' }}>Off-Plan Specialist &nbsp;·&nbsp; Dubai</p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(52px,9vw,106px)', fontWeight:300, lineHeight:1.02, marginBottom:28 }}>
            {['Your','Private'].map((w,i)=><span key={i} className="hero-word" style={{animationDelay:`${.5+i*.12}s`,marginRight:'.22em'}}>{w}</span>)}
            <br/>
            <em style={{color:G}}>{['Investment','Analyst'].map((w,i)=><span key={i} className="hero-word" style={{animationDelay:`${.74+i*.12}s`,marginRight:'.22em'}}>{w}</span>)}</em>
            <br/>
            {['in','Dubai'].map((w,i)=><span key={i} className="hero-word" style={{animationDelay:`${1+i*.12}s`,marginRight:'.22em'}}>{w}</span>)}
          </h1>
          <p style={{ fontSize:15, color:M, maxWidth:520, margin:'0 auto 44px', fontWeight:300, opacity:assembled?1:0, transition:'opacity .8s 1s' }}>Not a salesperson. A data-driven advisor for investors seeking yield, capital growth, and tax-free wealth in Dubai.</p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', opacity:assembled?1:0, transition:'opacity .8s 1.2s' }}>
            <a href="#brief-section" className="cta-p">Get a Free Investment Brief</a>
            <a href="#about" className="cta-s">About Nawaz</a>
          </div>
          <div style={{ position:'absolute', bottom:36, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:assembled?1:0, transition:'opacity 1s 1.6s' }}>
            <div style={{ width:1, height:48, background:`linear-gradient(${G},transparent)`, animation:'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize:9, letterSpacing:'.28em', textTransform:'uppercase', color:M }}>Scroll to Analyse</span>
          </div>
        </div>

        {/* SEARCH BAR — appears when doors open */}
        <div style={{ position:'absolute', inset:0, zIndex:12, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 48px', opacity:doorsOpen?1:0, transform:doorsOpen?'translateY(0)':'translateY(50px)', transition:'opacity .7s ease .7s, transform .7s cubic-bezier(0.34,1.2,0.64,1) .7s', pointerEvents:doorsOpen?'auto':'none' }}>
          <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,rgba(201,168,76,.15),rgba(201,168,76,.4),rgba(201,168,76,.15),transparent)`, pointerEvents:'none' }} />
          <p style={{ fontSize:10, letterSpacing:'.35em', textTransform:'uppercase', color:T, marginBottom:14 }}>Analyst Intelligence</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,4vw,52px)', fontWeight:300, lineHeight:1.08, marginBottom:36, textAlign:'center' }}>Analyse Any Dubai Project<br/><em style={{color:G}}>the Way Institutions Do</em></h2>
          <div className="search-wrap" style={{ display:'flex', width:'100%', maxWidth:760, border:`1px solid rgba(201,168,76,.4)`, overflow:'hidden', background:'rgba(6,13,27,.88)', backdropFilter:'blur(24px)', animation:'glow 3s ease-in-out infinite' }}>
            <input value={project} onChange={e=>setProject(e.target.value)} onKeyDown={e=>e.key==='Enter'&&generate()}
              style={{ flex:1, padding:'20px 28px', background:'transparent', border:'none', color:C, fontSize:15, fontFamily:'Inter,sans-serif' }}
              placeholder="Enter any Dubai off-plan project name…" />
            <button className="gen-btn" onClick={generate} disabled={loading}>{loading?'Analysing…':'Generate Brief'}</button>
          </div>
          <p style={{ marginTop:16, fontSize:11, color:'rgba(240,234,214,.3)', letterSpacing:'.1em', textTransform:'uppercase' }}>e.g. Sobha Siniya Island &nbsp;·&nbsp; Ramada Residences &nbsp;·&nbsp; Binghatti Aurora</p>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-g" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:N2, borderTop:gb, borderBottom:gb }}>
        {STATS.map((s,i)=>(
          <div key={i} style={{ padding:'44px 32px', textAlign:'center', borderRight:i<3?gb:'none' }}>
            {s.static?<div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:52, fontWeight:300, color:G, lineHeight:1, marginBottom:6 }}>0%</div>:<Counter target={s.value} prefix={s.prefix||''} suffix={s.suffix} />}
            <div style={{ fontSize:11, letterSpacing:'.15em', textTransform:'uppercase', color:M }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* BRIEF RESULTS */}
      <section id="brief-section" style={{ padding:'100px 48px' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          {!loading && !brief && (
            <div style={{ textAlign:'center' }}>
              <Reveal><p style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', color:T, marginBottom:14 }}>Ready to Analyse</p></Reveal>
              <Reveal delay={.1}><h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,4vw,58px)', fontWeight:300, lineHeight:1.08 }}>Scroll Up & Enter a Project<br/><em style={{color:G}}>to Get Your Brief</em></h2></Reveal>
            </div>
          )}

          {loading && (
            <div ref={briefRef} style={{ padding:'64px 0', textAlign:'center' }}>
              <div style={{ position:'relative', width:64, height:64, margin:'0 auto 28px' }}>
                <div style={{ position:'absolute', inset:0, border:'1.5px solid rgba(255,255,255,.07)', borderTopColor:G, borderRadius:'50%', animation:'spin .7s linear infinite' }} />
                <div style={{ position:'absolute', inset:10, border:'1px solid rgba(201,168,76,.2)', borderBottomColor:T, borderRadius:'50%', animation:'spin 1.2s linear infinite reverse' }} />
              </div>
              <div style={{ fontSize:12, color:M, letterSpacing:'.12em', marginBottom:24 }}>Analysing project…</div>
              {LOAD_STEPS.slice(0,stepIdx+1).map((s,i)=>(
                <div key={i} style={{ fontSize:11, color:i===stepIdx?G:M, margin:'5px 0', display:'flex', alignItems:'center', gap:8, justifyContent:'center', transition:'color .3s' }}>
                  <span style={{color:i<stepIdx?T:i===stepIdx?G:M}}>{i<stepIdx?'✓':i===stepIdx?'›':'○'}</span>{s}
                </div>
              ))}
            </div>
          )}

          {brief && !loading && (
            <div ref={briefRef} style={{ animation:'fadeIn .6s ease' }}>
              <div className="bh-r" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', paddingBottom:22, borderBottom:gb, marginBottom:28, flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', color:T, marginBottom:6 }}>Investment Brief</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:300 }}>{brief.project}</div>
                  <div style={{ fontSize:13, color:M, marginTop:4 }}>{brief.location}</div>
                </div>
                <div style={{ padding:'8px 20px', fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', fontWeight:600, background:`${vc[brief.verdict]}15`, color:vc[brief.verdict], border:`1px solid ${vc[brief.verdict]}`, animation:'pulse 2s ease-in-out infinite' }}>{brief.verdict}</div>
              </div>
              <p style={{ fontSize:13, color:M, lineHeight:1.9, marginBottom:28, borderLeft:`2px solid ${G}`, paddingLeft:18 }}>{brief.overview}</p>
              <div className="cards-g" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
                {[
                  { label:'Gross Yield (Est.)', val:brief.gross_yield, sub:'Net yield: '+brief.net_yield },
                  { label:'Price per sqft', val:brief.price_sqft, sub:'Handover: '+brief.handover },
                  { label:'Developer', val:brief.developer, sub:stars(brief.developer_score)+' '+brief.developer_note, small:true },
                  { label:'Payment Plan', val:brief.payment_plan, sub:brief.golden_visa?'✓ Golden Visa Eligible':'✗ Below Golden Visa threshold', subColor:brief.golden_visa?T:M, small:true },
                ].map((c,i)=>(
                  <div key={i} className="brief-card">
                    <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:M, marginBottom:8 }}>{c.label}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:c.small?20:28, color:G, fontWeight:400 }}>{c.val}</div>
                    <div style={{ fontSize:11, color:(c as any).subColor||M, marginTop:6 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:M, marginBottom:14 }}>3-Year Capital Appreciation Scenarios</div>
              <div className="scen-g" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:28 }}>
                {[{l:'Bear Case',v:brief.bear,c:'#EF4444'},{l:'Base Case',v:brief.base,c:G},{l:'Bull Case',v:brief.bull,c:T}].map((s,i)=>(
                  <div key={i} className="sc-card">
                    <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:M, marginBottom:8 }}>{s.l}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:300, color:s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
              {gated?(
                <div style={{ position:'relative' }}>
                  <div style={{ filter:'blur(8px)', opacity:.4, pointerEvents:'none', userSelect:'none' }}>
                    {['Analyst Verdict','Key Risk'].map((l,i)=>(
                      <div key={i} style={{ padding:22, background:'rgba(255,255,255,.04)', border:gb, marginBottom:14 }}>
                        <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:M }}>{l}</div>
                        <div style={{ height:14, background:'rgba(255,255,255,.07)', width:['80%','60%'][i], margin:'8px 0', borderRadius:2 }} />
                        <div style={{ height:14, background:'rgba(255,255,255,.07)', width:['55%','40%'][i], borderRadius:2 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(180deg,transparent,rgba(6,13,27,.96) 40%)', gap:16, padding:32 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, textAlign:'center' }}>Your full brief is ready.</div>
                    <div style={{ fontSize:13, color:M, textAlign:'center', maxWidth:420, lineHeight:1.7 }}>Enter your WhatsApp to receive the complete analysis — analyst verdict, key risks, and a personalised note from Nawaz.</div>
                    <div className="gate-form" style={{ display:'flex', gap:10, width:'100%', maxWidth:500, flexWrap:'wrap', justifyContent:'center' }}>
                      {[{v:name,s:setName,p:'Your name'},{v:phone,s:setPhone,p:'WhatsApp (+91 or +971…)'}].map((f,i)=>(
                        <input key={i} value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} style={{ flex:1, minWidth:160, padding:'13px 18px', background:'rgba(255,255,255,.04)', border:gb, color:C, fontSize:13 }} />
                      ))}
                      <button onClick={submitLead} className="wa-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Send to WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ):(
                <div style={{ animation:'fadeIn .6s ease' }}>
                  <div style={{ padding:22, background:'rgba(255,255,255,.04)', border:`1px solid ${vc[brief.verdict]}`, borderLeft:`3px solid ${vc[brief.verdict]}`, marginBottom:14 }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:M, marginBottom:8 }}>Analyst Verdict — {brief.verdict}</div>
                    <div style={{ fontSize:13, lineHeight:1.85 }}>{brief.verdict_note}</div>
                  </div>
                  <div style={{ padding:22, background:'rgba(255,255,255,.04)', border:gb, marginBottom:20 }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:M, marginBottom:8 }}>Key Risk</div>
                    <div style={{ fontSize:13, color:M, lineHeight:1.85 }}>{brief.key_risk}</div>
                  </div>
                  <div style={{ padding:28, background:'rgba(20,184,166,.06)', border:`1px solid ${T}`, textAlign:'center' }}>
                    <div style={{ fontSize:13, color:T, marginBottom:16 }}>Want a personalised analysis with your budget, timeline and goals?</div>
                    <a href="https://wa.me/971563281781" target="_blank" className="cta-p">Book a Private Briefing with Nawaz</a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding:'100px 48px' }}>
        <div className="about-g" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', top:-20, left:-20, right:20, bottom:20, border:'1px solid rgba(201,168,76,.2)' }} />
              <div style={{ width:'100%', aspectRatio:'3/4', background:`linear-gradient(135deg,${N2},rgba(20,184,166,.06))`, border:gb, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:90, fontWeight:300, color:'rgba(201,168,76,.12)' }}>N.</span>
              </div>
              <div style={{ position:'absolute', bottom:-1, left:-1, right:-1, height:3, background:`linear-gradient(90deg,${G},transparent)` }} />
            </div>
          </Reveal>
          <div>
            <Reveal><p style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', color:T, marginBottom:14 }}>About</p></Reveal>
            <Reveal delay={.1}><h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,4vw,58px)', fontWeight:300, lineHeight:1.06, marginBottom:22 }}>More Analyst.<br/><em style={{color:G}}>Less Agent.</em></h2></Reveal>
            <Reveal delay={.15}><p style={{ fontSize:13, color:M, lineHeight:1.9, marginBottom:14 }}>I'm Nawaz — an independent property advisor specialising in off-plan investments and secondary market transactions for serious investors looking at Dubai.</p></Reveal>
            <Reveal delay={.2}><p style={{ fontSize:13, color:M, lineHeight:1.9, marginBottom:14 }}>B.Com Honours from SRCC Delhi. Indian Army background. I bring discipline, rigor, and an analyst-first lens to every client engagement — IRR models, yield scenarios, and institutional-grade briefs included.</p></Reveal>
            <Reveal delay={.25}><p style={{ fontSize:13, color:M, lineHeight:1.9, marginBottom:32 }}>My clients don't get a brochure. They get a private investment brief.</p></Reveal>
            <Reveal delay={.3}>
              <div className="pillar-g" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {PILLARS.map((c,i)=>(
                  <div key={i} className="pillar">
                    <h4 style={{ fontSize:12, fontWeight:500, marginBottom:5, letterSpacing:'.04em' }}>{c.h}</h4>
                    <p style={{ fontSize:11, color:M, lineHeight:1.65 }}>{c.p}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY DUBAI */}
      <section id="why" style={{ padding:'100px 48px', background:N2 }}>
        <Reveal><p style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', color:T, marginBottom:14 }}>The Investment Case</p></Reveal>
        <Reveal delay={.1}><h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,5vw,64px)', fontWeight:300, lineHeight:1.06, marginBottom:56 }}>Why Smart Capital<br/><em style={{color:G}}>Moves to Dubai</em></h2></Reveal>
        <div className="why-g" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'rgba(255,255,255,.06)' }}>
          {WHY.map((w,i)=>(
            <Reveal key={i} delay={i*.07}>
              <div className="why-card">
                <div style={{ fontSize:24, marginBottom:18 }}>{w.icon}</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:400, marginBottom:12 }}>{w.title}</h3>
                <p style={{ fontSize:12, color:M, lineHeight:1.8 }}>{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:48, borderTop:gb, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20 }}>Nawaz<span style={{color:G}}>.</span></span>
        <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
          {[['LinkedIn','https://www.linkedin.com/in/syed-nawaz-573aa9131/'],['Instagram','https://instagram.com/nawazsellsdubai'],['YouTube','https://youtube.com/@nawaz'],['WhatsApp','https://wa.me/971563281781']].map(([l,h])=>(
            <a key={l} href={h} target="_blank" className="nav-link">{l}</a>
          ))}
        </div>
        <span style={{ fontSize:11, color:M }}>© 2026 nawazsellsdubai.com</span>
      </footer>
    </main>
  )
}
