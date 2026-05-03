'use client'
import { useState, useEffect, useRef } from 'react'

const STATS = [
  { value: '200+', label: 'Nationalities Investing' },
  { value: '0%', label: 'Income Tax' },
  { value: '7%+', label: 'Average Gross Yield' },
  { value: '#1', label: 'Safest City Globally' },
]

const WHY = [
  { icon: '🏛', title: 'Zero Income Tax', body: 'No capital gains tax. No inheritance tax. No income tax. Every dirham of yield stays with you.' },
  { icon: '📈', title: '7%+ Gross Yields', body: 'Dubai consistently outperforms London, Singapore, and Mumbai across most residential asset classes.' },
  { icon: '🌍', title: 'Gateway City', body: '8 hours from 80% of the world\'s population. Capital flows equally from East and West.' },
  { icon: '🏠', title: 'Golden Visa', body: 'A AED 2M+ investment unlocks a 10-year UAE residency visa for you and your family.' },
  { icon: '🔒', title: 'Regulated Market', body: 'Escrow-protected payments. Government-backed developer oversight. Strong investor protections.' },
  { icon: '💎', title: 'Capital Appreciation', body: 'Prime Dubai communities appreciated 20–40% through 2022–2024. Structural demand continues.' },
]

type Brief = {
  project: string; developer: string; developer_score: number; developer_note: string
  location: string; overview: string; price_sqft: string; gross_yield: string; net_yield: string
  bear: string; base: string; bull: string; payment_plan: string; handover: string
  golden_visa: boolean; verdict: 'BUY' | 'WATCH' | 'AVOID'; verdict_note: string; key_risk: string
}

const STEPS = ['Searching project database…','Evaluating developer track record…','Computing yield model…','Running 3-year scenarios…','Preparing your brief…']

