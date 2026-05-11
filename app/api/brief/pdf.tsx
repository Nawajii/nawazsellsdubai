import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { LandmarkDistance } from './maps'

// ── Colours ──────────────────────────────────────────────────────────────
const NAVY   = '#060D1B'
const NAVY2  = '#0C1628'
const GOLD   = '#C9A84C'
const TEAL   = '#14B8A6'
const WHITE  = '#FFFFFF'
const CREAM  = '#FAF8F4'
const MUTED  = '#6B6052'
const BODY   = '#1A1A1A'
const BORDER = '#E5E0D8'
const RED    = '#C0392B'

// ── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Pages
  coverPage:   { backgroundColor: NAVY, fontFamily: 'Helvetica' },
  bodyPage:    { backgroundColor: WHITE, fontFamily: 'Helvetica', fontSize: 10 },

  // Cover
  coverTop:    { backgroundColor: NAVY, padding: '80 56 0 56', flex: 1 },
  coverLine:   { width: 48, height: 2, backgroundColor: GOLD, marginBottom: 32 },
  coverTag:    { fontSize: 8, letterSpacing: 3, color: GOLD, marginBottom: 16, textTransform: 'uppercase' },
  coverTitle:  { fontSize: 32, color: WHITE, fontFamily: 'Helvetica-Bold', lineHeight: 1.2, marginBottom: 8 },
  coverSub:    { fontSize: 13, color: '#8A7F6E', marginBottom: 48 },
  coverMeta:   { borderTop: `1 solid rgba(201,168,76,.3)`, paddingTop: 24, marginTop: 'auto' },
  coverMetaRow:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  coverMetaLabel:{ fontSize: 7, letterSpacing: 2, color: '#8A7F6E', textTransform: 'uppercase' },
  coverMetaVal:{ fontSize: 9, color: WHITE },
  coverBottom: { backgroundColor: '#030B14', padding: '16 56', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coverBrand:  { fontSize: 11, color: GOLD, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  coverSite:   { fontSize: 8, color: '#555' },

  // Section header bar
  sectionBar:  { backgroundColor: NAVY, padding: '10 24', marginBottom: 20 },
  sectionNum:  { fontSize: 7, letterSpacing: 3, color: GOLD, marginBottom: 4 },
  sectionTitle:{ fontSize: 16, color: WHITE, fontFamily: 'Helvetica-Bold' },

  // Body layout
  body:        { padding: '24 40' },
  col2:        { flexDirection: 'row', gap: 16 },
  col:         { flex: 1 },

  // Cards
  card:        { backgroundColor: CREAM, border: `1 solid ${BORDER}`, padding: '14 16', marginBottom: 10 },
  cardGold:    { backgroundColor: CREAM, borderLeft: `3 solid ${GOLD}`, padding: '14 16', marginBottom: 10 },
  cardTeal:    { backgroundColor: '#F0FAFA', borderLeft: `3 solid ${TEAL}`, padding: '14 16', marginBottom: 10 },
  cardRed:     { backgroundColor: '#FDF5F5', borderLeft: `3 solid ${RED}`, padding: '14 16', marginBottom: 10 },
  cardLabel:   { fontSize: 7, letterSpacing: 2, color: MUTED, textTransform: 'uppercase', marginBottom: 5 },
  cardVal:     { fontSize: 16, color: GOLD, fontFamily: 'Helvetica-Bold' },
  cardValSm:   { fontSize: 12, color: GOLD, fontFamily: 'Helvetica-Bold' },
  cardSub:     { fontSize: 8, color: MUTED, marginTop: 3 },

  // Text styles
  h3:          { fontSize: 11, fontFamily: 'Helvetica-Bold', color: BODY, marginBottom: 6, marginTop: 14 },
  body1:       { fontSize: 9.5, color: BODY, lineHeight: 1.65 },
  bodyMuted:   { fontSize: 9.5, color: MUTED, lineHeight: 1.65 },
  bullet:      { fontSize: 9.5, color: BODY, lineHeight: 1.65, marginBottom: 3, paddingLeft: 8 },
  label:       { fontSize: 7, letterSpacing: 1.5, color: MUTED, textTransform: 'uppercase', marginBottom: 4 },

  // Landmark table
  tableRow:    { flexDirection: 'row', borderBottom: `1 solid ${BORDER}`, paddingVertical: 7 },
  tableRowAlt: { flexDirection: 'row', borderBottom: `1 solid ${BORDER}`, paddingVertical: 7, backgroundColor: CREAM },
  tableHead:   { flexDirection: 'row', borderBottom: `2 solid ${NAVY}`, paddingBottom: 6, marginBottom: 4 },
  tableCell:   { flex: 1, fontSize: 9, color: BODY },
  tableCellH:  { flex: 1, fontSize: 7, letterSpacing: 1.5, color: NAVY, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold' },
  tableRight:  { width: 80, fontSize: 9, color: BODY, textAlign: 'right' },
  tableRightH: { width: 80, fontSize: 7, letterSpacing: 1.5, color: NAVY, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', textAlign: 'right' },

  // Scenarios
  scenRow:     { flexDirection: 'row', gap: 10, marginBottom: 14 },
  scenCard:    { flex: 1, backgroundColor: CREAM, border: `1 solid ${BORDER}`, padding: '14 12', alignItems: 'center' },
  scenLabel:   { fontSize: 7, letterSpacing: 1.5, color: MUTED, textTransform: 'uppercase', marginBottom: 6 },
  scenBear:    { fontSize: 22, color: RED,  fontFamily: 'Helvetica-Bold' },
  scenBase:    { fontSize: 22, color: GOLD, fontFamily: 'Helvetica-Bold' },
  scenBull:    { fontSize: 22, color: TEAL, fontFamily: 'Helvetica-Bold' },

  // Risk level badge
  riskLow:     { fontSize: 8, color: TEAL, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  riskMod:     { fontSize: 8, color: GOLD, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  riskHigh:    { fontSize: 8, color: RED,  fontFamily: 'Helvetica-Bold', letterSpacing: 1 },

  // Page header strip
  pageStrip:   { backgroundColor: NAVY2, padding: '6 40', flexDirection: 'row', justifyContent: 'space-between' },
  stripText:   { fontSize: 7, color: '#8A7F6E', letterSpacing: 1 },

  // Disclaimer
  discPage:    { backgroundColor: NAVY, fontFamily: 'Helvetica', padding: '56 56' },
  discTitle:   { fontSize: 14, color: GOLD, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 20 },
  discBody:    { fontSize: 9, color: '#8A7F6E', lineHeight: 1.8, marginBottom: 12 },
  discLine:    { width: '100%', height: 1, backgroundColor: 'rgba(201,168,76,.2)', marginVertical: 20 },
})

// ── Helpers ───────────────────────────────────────────────────────────────
type Brief   = Record<string, any>
type Answers = { budget: string; goal: string; timeline: string }

const riskStyle = (level: string) => {
  if (!level) return s.riskMod
  const l = level.toLowerCase()
  if (l.includes('low'))      return s.riskLow
  if (l.includes('elevated')) return s.riskHigh
  return s.riskMod
}

const PageStrip = ({ reportNo, section }: { reportNo: string; section: string }) => (
  <View style={s.pageStrip}>
    <Text style={s.stripText}>NAWAZSELLSDUBAI.COM  ·  CONFIDENTIAL</Text>
    <Text style={s.stripText}>{section.toUpperCase()}</Text>
    <Text style={s.stripText}>{reportNo}</Text>
  </View>
)

const SectionBar = ({ num, title }: { num: string; title: string }) => (
  <View style={s.sectionBar}>
    <Text style={s.sectionNum}>{num}</Text>
    <Text style={s.sectionTitle}>{title}</Text>
  </View>
)

const BulletList = ({ items }: { items: string[] }) => (
  <View>
    {(items || []).map((item, i) => (
      <Text key={i} style={s.bullet}>· {item}</Text>
    ))}
  </View>
)

// ── Main Component ────────────────────────────────────────────────────────
export function BriefPDF({
  brief,
  answers,
  clientName,
  reportNo,
  landmarks,
}: {
  brief:      Brief
  answers:    Answers
  clientName: string
  reportNo:   string
  landmarks:  LandmarkDistance[]
}) {
  const loc  = brief.location        || {}
  const dev  = brief.developer       || {}
  const proj = brief.project         || {}
  const yld  = brief.yield_analysis  || {}
  const cap  = brief.capital_appreciation || {}
  const risk = brief.risk_assessment  || {}
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document title={`Investment Report — ${brief.project_name} — ${reportNo}`} author="Nawaz Sells Dubai">

      {/* ══════════════════════════════════════════ */}
      {/* PAGE 1 — COVER                            */}
      {/* ══════════════════════════════════════════ */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverTop}>
          <View style={s.coverLine} />
          <Text style={s.coverTag}>Institutional Investment Report</Text>
          <Text style={s.coverTitle}>{brief.project_name || 'Project Analysis'}</Text>
          <Text style={s.coverSub}>{loc.community}{loc.district ? ` · ${loc.district}` : ''} · Dubai</Text>

          <View style={{ marginBottom: 32 }}>
            {[
              ['Prepared For',  clientName],
              ['Report Number', reportNo],
              ['Date',          date],
              ['Prepared By',   'Nawaz Sells Dubai — Private Investment Advisory'],
            ].map(([label, val]) => (
              <View key={label} style={s.coverMetaRow}>
                <Text style={s.coverMetaLabel}>{label}</Text>
                <Text style={s.coverMetaVal}>{val}</Text>
              </View>
            ))}
          </View>

          {answers.budget && (
            <View style={{ backgroundColor: 'rgba(201,168,76,.08)', border: '1 solid rgba(201,168,76,.2)', padding: '12 16', marginBottom: 24 }}>
              <Text style={{ fontSize: 7, letterSpacing: 2, color: GOLD, marginBottom: 8 }}>INVESTOR PROFILE</Text>
              <View style={{ flexDirection: 'row', gap: 24 }}>
                {answers.budget   && <Text style={{ fontSize: 9, color: '#8A7F6E' }}>Budget: {answers.budget}</Text>}
                {answers.goal     && <Text style={{ fontSize: 9, color: '#8A7F6E' }}>Objective: {answers.goal}</Text>}
                {answers.timeline && <Text style={{ fontSize: 9, color: '#8A7F6E' }}>Timeline: {answers.timeline}</Text>}
              </View>
            </View>
          )}
        </View>

        <View style={s.coverBottom}>
          <Text style={s.coverBrand}>NAWAZ SELLS DUBAI</Text>
          <Text style={s.coverSite}>nawazsellsdubai.com  ·  Private Investment Advisory</Text>
        </View>
      </Page>

      {/* ══════════════════════════════════════════ */}
      {/* PAGE 2 — EXECUTIVE SUMMARY               */}
      {/* ══════════════════════════════════════════ */}
      <Page size="A4" style={s.bodyPage}>
        <PageStrip reportNo={reportNo} section="Executive Summary" />
        <SectionBar num="OVERVIEW" title="Executive Summary" />
        <View style={s.body}>

          <View style={s.cardGold}>
            <Text style={s.cardLabel}>Project at a Glance</Text>
            <Text style={s.body1}>{proj.usp || loc.overview}</Text>
          </View>

          <View style={s.col2}>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Price Range</Text>
                <Text style={s.cardVal}>{proj.price_range || proj.price_per_sqft || 'N/A'}</Text>
                <Text style={s.cardSub}>AED per sqft: {proj.price_per_sqft || 'N/A'}</Text>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Gross Yield (Est.)</Text>
                <Text style={s.cardVal}>{yld.gross_yield_range || 'N/A'}</Text>
                <Text style={s.cardSub}>Area avg: {yld.area_avg_yield || 'N/A'}</Text>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Handover</Text>
                <Text style={s.cardValSm}>{proj.handover || 'N/A'}</Text>
                <Text style={s.cardSub}>Type: {proj.type || 'N/A'}</Text>
              </View>
            </View>
          </View>

          <View style={s.col2}>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>3-Year Appreciation (Base)</Text>
                <Text style={s.cardVal}>{cap.base_case || 'N/A'}</Text>
                <Text style={s.cardSub}>Historical growth since 2020: {cap.growth_pct || 'N/A'}</Text>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Risk Level</Text>
                <Text style={riskStyle(risk.overall_risk_level)}>{risk.overall_risk_level || 'N/A'}</Text>
                <Text style={s.cardSub}>See Section 6 for full assessment</Text>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Developer</Text>
                <Text style={s.cardValSm}>{dev.name || brief.developer_name || 'N/A'}</Text>
                <Text style={s.cardSub}>{dev.projects_delivered?.length || 0} projects delivered</Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 8, backgroundColor: NAVY, padding: '12 16' }}>
            <Text style={{ fontSize: 7, letterSpacing: 2, color: GOLD, marginBottom: 6 }}>REPORT SCOPE</Text>
            <Text style={{ fontSize: 9, color: '#8A7F6E', lineHeight: 1.7 }}>
              This report covers six analytical dimensions: Location Analysis, Developer Assessment, Project Profile,
              Yield Analysis, Capital Appreciation, and Risk Assessment. All data is sourced from publicly available
              market information at the time of preparation. This report is prepared exclusively for {clientName}.
            </Text>
          </View>
        </View>
      </Page>

      {/* ══════════════════════════════════════════ */}
      {/* PAGE 3 — LOCATION                        */}
      {/* ══════════════════════════════════════════ */}
      <Page size="A4" style={s.bodyPage}>
        <PageStrip reportNo={reportNo} section="Section 1: Location Analysis" />
        <SectionBar num="SECTION 01" title="Location Analysis" />
        <View style={s.body}>

          <Text style={s.body1}>{loc.overview}</Text>

          {loc.pros?.length > 0 && (
            <>
              <Text style={s.h3}>Location Strengths</Text>
              <BulletList items={loc.pros} />
            </>
          )}

          {/* Landmark distances */}
          {landmarks.length > 0 && (
            <>
              <Text style={s.h3}>Connectivity — Key Distances by Car</Text>
              <View style={s.tableHead}>
                <Text style={{ ...s.tableCellH, flex: 2 }}>Landmark</Text>
                <Text style={s.tableRightH}>Travel Time</Text>
                <Text style={s.tableRightH}>Distance</Text>
              </View>
              {landmarks.map((lm, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={{ ...s.tableCell, flex: 2 }}>{lm.name}</Text>
                  <Text style={s.tableRight}>{lm.duration}</Text>
                  <Text style={s.tableRight}>{lm.distance}</Text>
                </View>
              ))}
            </>
          )}

          {/* Nearby facilities */}
          {loc.facilities && (
            <>
              <Text style={s.h3}>Nearby Facilities</Text>
              <View style={s.col2}>
                {loc.facilities.schools?.length > 0 && (
                  <View style={s.col}>
                    <Text style={s.label}>Schools</Text>
                    <BulletList items={loc.facilities.schools} />
                  </View>
                )}
                {loc.facilities.hospitals?.length > 0 && (
                  <View style={s.col}>
                    <Text style={s.label}>Medical</Text>
                    <BulletList items={loc.facilities.hospitals} />
                  </View>
                )}
              </View>
              <View style={s.col2}>
                {loc.facilities.malls?.length > 0 && (
                  <View style={s.col}>
                    <Text style={s.label}>Retail</Text>
                    <BulletList items={loc.facilities.malls} />
                  </View>
                )}
                {loc.facilities.transport?.length > 0 && (
                  <View style={s.col}>
                    <Text style={s.label}>Transport & Roads</Text>
                    <BulletList items={loc.facilities.transport} />
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </Page>

      {/* ══════════════════════════════════════════ */}
      {/* PAGE 4 — DEVELOPER + PROJECT             */}
      {/* ══════════════════════════════════════════ */}
      <Page size="A4" style={s.bodyPage}>
        <PageStrip reportNo={reportNo} section="Section 2–3: Developer & Project" />
        <SectionBar num="SECTION 02" title="Developer Assessment" />
        <View style={s.body}>

          <Text style={s.body1}>{dev.overview}</Text>

          <View style={s.col2}>
            <View style={s.col}>
              <Text style={s.h3}>Track Record</Text>
              <Text style={s.bodyMuted}>{dev.delivery_track_record}</Text>
            </View>
            <View style={s.col}>
              <Text style={s.h3}>Quality Assessment</Text>
              <Text style={s.bodyMuted}>{dev.quality_assessment}</Text>
            </View>
          </View>

          {dev.projects_delivered?.length > 0 && (
            <>
              <Text style={s.h3}>Projects Delivered</Text>
              <BulletList items={dev.projects_delivered} />
            </>
          )}

          <View style={s.col2}>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Resellability</Text>
                <Text style={{ fontSize: 9, color: BODY, lineHeight: 1.6 }}>{dev.resellability}</Text>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Market Absorption</Text>
                <Text style={{ fontSize: 9, color: BODY, lineHeight: 1.6 }}>{dev.absorption}</Text>
              </View>
            </View>
          </View>

          {dev.serious_redflag && (
            <View style={s.cardRed}>
              <Text style={{ fontSize: 7, letterSpacing: 2, color: RED, marginBottom: 6 }}>⚠ DEVELOPER FLAG</Text>
              <Text style={{ fontSize: 9, color: BODY, lineHeight: 1.65 }}>{dev.redflag_note}</Text>
            </View>
          )}
        </View>

        <SectionBar num="SECTION 03" title="Project Profile" />
        <View style={s.body}>
          <Text style={s.body1}>{proj.usp}</Text>

          <View style={s.col2}>
            {[
              ['Unit Types',    proj.units],
              ['Size Range',    proj.size_range],
              ['Price Range',   proj.price_range],
              ['Price / sqft',  proj.price_per_sqft],
              ['Handover',      proj.handover],
              ['Branding',      proj.branding || 'N/A'],
            ].map(([label, val]) => (
              <View key={label} style={{ ...s.col, marginBottom: 8 }}>
                <View style={s.card}>
                  <Text style={s.cardLabel}>{label}</Text>
                  <Text style={s.cardValSm}>{val || 'N/A'}</Text>
                </View>
              </View>
            ))}
          </View>

          {proj.amenities?.length > 0 && (
            <>
              <Text style={s.h3}>Key Amenities</Text>
              <BulletList items={proj.amenities} />
            </>
          )}

          {proj.lifestyle_positioning && (
            <View style={s.cardTeal}>
              <Text style={s.cardLabel}>Lifestyle Positioning</Text>
              <Text style={{ fontSize: 9, color: BODY, lineHeight: 1.65 }}>{proj.lifestyle_positioning}</Text>
            </View>
          )}
        </View>
      </Page>

      {/* ══════════════════════════════════════════ */}
      {/* PAGE 5 — YIELD + APPRECIATION            */}
      {/* ══════════════════════════════════════════ */}
      <Page size="A4" style={s.bodyPage}>
        <PageStrip reportNo={reportNo} section="Section 4–5: Yield & Appreciation" />
        <SectionBar num="SECTION 04" title="Yield Analysis" />
        <View style={s.body}>

          <View style={s.col2}>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Gross Yield Range</Text>
                <Text style={s.cardVal}>{yld.gross_yield_range || 'N/A'}</Text>
                <Text style={s.cardSub}>Area avg: {yld.area_avg_yield || 'N/A'}</Text>
              </View>
            </View>
            <View style={s.col}>
              <View style={s.card}>
                <Text style={s.cardLabel}>2024 Transactions</Text>
                <Text style={s.cardValSm}>{yld.area_transactions_2024 || 'N/A'}</Text>
              </View>
            </View>
          </View>

          <Text style={s.h3}>Rental Demand</Text>
          <Text style={s.body1}>{yld.rental_demand}</Text>

          <Text style={s.h3}>Supply Pipeline (24 months)</Text>
          <Text style={s.body1}>{yld.supply_pipeline}</Text>

          <Text style={s.h3}>Absorption Rate</Text>
          <Text style={s.body1}>{yld.absorption_rate}</Text>

          <View style={s.cardGold}>
            <Text style={s.cardLabel}>Yield Outlook</Text>
            <Text style={s.body1}>{yld.yield_outlook}</Text>
          </View>
        </View>

        <SectionBar num="SECTION 05" title="Capital Appreciation" />
        <View style={s.body}>

          <View style={s.col2}>
            {[
              ['Price in 2020', cap.price_2020],
              ['Current Price', cap.price_current],
              ['Growth Since 2020', cap.growth_pct],
            ].map(([label, val]) => (
              <View key={label} style={s.col}>
                <View style={s.card}>
                  <Text style={s.cardLabel}>{label}</Text>
                  <Text style={s.cardValSm}>{val || 'N/A'}</Text>
                </View>
              </View>
            ))}
          </View>

          {cap.key_growth_drivers?.length > 0 && (
            <>
              <Text style={s.h3}>Key Growth Drivers</Text>
              <BulletList items={cap.key_growth_drivers} />
            </>
          )}

          <Text style={s.h3}>3-Year Scenarios</Text>
          <View style={s.scenRow}>
            <View style={s.scenCard}>
              <Text style={s.scenLabel}>BEAR CASE</Text>
              <Text style={s.scenBear}>{cap.bear_case || 'N/A'}</Text>
            </View>
            <View style={s.scenCard}>
              <Text style={s.scenLabel}>BASE CASE</Text>
              <Text style={s.scenBase}>{cap.base_case || 'N/A'}</Text>
            </View>
            <View style={s.scenCard}>
              <Text style={s.scenLabel}>BULL CASE</Text>
              <Text style={s.scenBull}>{cap.bull_case || 'N/A'}</Text>
            </View>
          </View>

          <View style={s.cardTeal}>
            <Text style={s.cardLabel}>Appreciation Outlook</Text>
            <Text style={s.body1}>{cap.appreciation_commentary}</Text>
          </View>
        </View>
      </Page>

      {/* ══════════════════════════════════════════ */}
      {/* PAGE 6 — RISK ASSESSMENT                 */}
      {/* ══════════════════════════════════════════ */}
      <Page size="A4" style={s.bodyPage}>
        <PageStrip reportNo={reportNo} section="Section 6: Risk Assessment" />
        <SectionBar num="SECTION 06" title="Risk Assessment" />
        <View style={s.body}>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 9, color: MUTED }}>Overall Risk Level:</Text>
            <Text style={riskStyle(risk.overall_risk_level)}>{risk.overall_risk_level || 'N/A'}</Text>
          </View>

          <Text style={s.body1}>{risk.risk_commentary}</Text>

          {risk.location_risks?.length > 0 && (
            <>
              <Text style={s.h3}>Location Risks</Text>
              {risk.location_risks.map((r: string, i: number) => (
                <View key={i} style={{ ...s.card, marginBottom: 8 }}>
                  <Text style={{ fontSize: 9, color: BODY, lineHeight: 1.65 }}>{r}</Text>
                </View>
              ))}
            </>
          )}

          {risk.market_risks?.length > 0 && (
            <>
              <Text style={s.h3}>Market Risks</Text>
              <BulletList items={risk.market_risks} />
            </>
          )}

          <View style={{ backgroundColor: NAVY, padding: '14 16', marginTop: 16 }}>
            <Text style={{ fontSize: 7, letterSpacing: 2, color: GOLD, marginBottom: 6 }}>RISK METHODOLOGY NOTE</Text>
            <Text style={{ fontSize: 9, color: '#8A7F6E', lineHeight: 1.7 }}>
              Risk factors presented in this report are identified to inform investor decision-making, not to discourage investment.
              Each risk is accompanied by contextual commentary. Investors are advised to conduct independent due diligence
              and consult a licensed financial advisor before making any investment commitment.
            </Text>
          </View>
        </View>
      </Page>

      {/* ══════════════════════════════════════════ */}
      {/* PAGE 7 — DISCLAIMER                      */}
      {/* ══════════════════════════════════════════ */}
      <Page size="A4" style={s.discPage}>
        <View style={{ padding: '56 56' }}>
          <View style={{ width: 48, height: 2, backgroundColor: GOLD, marginBottom: 32 }} />
          <Text style={s.discTitle}>DISCLAIMER</Text>

          <Text style={s.discBody}>
            This investment report (Report No. {reportNo}) has been prepared by Nawaz Sells Dubai exclusively for {clientName}
            and is strictly confidential. It may not be reproduced, distributed, or shared without prior written consent.
          </Text>

          <View style={s.discLine} />

          <Text style={{ fontSize: 8, letterSpacing: 2, color: GOLD, marginBottom: 12 }}>NATURE OF THIS REPORT</Text>
          <Text style={s.discBody}>
            This report is a 360-degree investment analysis tool designed to assist investors in evaluating Dubai off-plan real estate opportunities.
            It is not a full financial advisory service. Nawaz Sells Dubai is not a licensed financial advisor, and this report does not constitute
            financial, investment, legal, or tax advice.
          </Text>

          <Text style={s.discBody}>
            All data, projections, yield estimates, capital appreciation scenarios, and risk assessments contained herein are based on
            publicly available market information at the time of preparation. They represent analytical estimates and are not guarantees
            of future performance. Past market performance is not indicative of future results.
          </Text>

          <Text style={s.discBody}>
            Nawaz Sells Dubai shall not be liable for any loss, damage, or financial outcome arising from reliance on this report,
            including but not limited to investment losses, loss of profit, or consequential damages beyond the capacity of this analysis.
          </Text>

          <View style={s.discLine} />

          <Text style={{ fontSize: 8, letterSpacing: 2, color: GOLD, marginBottom: 12 }}>INVESTOR RESPONSIBILITY</Text>
          <Text style={s.discBody}>
            Investors are strongly advised to treat this report as one tool among many in their decision-making process.
            Independent due diligence, consultation with licensed financial advisors, and direct engagement with developers
            and legal counsel are recommended before committing to any investment.
          </Text>

          <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 10, color: GOLD, fontFamily: 'Helvetica-Bold', letterSpacing: 1 }}>NAWAZ SELLS DUBAI</Text>
            <Text style={{ fontSize: 8, color: '#555' }}>nawazsellsdubai.com  ·  {date}</Text>
          </View>
        </View>
      </Page>

    </Document>
  )
}
