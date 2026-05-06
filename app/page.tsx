'use client'
import { useState, useEffect, useRef } from 'react'

const STATS = [
  { value: '200+', label: 'Nationalities Investing', source: '' },
  { value: '0%', label: 'Income Tax', source: '' },
  { value: '7%+', label: 'Average Gross Yield', source: '' },
  { value: '#1', label: 'Safest City Globally', source: 'Numbeo Safety Index 2025' },
]

const WHY = [
  { icon: '🏛', title: 'Zero Income Tax', body: 'No capital gains tax. No inheritance tax. No income tax. Every dirham of yield stays with you.' },
  { icon: '📈', title: '7%+ Gross Yields', body: 'Dubai consistently outperforms London, Singapore, and Mumbai across most residential asset classes.' },
  { icon: '🌍', title: 'Gateway City', body: "8 hours from 80% of the world's population. Capital flows equally from East and West." },
  { icon: '🏠', title: 'Golden Visa', body: 'A AED 2M+ investment unlocks a 10-year UAE residency visa for you and your family.' },
  { icon: '🔒', title: 'Regulated Market', body: 'Escrow-protected payments. Government-backed developer oversight. Strong investor protections.' },
  { icon: '💎', title: 'Capital Appreciation', body: 'Prime Dubai communities appreciated 20–40% through 2022–2024. Structural demand continues.' },
]

const BRIEF_CONTENTS = [
  { glyph: '∿', label: 'Gross & Net Yield Projection', desc: 'Estimated rental returns based on current market rates for the community and unit type.' },
  { glyph: '◈', label: 'Developer Track Record', desc: 'Delivery history, RERA standing, and a 1–5 analyst rating with a one-line verdict.' },
  { glyph: '⬡', label: 'Payment Plan Breakdown', desc: 'Construction vs post-handover split, and what it means for your cash flow.' },
  { glyph: '↗', label: '3-Year Appreciation Scenarios', desc: 'Bear, base, and bull case capital appreciation projections.' },
  { glyph: '⊟', label: 'Entry Price vs Market', desc: 'Launch price benchmarked against current secondary market rates in the same community.' },
  { glyph: '◎', label: 'Golden Visa Eligibility', desc: 'Whether this project qualifies for the UAE 10-year Golden Visa at entry price.' },
]

const PILLARS = [
  { h: 'Data-Driven', p: 'IRR models and yield projections, not marketing decks.' },
  { h: 'Investor-First', p: 'Your ROI is the brief. Always.' },
  { h: 'Off-Plan Specialist', p: "Deep expertise in Dubai's off-plan and secondary markets." },
  { h: 'Global Investors', p: 'Serving investors from across the world looking at Dubai.' },
]

const LOAD_STEPS = ['Searching project database…','Evaluating developer track record…','Computing yield model…','Running 3-year scenarios…','Preparing your brief…']

