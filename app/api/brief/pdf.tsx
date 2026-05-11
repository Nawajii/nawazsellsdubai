import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const N = '#060D1B'
const G = '#C9A84C'
const T = '#14B8A6'
const W = '#FAFAF8'
const M = '#8A7F6E'
const D = '#2D2D2D'
const CARD = '#F2EFE9'
const BORDER = '#E0D9CC'

const s = StyleSheet.create({
  page:         { backgroundColor: W, fontFamily: 'Helvetica', fontSize: 10 },
  // Header
  header:       { backgroundColor: N, padding: '44 48 32 48' },
  headerTag:    { fontSize: 7, letterSpacing: 2, color: T, marginBottom: 10 },
  projectName:  { fontSize: 26, color: G, fontFamily: 'Helvetica-Bold', marginBottom: 4, letterSpacing: 0.5 },
  location:     { fontSize: 10, color: M, marginBottom: 16 },
  verdictRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verdictLabel: { fontSize: 7, letterSpacing: 2, color: M },
  verdictBUY:   { fontSize: 13, color: T,          fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  verdictWATCH: { fontSize: 13, color: G,          fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  verdictAVOID: { fontSize: 13, color: '#EF4444',  fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  // Investor strip
  strip:        { backgroundColor: '#0C1628', padding: '10 48', flexDirection: 'row', gap: 20 },
  stripItem:    { fontSize: 8, color: T },
  // Body
  body:         { padding: '28 48' },
  secLabel:     { fontSize: 7, letterSpacing: 2, color: M, textTransform: 'uppercase', marginTop: 22, marginBottom: 6 },
  overview:     { fontSize: 10, color: D, lineHeight: 1.7, borderLeft: `2 solid ${G}`, paddingLeft: 10 },
  // Cards
  row2:         { flexDirection: 'row', gap: 10, marginTop: 10 },
  card:         { flex: 1, backgroundColor: CARD, padding: '12 14', border: `1 solid ${BORDER}` },
  cardLabel:    { fontSize: 7, letterSpacing: 1.5, color: M, marginBottom: 4 },
  cardVal:      { fontSize: 17, color: G, fontFamily: 'Helvetica-Bold' },
  cardSub:      { fontSize: 8, color: M, marginTop: 3 },
  // Scenarios
  row3:         { flexDirection: 'row', gap: 8, marginTop: 10 },
  scen:         { flex: 1, backgroundColor: CARD, padding: '10 12', border: `1 solid ${BORDER}`, alignItems: 'center' },
  scenLabel:    { fontSize: 7, letterSpacing: 1.5, color: M, marginBottom: 4 },
  scenBear:     { fontSize: 18, color: '#EF4444', fontFamily: 'Helvetica-Bold' },
  scenBase:     { fontSize: 18, color: G,          fontFamily: 'Helvetica-Bold' },
  scenBull:     { fontSize: 18, color: T,          fontFamily: 'Helvetica-Bold' },
  // Verdict box
  verdictBox:   { backgroundColor: CARD, border: `1 solid ${BORDER}`, borderLeft: `3 solid ${G}`, padding: '12 14', marginTop: 10 },
  verdictBoxRed:{ backgroundColor: CARD, border: `1 solid ${BORDER}`, borderLeft: `3 solid #EF4444`, padding: '12 14', marginTop: 10 },
  verdictBoxTeal:{backgroundColor: CARD, border: `1 solid ${BORDER}`, borderLeft: `3 solid ${T}`,   padding: '12 14', marginTop: 10 },
  boxTitle:     { fontSize: 7, letterSpacing: 1.5, color: M, marginBottom: 5 },
  boxText:      { fontSize: 10, color: D, lineHeight: 1.65 },
  // Footer
  footer:       { backgroundColor: N, padding: '18 48', marginTop: 'auto' },
  footerRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerBrand:  { fontSize: 11, color: G, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  footerSite:   { fontSize: 8, color: M },
  disclaimer:   { fontSize: 7, color: '#555', lineHeight: 1.5, marginTop: 16, borderTop: `1 solid ${BORDER}`, paddingTop: 10 },
})

type Brief = {
  project: string; developer: string; developer_score: number; developer_note: string
  location: string; overview: string; price_sqft: string; gross_yield: string; net_yield: string
  bear: string; base: string; bull: string; payment_plan: string; handover: string
  golden_visa: boolean; verdict: 'BUY' | 'WATCH' | 'AVOID'; verdict_note: string; key_risk: string
}

type Answers = { budget: string; goal: string; timeline: string }

const stars = (n: number) => '★'.repeat(Math.min(n, 5)) + '☆'.repeat(Math.max(5 - n, 0))

const verdictStyle = (v: string) =>
  v === 'BUY' ? s.verdictBUY : v === 'AVOID' ? s.verdictAVOID : s.verdictWATCH

const verdictBoxStyle = (v: string) =>
  v === 'BUY' ? s.verdictBoxTeal : v === 'AVOID' ? s.verdictBoxRed : s.verdictBox

export function BriefPDF({ brief, answers, clientName }: { brief: Brief; answers: Answers; clientName: string }) {
  return (
    <Document title={`Investment Brief — ${brief.project}`} author="Nawaz Sells Dubai">
      <Page size="A4" style={s.page}>

        {/* HEADER */}
        <View style={s.header}>
          <Text style={s.headerTag}>INVESTMENT BRIEF  ·  NAWAZSELLSDUBAI.COM</Text>
          <Text style={s.projectName}>{brief.project}</Text>
          <Text style={s.location}>{brief.location}</Text>
          <View style={s.verdictRow}>
            <Text style={s.verdictLabel}>ANALYST VERDICT</Text>
            <Text style={verdictStyle(brief.verdict)}>{brief.verdict}</Text>
          </View>
        </View>

        {/* INVESTOR STRIP */}
        {(answers.budget || answers.goal || answers.timeline) && (
          <View style={s.strip}>
            {answers.budget   && <Text style={s.stripItem}>Budget: {answers.budget}</Text>}
            {answers.goal     && <Text style={s.stripItem}>Goal: {answers.goal}</Text>}
            {answers.timeline && <Text style={s.stripItem}>Timeline: {answers.timeline}</Text>}
          </View>
        )}

        <View style={s.body}>

          {/* OVERVIEW */}
          <Text style={s.secLabel}>Project Overview</Text>
          <Text style={s.overview}>{brief.overview}</Text>

          {/* KEY METRICS */}
          <Text style={s.secLabel}>Key Metrics</Text>
          <View style={s.row2}>
            <View style={s.card}>
              <Text style={s.cardLabel}>GROSS YIELD (EST.)</Text>
              <Text style={s.cardVal}>{brief.gross_yield}</Text>
              <Text style={s.cardSub}>Net yield: {brief.net_yield}</Text>
            </View>
            <View style={s.card}>
              <Text style={s.cardLabel}>PRICE PER SQFT</Text>
              <Text style={s.cardVal}>{brief.price_sqft}</Text>
              <Text style={s.cardSub}>Handover: {brief.handover}</Text>
            </View>
          </View>
          <View style={s.row2}>
            <View style={s.card}>
              <Text style={s.cardLabel}>DEVELOPER</Text>
              <Text style={{ ...s.cardVal, fontSize: 13 }}>{brief.developer}</Text>
              <Text style={s.cardSub}>{stars(brief.developer_score)}  {brief.developer_note}</Text>
            </View>
            <View style={s.card}>
              <Text style={s.cardLabel}>PAYMENT PLAN</Text>
              <Text style={{ ...s.cardVal, fontSize: 13 }}>{brief.payment_plan}</Text>
              <Text style={{ ...s.cardSub, color: brief.golden_visa ? T : M }}>
                {brief.golden_visa ? '✓ Golden Visa Eligible' : '✗ Below Golden Visa threshold'}
              </Text>
            </View>
          </View>

          {/* SCENARIOS */}
          <Text style={s.secLabel}>3-Year Capital Appreciation Scenarios</Text>
          <View style={s.row3}>
            <View style={s.scen}>
              <Text style={s.scenLabel}>BEAR CASE</Text>
              <Text style={s.scenBear}>{brief.bear}</Text>
            </View>
            <View style={s.scen}>
              <Text style={s.scenLabel}>BASE CASE</Text>
              <Text style={s.scenBase}>{brief.base}</Text>
            </View>
            <View style={s.scen}>
              <Text style={s.scenLabel}>BULL CASE</Text>
              <Text style={s.scenBull}>{brief.bull}</Text>
            </View>
          </View>

          {/* VERDICT */}
          <Text style={s.secLabel}>Analyst Verdict</Text>
          <View style={verdictBoxStyle(brief.verdict)}>
            <Text style={s.boxTitle}>VERDICT — {brief.verdict}</Text>
            <Text style={s.boxText}>{brief.verdict_note}</Text>
          </View>

          {/* KEY RISK */}
          <Text style={s.secLabel}>Key Risk</Text>
          <View style={s.verdictBox}>
            <Text style={s.boxTitle}>RISK FACTOR</Text>
            <Text style={s.boxText}>{brief.key_risk}</Text>
          </View>

          {/* DISCLAIMER */}
          <Text style={s.disclaimer}>
            This investment brief is prepared by Nawaz Sells Dubai for {clientName} and is for informational purposes only.
            It does not constitute financial, investment, legal, or tax advice. All projections are estimates based on
            publicly available market data at the time of generation and are not guarantees of future performance.
            Past market performance is not indicative of future results. Please conduct independent due diligence
            before making any investment decision. nawazsellsdubai.com
          </Text>
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          <View style={s.footerRow}>
            <Text style={s.footerBrand}>NAWAZ SELLS DUBAI</Text>
            <Text style={s.footerSite}>nawazsellsdubai.com  ·  wa.me/971563281781</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}