export default function Home() {
  const [project, setProject] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [gated, setGated] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const briefRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!loading) return
    setStepIdx(0)
    const iv = setInterval(() => setStepIdx(i => Math.min(i + 1, STEPS.length - 1)), 750)
    return () => clearInterval(iv)
  }, [loading])

  async function generate() {
    if (!project.trim()) return
    setLoading(true); setBrief(null); setGated(true)
    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      })
      const data = await res.json()
      setBrief(data)
      setTimeout(() => briefRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } catch (e) {
      alert('Could not generate brief. Please try again.')
    }
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
  const verdictColor = { BUY: '#14B8A6', WATCH: '#C9A84C', AVOID: '#EF4444' }

  return (
    <main style={{ background: '#060D1B', color: '#F0EAD6', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #C9A84C; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .gold { color: #C9A84C; } .teal { color: #14B8A6; } .muted { color: #8A7F6E; }
        .gb { border: 1px solid rgba(255,255,255,.07); }
        .glass { background: rgba(255,255,255,.04); }
        input { outline: none; }
        input::placeholder { color: #8A7F6E; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fu { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        .anim { animation: fu .7s ease forwards; }
        .spin { animation: spin .7s linear infinite; }
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding: scrolled ? '14px 48px' : '22px 48px', background:'rgba(6,13,27,.85)', backdropFilter:'blur(18px)', borderBottom:'1px solid rgba(255,255,255,.06)', transition:'padding .3s' }}>
        <span className="serif gold" style={{ fontSize:20, letterSpacing:'.06em' }}>Nawaz<span style={{color:'#C9A84C'}}>.</span></span>
        <div style={{ display:'flex', gap:32 }}>
          {['Get a Brief','About','Why Dubai'].map((l,i) => (
            <a key={i} href={['#ai','#about','#why'][i]} style={{ color:'#8A7F6E', fontSize:12, letterSpacing:'.1em', textTransform:'uppercase', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
        <a href="https://wa.me/971563281781" target="_blank" style={{ padding:'9px 22px', border:'1px solid #C9A84C', color:'#C9A84C', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', textDecoration:'none' }}>Book a Call</a>
      </nav>

      {/* HERO */}
      <section style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url('/skyline.jpg')`, backgroundSize:'cover', backgroundPosition:'center' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(6,13,27,.4) 0%,rgba(6,13,27,.25) 45%,rgba(6,13,27,.92) 100%)' }} />
        <div style={{ position:'relative', zIndex:2, maxWidth:860, padding:'0 24px' }}>
          <p className="anim gold" style={{ fontSize:11, letterSpacing:'.32em', textTransform:'uppercase', marginBottom:22 }}>Off-Plan Specialist &nbsp;·&nbsp; Dubai</p>
          <h1 className="serif anim" style={{ fontSize:'clamp(48px,8vw,96px)', fontWeight:300, lineHeight:1.04, marginBottom:26 }}>
            Your Private<br /><em className="gold">Investment Analyst</em><br />in Dubai
          </h1>
          <p className="anim muted" style={{ fontSize:15, maxWidth:520, margin:'0 auto 44px', fontWeight:300 }}>
            Not a salesperson. A data-driven advisor for investors seeking yield, capital growth, and tax-free wealth in Dubai.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#ai" style={{ padding:'15px 38px', background:'#C9A84C', color:'#060D1B', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', fontWeight:600, textDecoration:'none' }}>Get a Free Investment Brief</a>
            <a href="#about" style={{ padding:'15px 38px', border:'1px solid rgba(240,234,214,.3)', color:'#F0EAD6', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', textDecoration:'none' }}>About Nawaz</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:'#0C1628', borderTop:'1px solid rgba(255,255,255,.07)', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
        {STATS.map((s,i) => (
          <div key={i} style={{ padding:'44px 32px', textAlign:'center', borderRight: i<3 ? '1px solid rgba(255,255,255,.07)' : 'none' }}>
            <div className="serif gold" style={{ fontSize:52, fontWeight:300, lineHeight:1, marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:11, letterSpacing:'.15em', textTransform:'uppercase', color:'#8A7F6E' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI SECTION */}
      <section id="ai" style={{ padding:'100px 48px' }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <p className="teal" style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', marginBottom:14 }}>Analyst Intelligence</p>
          <h2 className="serif" style={{ fontSize:'clamp(34px,5vw,62px)', fontWeight:300, lineHeight:1.08, marginBottom:16 }}>
            Analyse Any Dubai Project<br /><em className="gold">the Way Institutions Do</em>
          </h2>
          <p className="muted" style={{ fontSize:14, maxWidth:560, margin:'0 auto' }}>
            Enter any off-plan project. Get the same depth of analysis institutional investors use — developer track record, yield projections, payment plan quality, and capital appreciation scenarios. Instantly.
          </p>
          <div style={{ display:'flex', marginTop:44, border:'1px solid rgba(255,255,255,.07)', overflow:'hidden' }}>
            <input value={project} onChange={e=>setProject(e.target.value)} onKeyDown={e=>e.key==='Enter'&&generate()}
              style={{ flex:1, padding:'18px 24px', background:'rgba(255,255,255,.04)', border:'none', color:'#F0EAD6', fontSize:14, fontFamily:'Inter,sans-serif' }}
              placeholder="e.g. Sobha Siniya Island, Ramada Residences, Binghatti Aurora…" />
            <button onClick={generate} disabled={loading}
              style={{ padding:'18px 32px', background:'#C9A84C', color:'#060D1B', border:'none', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', fontWeight:600, cursor: loading?'not-allowed':'pointer', opacity: loading?.7:1, fontFamily:'Inter,sans-serif', minWidth:160 }}>
              {loading ? 'Analysing…' : 'Generate Brief'}
            </button>
          </div>

          {loading && (
            <div style={{ padding:'56px 0', textAlign:'center' }}>
              <div className="spin" style={{ width:44, height:44, border:'1.5px solid rgba(255,255,255,.07)', borderTopColor:'#C9A84C', borderRadius:'50%', margin:'0 auto 18px' }} />
              <div style={{ fontSize:12, color:'#8A7F6E', letterSpacing:'.1em' }}>Analysing project…</div>
              <div style={{ marginTop:14 }}>
                {STEPS.slice(0, stepIdx+1).map((s,i) => (
                  <div key={i} style={{ fontSize:12, color:'#8A7F6E', margin:'3px 0' }}>{s}</div>
                ))}
              </div>
            </div>
          )}

          {brief && !loading && (
            <div ref={briefRef} style={{ textAlign:'left', marginTop:44 }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', paddingBottom:22, borderBottom:'1px solid rgba(255,255,255,.07)', marginBottom:28, flexWrap:'wrap', gap:12 }}>
                <div>
                  <div className="teal" style={{ fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', marginBottom:6 }}>Investment Brief</div>
                  <div className="serif" style={{ fontSize:34, fontWeight:300 }}>{brief.project}</div>
                  <div className="muted" style={{ fontSize:13, marginTop:4 }}>{brief.location}</div>
                </div>
                <div style={{ padding:'7px 18px', fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', fontWeight:600, background:`${verdictColor[brief.verdict]}18`, color:verdictColor[brief.verdict], border:`1px solid ${verdictColor[brief.verdict]}` }}>{brief.verdict}</div>
              </div>

              {/* Overview */}
              <p style={{ fontSize:13, color:'#8A7F6E', lineHeight:1.85, marginBottom:28, borderLeft:'2px solid #C9A84C', paddingLeft:18 }}>{brief.overview}</p>

              {/* Cards */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
                {[
                  { label:'Gross Yield (Est.)', val:brief.gross_yield, sub:'Net yield: '+brief.net_yield },
                  { label:'Price per sqft', val:brief.price_sqft, sub:'Handover: '+brief.handover },
                  { label:'Developer', val:brief.developer, sub: stars(brief.developer_score)+' '+brief.developer_note, small:true },
                  { label:'Payment Plan', val:brief.payment_plan, sub: brief.golden_visa?'✓ Golden Visa Eligible':'✗ Below Golden Visa threshold', subColor: brief.golden_visa?'#14B8A6':'#8A7F6E', small:true },
                ].map((c,i) => (
                  <div key={i} style={{ padding:22, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)' }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'#8A7F6E', marginBottom:6 }}>{c.label}</div>
                    <div className="serif gold" style={{ fontSize: c.small?18:26, fontWeight:400 }}>{c.val}</div>
                    <div style={{ fontSize:11, color: c.subColor||'#8A7F6E', marginTop:4 }}>{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Scenarios */}
              <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'#8A7F6E', marginBottom:14 }}>3-Year Capital Appreciation Scenarios</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:28 }}>
                {[{l:'Bear Case',v:brief.bear,c:'#EF4444'},{l:'Base Case',v:brief.base,c:'#C9A84C'},{l:'Bull Case',v:brief.bull,c:'#14B8A6'}].map((s,i)=>(
                  <div key={i} style={{ padding:20, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', textAlign:'center' }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'#8A7F6E', marginBottom:6 }}>{s.l}</div>
                    <div className="serif" style={{ fontSize:30, fontWeight:300, color:s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Gate */}
              {gated ? (
                <div style={{ position:'relative' }}>
                  <div style={{ filter:'blur(7px)', opacity:.45, pointerEvents:'none', userSelect:'none' }}>
                    <div style={{ padding:22, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', marginBottom:14 }}>
                      <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'#8A7F6E' }}>Analyst Verdict</div>
                      <div style={{ height:14, background:'rgba(255,255,255,.07)', width:'80%', margin:'8px 0', borderRadius:2 }} />
                      <div style={{ height:14, background:'rgba(255,255,255,.07)', width:'55%', borderRadius:2 }} />
                    </div>
                    <div style={{ padding:22, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)' }}>
                      <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'#8A7F6E' }}>Key Risk</div>
                      <div style={{ height:14, background:'rgba(255,255,255,.07)', width:'70%', margin:'8px 0', borderRadius:2 }} />
                    </div>
                  </div>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(180deg,transparent,#060D1B 44%)', gap:14, padding:32 }}>
                    <div className="serif" style={{ fontSize:26, textAlign:'center' }}>Your full brief is ready.</div>
                    <div className="muted" style={{ fontSize:13, textAlign:'center', maxWidth:420 }}>Enter your WhatsApp to receive the complete analysis — analyst verdict, key risks, and a personalised note from Nawaz.</div>
                    <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', width:'100%', maxWidth:480 }}>
                      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
                        style={{ flex:1, minWidth:150, padding:'12px 18px', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', color:'#F0EAD6', fontSize:13, fontFamily:'Inter,sans-serif' }} />
                      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="WhatsApp (+91 or +971…)"
                        style={{ flex:1, minWidth:150, padding:'12px 18px', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', color:'#F0EAD6', fontSize:13, fontFamily:'Inter,sans-serif' }} />
                      <button onClick={submitLead} style={{ padding:'12px 22px', background:'#25D366', color:'#fff', border:'none', fontSize:11, letterSpacing:'.08em', textTransform:'uppercase', fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', gap:7 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Send to WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ padding:22, background:'rgba(255,255,255,.04)', border:`1px solid ${verdictColor[brief.verdict]}`, borderLeft:`3px solid ${verdictColor[brief.verdict]}`, marginBottom:14 }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'#8A7F6E', marginBottom:8 }}>Analyst Verdict — {brief.verdict}</div>
                    <div style={{ fontSize:13, lineHeight:1.8 }}>{brief.verdict_note}</div>
                  </div>
                  <div style={{ padding:22, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', marginBottom:20 }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'#8A7F6E', marginBottom:8 }}>Key Risk</div>
                    <div style={{ fontSize:13, color:'#8A7F6E', lineHeight:1.8 }}>{brief.key_risk}</div>
                  </div>
                  <div style={{ padding:24, background:'rgba(20,184,166,.06)', border:'1px solid #14B8A6', textAlign:'center' }}>
                    <div style={{ fontSize:13, color:'#14B8A6', marginBottom:14 }}>Want a personalised analysis with your budget, timeline and goals?</div>
                    <a href="https://wa.me/971563281781" target="_blank" style={{ display:'inline-block', padding:'15px 38px', background:'#C9A84C', color:'#060D1B', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', fontWeight:600, textDecoration:'none' }}>Book a Private Briefing with Nawaz</a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding:'100px 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', top:-18, left:-18, right:18, bottom:18, border:'1px solid rgba(201,168,76,.25)' }} />
          <div style={{ width:'100%', aspectRatio:'3/4', background:'#0C1628', border:'1px solid rgba(255,255,255,.07)' }} />
        </div>
        <div>
          <p className="teal" style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', marginBottom:14 }}>About</p>
          <h2 className="serif" style={{ fontSize:'clamp(34px,4vw,56px)', fontWeight:300, lineHeight:1.08, marginBottom:20 }}>More Analyst.<br /><em className="gold">Less Agent.</em></h2>
          <p className="muted" style={{ fontSize:13, lineHeight:1.9, marginBottom:14 }}>I'm Nawaz — an independent property advisor specialising in off-plan investments and secondary market transactions for serious investors looking at Dubai.</p>
          <p className="muted" style={{ fontSize:13, lineHeight:1.9, marginBottom:14 }}>B.Com Honours from SRCC Delhi. Indian Army background. I bring discipline, rigor, and an analyst-first lens to every client engagement — IRR models, yield scenarios, and institutional-grade briefs included.</p>
          <p className="muted" style={{ fontSize:13, lineHeight:1.9, marginBottom:30 }}>My clients don't get a brochure. They get a private investment brief.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { h:'Data-Driven', p:'IRR models and yield projections, not marketing decks.' },
              { h:'Investor-First', p:'Your ROI is the brief. Always.' },
              { h:'Off-Plan Specialist', p:'Deep expertise in Dubai\'s off-plan and secondary markets.' },
              { h:'Global Investors', p:'Serving investors from across the world looking at Dubai.' },
            ].map((c,i) => (
              <div key={i} style={{ padding:18, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderLeft:'2px solid #C9A84C' }}>
                <h4 style={{ fontSize:12, fontWeight:500, marginBottom:5, letterSpacing:'.04em' }}>{c.h}</h4>
                <p style={{ fontSize:11, color:'#8A7F6E', lineHeight:1.6 }}>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DUBAI */}
      <section id="why" style={{ padding:'100px 48px', background:'#0C1628' }}>
        <p className="teal" style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', marginBottom:14 }}>The Investment Case</p>
        <h2 className="serif" style={{ fontSize:'clamp(34px,5vw,62px)', fontWeight:300, lineHeight:1.08, marginBottom:52 }}>Why Smart Capital<br /><em className="gold">Moves to Dubai</em></h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'rgba(255,255,255,.07)' }}>
          {WHY.map((w,i) => (
            <div key={i} style={{ padding:36, background:'#0C1628' }}>
              <div style={{ fontSize:22, marginBottom:16 }}>{w.icon}</div>
              <h3 className="serif" style={{ fontSize:20, fontWeight:400, marginBottom:10 }}>{w.title}</h3>
              <p style={{ fontSize:12, color:'#8A7F6E', lineHeight:1.75 }}>{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'48px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
        <span className="serif" style={{ fontSize:18 }}>Nawaz<span className="gold">.</span></span>
        <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
          {[['LinkedIn','https://www.linkedin.com/in/syed-nawaz-573aa9131/'],['Instagram','https://instagram.com/nawazsellsdubai'],['YouTube','https://youtube.com/@nawaz'],['WhatsApp','https://wa.me/971563281781']].map(([l,h])=>(
            <a key={l} href={h} target="_blank" style={{ color:'#8A7F6E', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize:11, color:'#8A7F6E' }}>© 2026 nawazsellsdubai.com</span>
      </footer>
    </main>
  )
}