type Brief = {
  project: string; developer: string; developer_score: number; developer_note: string
  location: string; overview: string; price_sqft: string; gross_yield: string; net_yield: string
  bear: string; base: string; bull: string; payment_plan: string; handover: string
  golden_visa: boolean; verdict: 'BUY' | 'WATCH' | 'AVOID'; verdict_note: string; key_risk: string
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [project, setProject] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [gated, setGated] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const briefRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        .nav-link{color:#8A7F6E;font-size:12px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;transition:color .2s}
        .nav-link:hover{color:#C9A84C}
        .cta-p{padding:14px 36px;background:#C9A84C;color:#060D1B;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;border:none;cursor:pointer;text-decoration:none;display:inline-block;transition:background .2s}
        .cta-p:hover{background:#E2C473}
        .why-card{background:#0C1628;padding:36px;transition:background .2s}
        .why-card:hover{background:rgba(201,168,76,.04)}
        .pillar{padding:18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-left:2px solid #C9A84C}
        .brief-card{padding:22px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
        .sc-card{padding:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);text-align:center}
        .bc-card{padding:20px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);display:flex;gap:14px;align-items:flex-start}
        .wa-btn{padding:12px 22px;background:#25D366;color:#fff;border:none;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:7px;transition:background .2s;white-space:nowrap}
        .wa-btn:hover{background:#1DB954}
        .gen-btn{padding:18px 36px;background:#C9A84C;color:#060D1B;border:none;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;cursor:pointer;min-width:160px;transition:background .2s}
        .gen-btn:hover{background:#E2C473}
        .gen-btn:disabled{opacity:.6;cursor:not-allowed}
        @media(max-width:768px){
          nav{padding:14px 20px !important}.nm-links{display:none !important}
          .stats-g{grid-template-columns:1fr 1fr !important}
          .cards-g,.pillar-g,.scen-g,.about-g,.why-g,.bc-g{grid-template-columns:1fr !important}
          .about-g{gap:36px !important}
          .sec{padding:72px 20px !important}
          footer{flex-direction:column;align-items:center;text-align:center}
          .gate-form{flex-direction:column}
          .bh-r{flex-direction:column;gap:12px}
          .search-row{flex-direction:column !important}
          .gen-btn{width:100%;min-width:unset}
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:scrolled?'14px 48px':'22px 48px', background:scrolled?'rgba(6,13,27,.95)':'rgba(6,13,27,.8)', backdropFilter:'blur(20px)', borderBottom:gb, transition:'padding .3s, background .3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, border:`1px solid ${G}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:G, fontSize:14, fontWeight:600 }}>N</span>
          </div>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, letterSpacing:'.06em' }}>Nawaz<span style={{color:G}}>.</span></span>
        </div>
        <div className="nm-links" style={{ display:'flex', gap:36 }}>
          {['Get a Brief','About','Why Dubai'].map((l,i)=><a key={i} href={['#brief-section','#about','#why'][i]} className="nav-link">{l}</a>)}
        </div>
        <a href="https://wa.me/971563281781" target="_blank" style={{ padding:'9px 22px', border:`1px solid ${G}`, color:G, fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', textDecoration:'none', transition:'all .2s' }}
          onMouseEnter={e=>{(e.target as HTMLElement).style.background=G;(e.target as HTMLElement).style.color=N}}
          onMouseLeave={e=>{(e.target as HTMLElement).style.background='transparent';(e.target as HTMLElement).style.color=G}}>
          Book a Call
        </a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'140px 48px 80px', borderBottom:gb }}>
        <p style={{ fontSize:11, letterSpacing:'.32em', textTransform:'uppercase', color:G, marginBottom:24 }}>Off-Plan Specialist &nbsp;·&nbsp; Dubai</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(52px,8vw,100px)', fontWeight:300, lineHeight:1.04, marginBottom:28 }}>
          Your Private<br/><em style={{color:G}}>Investment Analyst</em><br/>in Dubai
        </h1>
        <p style={{ fontSize:15, color:M, maxWidth:520, margin:'0 auto 20px', fontWeight:300, lineHeight:1.8 }}>
          Not a salesperson. A data-driven advisor for investors seeking yield, capital growth, and tax-free wealth in Dubai.
        </p>
        {/* TRUST SIGNAL — replaces "About Nawaz" CTA */}
        <p style={{ fontSize:12, color:M, letterSpacing:'.08em', marginBottom:48, borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)', padding:'14px 28px', display:'inline-block' }}>
          Serving investors from <span style={{color:G}}>40+ countries</span> &nbsp;·&nbsp; Dubai Off-Plan Specialist
        </p>
        {/* SINGLE CTA */}
        <a href="#brief-section" className="cta-p">Get Your Free Investment Brief →</a>
      </section>

      {/* STATS */}
      <div className="stats-g" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:N2, borderBottom:gb }}>
        {STATS.map((s,i)=>(
          <div key={i} style={{ padding:'40px 32px', textAlign:'center', borderRight:i<3?gb:'none', position:'relative' }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:52, fontWeight:300, color:G, lineHeight:1, marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:11, letterSpacing:'.15em', textTransform:'uppercase', color:M }}>{s.label}</div>
            {s.source && <div style={{ fontSize:9, color:'rgba(138,127,110,.5)', marginTop:8, letterSpacing:'.06em' }}>{s.source}</div>}
          </div>
        ))}
      </div>

      {/* BRIEF SECTION */}
      <section id="brief-section" className="sec" style={{ padding:'100px 48px', borderBottom:gb }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <div style={{ marginBottom:56 }}>

            {/* HEADING */}
            <p style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', color:T, marginBottom:14 }}>Analyst Intelligence</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,4vw,54px)', fontWeight:300, lineHeight:1.08, marginBottom:14 }}>
              Get Your<br/><em style={{color:G}}>Institutional-Grade Analysis</em>
            </h2>
            <p style={{ fontSize:13, color:M, maxWidth:540, lineHeight:1.8, marginBottom:36 }}>
              Enter a project name, or upload a sales offer or brochure. Our analyst engine researches the asset using live market data and delivers the same framework used by institutional investors — instantly.
            </p>

            {/* SEARCH + UPLOAD INPUT */}
            <div style={{ background:'rgba(255,255,255,.06)', border:`1px solid rgba(201,168,76,.3)`, padding:28, marginBottom:14, boxShadow:'0 0 0 1px rgba(201,168,76,.06), 0 8px 40px rgba(0,0,0,.4)' }}>
              {/* Text input row */}
              <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:M, marginBottom:12 }}>Project Name</div>
              <div className="search-row" style={{ display:'flex', border:`1px solid rgba(255,255,255,.12)`, overflow:'hidden', marginBottom:20, background:N }}>
                <input value={project} onChange={e=>setProject(e.target.value)} onKeyDown={e=>e.key==='Enter'&&generate()}
                  style={{ flex:1, padding:'18px 24px', background:'transparent', border:'none', color:C, fontSize:14 }}
                  placeholder="e.g. Sobha Siniya Island, Ramada Residences, Binghatti Aurora…" />
                <button className="gen-btn" onClick={generate} disabled={loading}>{loading?'Analysing…':'Generate Brief'}</button>
              </div>
              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,.07)' }} />
                <span style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:M }}>or upload a document</span>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,.07)' }} />
              </div>
              {/* Upload area */}
              <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, padding:'28px 20px', border:'1px dashed rgba(201,168,76,.25)', cursor:'pointer', transition:'border-color .2s, background .2s' }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(201,168,76,.5)')}
                onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(201,168,76,.25)')}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:'none' }} onChange={e=>{
                  const f=e.target.files?.[0]
                  if(f) setProject(`[Document: ${f.name}]`)
                }} />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,.6)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:12, color:C, marginBottom:4 }}>Drop your sales offer or brochure here</div>
                  <div style={{ fontSize:11, color:M }}>PDF, JPG or PNG</div>
                </div>
              </label>
              {project.startsWith('[Document:') && (
                <div style={{ marginTop:14, padding:'10px 16px', background:'rgba(20,184,166,.08)', border:`1px solid rgba(20,184,166,.2)`, display:'flex', alignItems:'center', gap:10, justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:T }}>{project}</span>
                  <button onClick={()=>setProject('')} style={{ background:'none', border:'none', color:M, cursor:'pointer', fontSize:16, lineHeight:1 }}>×</button>
                </div>
              )}
            </div>


            {/* WHAT'S IN YOUR BRIEF — below search */}
            <div style={{ marginTop:56, paddingTop:48, borderTop:gb }}>
              <div style={{ fontSize:10, letterSpacing:'.25em', textTransform:'uppercase', color:M, marginBottom:20 }}>What you receive</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,4vw,54px)', fontWeight:300, lineHeight:1.08, marginBottom:36 }}>
                What's Inside<br/><em style={{color:G}}>Your Brief</em>
              </h2>
              <div className="bc-g" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {BRIEF_CONTENTS.map((b,i)=>(
                  <div key={i} className="bc-card">
                    <div style={{ flexShrink:0, width:32, height:32, border:`1px solid rgba(201,168,76,.2)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ color:G, fontSize:13 }}>{b.glyph}</span>
                    </div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:500, marginBottom:4, letterSpacing:'.02em' }}>{b.label}</div>
                      <div style={{ fontSize:11, color:M, lineHeight:1.65 }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div ref={briefRef} style={{ padding:'56px 0', textAlign:'center' }}>
              <div style={{ position:'relative', width:56, height:56, margin:'0 auto 24px' }}>
                <div style={{ position:'absolute', inset:0, border:'1.5px solid rgba(255,255,255,.07)', borderTopColor:G, borderRadius:'50%', animation:'spin .7s linear infinite' }} />
                <div style={{ position:'absolute', inset:10, border:'1px solid rgba(201,168,76,.2)', borderBottomColor:T, borderRadius:'50%', animation:'spin 1.2s linear infinite reverse' }} />
              </div>
              <div style={{ fontSize:12, color:M, letterSpacing:'.12em', marginBottom:20 }}>Analysing project…</div>
              {LOAD_STEPS.slice(0,stepIdx+1).map((s,i)=>(
                <div key={i} style={{ fontSize:11, color:i===stepIdx?G:M, margin:'4px 0', display:'flex', alignItems:'center', gap:8, justifyContent:'center', transition:'color .3s' }}>
                  <span>{i<stepIdx?'✓':i===stepIdx?'›':'○'}</span>{s}
                </div>
              ))}
            </div>
          )}

          {/* BRIEF RESULTS */}
          {brief && !loading && (
            <div ref={briefRef} style={{ animation:'fadeIn .5s ease', borderTop:gb, paddingTop:44 }}>
              <div className="bh-r" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', paddingBottom:22, borderBottom:gb, marginBottom:28, flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', color:T, marginBottom:6 }}>Investment Brief</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:300 }}>{brief.project}</div>
                  <div style={{ fontSize:13, color:M, marginTop:4 }}>{brief.location}</div>
                </div>
                <div style={{ padding:'7px 18px', fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', fontWeight:600, background:`${vc[brief.verdict]}15`, color:vc[brief.verdict], border:`1px solid ${vc[brief.verdict]}` }}>{brief.verdict}</div>
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
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:300, color:s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {gated ? (
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
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, textAlign:'center' }}>Your full brief is ready.</div>
                    <div style={{ fontSize:13, color:M, textAlign:'center', maxWidth:420, lineHeight:1.7 }}>Enter your WhatsApp to receive the analyst verdict, key risks, and a personalised note from Nawaz.</div>
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
              ) : (
                <div style={{ animation:'fadeIn .5s ease' }}>
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
      <section id="about" className="sec" style={{ padding:'100px 48px', background:N2, borderBottom:gb }}>
        <div className="about-g" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', maxWidth:1100, margin:'0 auto' }}>
          {/* PHOTO PLACEHOLDER — replace with real <img> tag once you have a professional headshot */}
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', top:-18, left:-18, right:18, bottom:18, border:'1px solid rgba(201,168,76,.15)' }} />
            <div style={{ width:'100%', aspectRatio:'3/4', background:`linear-gradient(135deg,${N},rgba(20,184,166,.05))`, border:gb, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:80, fontWeight:300, color:'rgba(201,168,76,.12)' }}>N.</span>
              <span style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(138,127,110,.4)' }}>Photo coming soon</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', color:T, marginBottom:14 }}>About</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,4vw,56px)', fontWeight:300, lineHeight:1.06, marginBottom:22 }}>More Analyst.<br/><em style={{color:G}}>Less Agent.</em></h2>
            <p style={{ fontSize:13, color:M, lineHeight:1.9, marginBottom:14 }}>I'm Nawaz — an independent property advisor specialising in off-plan investments and secondary market transactions for serious investors looking at Dubai.</p>
            <p style={{ fontSize:13, color:M, lineHeight:1.9, marginBottom:14 }}>B.Com Honours from SRCC Delhi. Indian Army background. I bring discipline, rigor, and an analyst-first lens to every client engagement — IRR models, yield scenarios, and institutional-grade briefs included.</p>
            <p style={{ fontSize:13, color:M, lineHeight:1.9, marginBottom:32 }}>My clients don't get a brochure. They get a private investment brief.</p>
            <div className="pillar-g" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {PILLARS.map((c,i)=>(
                <div key={i} className="pillar">
                  <h4 style={{ fontSize:12, fontWeight:500, marginBottom:5, letterSpacing:'.04em' }}>{c.h}</h4>
                  <p style={{ fontSize:11, color:M, lineHeight:1.65 }}>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY DUBAI */}
      <section id="why" className="sec" style={{ padding:'100px 48px', borderBottom:gb }}>
        <p style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', color:T, marginBottom:14 }}>The Investment Case</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,5vw,62px)', fontWeight:300, lineHeight:1.06, marginBottom:56 }}>Why Smart Capital<br/><em style={{color:G}}>Moves to Dubai</em></h2>
        <div className="why-g" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'rgba(255,255,255,.06)' }}>
          {WHY.map((w,i)=>(
            <div key={i} className="why-card">
              <div style={{ fontSize:22, marginBottom:16 }}>{w.icon}</div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:21, fontWeight:400, marginBottom:10 }}>{w.title}</h3>
              <p style={{ fontSize:12, color:M, lineHeight:1.8 }}>{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'40px 48px', borderTop:gb, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, border:`1px solid ${G}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:G, fontSize:12, fontWeight:600 }}>N</span>
          </div>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18 }}>Nawaz<span style={{color:G}}>.</span></span>
        </div>
        <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
          {/* NOTE: Verify youtube.com/@nawaz is your active channel before keeping this link */}
          {[['LinkedIn','https://www.linkedin.com/in/syed-nawaz-573aa9131/'],['Instagram','https://instagram.com/nawazsellsdubai'],['YouTube','https://youtube.com/@nawazsellsdubai'],['WhatsApp','https://wa.me/971563281781']].map(([l,h])=>(
            <a key={l} href={h} target="_blank" className="nav-link">{l}</a>
          ))}
        </div>
        <span style={{ fontSize:11, color:M }}>© 2026 nawazsellsdubai.com</span>
      </footer>
    </main>
  )
}
