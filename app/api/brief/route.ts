import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { put } from '@vercel/blob'
import { BriefPDF } from './pdf'
import { getNextReportNumber, logReport } from './sheets'
import { getLandmarkDistances } from './maps'

export const maxDuration = 120

// ── Cache ──────────────────────────────────────────────────────────────────
const briefCache = new Map<string, any>()

// ── System prompt ──────────────────────────────────────────────────────────
const SYSTEM = `You are a senior real estate investment analyst preparing institutional-grade reports for serious investors — the standard is Blackrock, Rothschild, or top-tier MENA investment advisory firms.

Your analysis must be data-backed, measured, and serious in tone. Every conclusion must be briefly justified. No marketing language. No fluff.

CRITICAL: Return pure JSON only. Do NOT include any <cite> tags, citation markers, or source references inside the JSON values. Plain text values only. No markdown formatting inside string values.

SEARCH STRATEGY:
- Max 2 web searches. Be precise and efficient.
- Search 1: Project details, developer, pricing, handover, amenities
- Search 2: Area performance, yield data, price trends, supply pipeline

Given a Dubai off-plan project name and investor profile, return this exact JSON structure:

{
  "project_name": "Full official project name",
  "developer_name": "Developer name",
  "location": {
    "community": "Community name",
    "district": "District/area",
    "address": "Full address for Maps API",
    "overview": "2-3 sentences on why this location matters for investors",
    "pros": ["Pro point 1", "Pro point 2", "Pro point 3"],
    "facilities": {
      "schools": ["School 1", "School 2"],
      "hospitals": ["Hospital 1"],
      "malls": ["Mall 1"],
      "transport": ["Metro station or road 1", "Road 2"]
    },
    "optional_landmarks": [
      {"name": "Landmark name", "place": "Landmark name, Dubai"},
      {"name": "Landmark name", "place": "Landmark name, Dubai"},
      {"name": "Landmark name", "place": "Landmark name, Dubai"}
    ]
  },
  "developer": {
    "name": "Developer name",
    "overview": "2-3 sentences on the developer",
    "projects_delivered": ["Project 1 (year)", "Project 2 (year)"],
    "delivery_track_record": "Assessment of on-time delivery",
    "quality_assessment": "Assessment of build quality",
    "existing_supply": "Current inventory overview",
    "resellability": "Secondary market demand assessment",
    "absorption": "How quickly units sell and rent",
    "serious_redflag": false,
    "redflag_note": ""
  },
  "project": {
    "type": "e.g. Residential Apartments",
    "units": "Unit types e.g. Studio, 1BR, 2BR",
    "size_range": "e.g. 450-1200 sqft",
    "price_range": "e.g. AED 800K-2.4M",
    "price_per_sqft": "AED X,XXX",
    "handover": "e.g. Q4 2027",
    "usp": "2-3 sentences on what makes this project distinctive",
    "amenities": ["Amenity 1", "Amenity 2", "Amenity 3", "Amenity 4", "Amenity 5"],
    "branding": "Any hospitality branding or N/A",
    "lifestyle_positioning": "1 sentence on lifestyle target"
  },
  "yield_analysis": {
    "gross_yield_range": "e.g. 6.5%-8.2%",
    "area_avg_yield": "Community average gross yield",
    "rental_demand": "Assessment of rental demand drivers",
    "area_transactions_2024": "Transaction volume note for 2024",
    "absorption_rate": "How quickly units are absorbed",
    "supply_pipeline": "Upcoming supply over next 24 months",
    "yield_outlook": "1-2 sentence forward-looking commentary"
  },
  "capital_appreciation": {
    "price_2020": "Approx AED per sqft in 2020",
    "price_current": "Current AED per sqft",
    "growth_pct": "Percentage growth since 2020",
    "key_growth_drivers": ["Driver 1", "Driver 2", "Driver 3"],
    "bear_case": "+X% over 3 years",
    "base_case": "+X% over 3 years",
    "bull_case": "+X% over 3 years",
    "appreciation_commentary": "2 sentences on appreciation outlook"
  },
  "risk_assessment": {
    "location_risks": ["Risk 1 with reassurance", "Risk 2 with reassurance"],
    "market_risks": ["Market risk 1"],
    "overall_risk_level": "Low / Moderate / Elevated",
    "risk_commentary": "2-3 sentences — balanced, not alarmist"
  },
  "sources": ["URL or source 1", "URL or source 2"]
}

RULES:
- No payment plan information
- No verdict, no BUY/WATCH/AVOID
- Risk section must be balanced — never alarmist
- Only flag developer redflag if documented evidence exists
- Return only valid JSON, no other text`

// ── Upload PDF to Vercel Blob ──────────────────────────────────────────────
async function uploadPDF(buffer: Buffer, filename: string): Promise<string> {
  const blob = await put(`briefs/${filename}.pdf`, buffer, {
    access: 'public',
    contentType: 'application/pdf',
  })
  return blob.url
}

// ── Send via WATI ──────────────────────────────────────────────────────────
async function sendWhatsApp(phone: string, name: string, project: string, pdfUrl: string, verdict: string, grossYield: string) {
  const watiUrl   = process.env.WATI_API_URL
  const watiToken = process.env.WATI_API_TOKEN
  if (!watiUrl || !watiToken) { console.warn('WATI not configured'); return }

  const cleanPhone = phone.replace(/\D/g, '')
  console.log('WATI phone — local digits:', cleanPhone)

  try {
    await fetch(`${watiUrl}/api/v1/addContact/${cleanPhone}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${watiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
  } catch (e) { console.error('WATI addContact:', e) }

  try {
    const res = await fetch(`${watiUrl}/api/v1/sendTemplateMessage?whatsappNumber=${cleanPhone}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${watiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_name: 'brief_delivery',
        broadcast_name: `brief_${Date.now()}`,
        parameters: [
          { name: 'name',         value: name },
          { name: 'investment',   value: project },
          { name: 'verdict',      value: verdict },
          { name: 'gross_yield',  value: grossYield },
        ],
      }),
    })
    const data = await res.json()
    if (!res.ok) console.error('WATI error:', data)
    else console.log('WhatsApp sent')
  } catch (e) { console.error('WATI send:', e) }
}

// ── Main handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { project, fileBase64, fileMime, clientName, clientPhone, clientPhoneLocal, briefData, answers } = await req.json()

  // ── Deliver PDF for already-generated brief ──
  if (briefData && clientName && clientPhone) {
    const reportNo = await getNextReportNumber()
    console.log('Report number generated:', reportNo)

    // Log to sheets immediately
    logReport({
      reportNo,
      clientName,
      phone:    clientPhone,
      project:  briefData.project_name || 'Unknown',
      budget:   answers?.budget || '',
      goal:     answers?.goal || '',
      timeline: answers?.timeline || '',
      sources:  briefData.sources || [],
    }).catch(e => console.error('Sheet log error:', e))

    // Generate and deliver PDF
    try {
      console.log('Getting landmarks...')
      const landmarks = await getLandmarkDistances(
        briefData.location?.address || `${briefData.project_name}, Dubai`,
        briefData.location?.optional_landmarks || []
      )
      console.log('Landmarks done, rendering PDF...')

      const pdfBuffer = await renderToBuffer(
        createElement(BriefPDF, {
          brief:      briefData,
          answers:    answers || { budget: '', goal: '', timeline: '' },
          clientName,
          reportNo,
          landmarks,
        }) as any
      )
      console.log('PDF rendered, uploading...')

      const filename = `${reportNo}_${clientName.replace(/\s+/g, '_')}`
      const pdfUrl   = await uploadPDF(pdfBuffer as Buffer, filename)
      console.log('PDF uploaded:', pdfUrl)

      const riskLevel  = briefData.risk_assessment?.overall_risk_level || ''
      const verdictMap: Record<string, string> = { Low: 'Strong Buy', Moderate: 'Watch', Elevated: 'Cautious' }
      const verdict    = verdictMap[riskLevel] || 'See Brief'
      const grossYield = briefData.yield_analysis?.gross_yield_range    || 'See Brief'
      await sendWhatsApp(clientPhoneLocal || clientPhone, clientName, briefData.project_name || 'Project', pdfUrl, verdict, grossYield)
    } catch (e) {
      console.error('PDF/delivery error:', e)
    }

    return NextResponse.json({ ok: true })
  }

  // ── Generate brief ──
  if (!project && !fileBase64) {
    return NextResponse.json({ error: 'No project or file provided' }, { status: 400 })
  }

  const cacheKey = project?.toLowerCase().trim().slice(0, 100)
  if (cacheKey && !fileBase64 && briefCache.has(cacheKey)) {
    return NextResponse.json(briefCache.get(cacheKey))
  }

  const isDocument = !!fileBase64 && !!fileMime
  let userContent: any[]

  if (isDocument) {
    const isPdf   = fileMime === 'application/pdf'
    const isImage = fileMime?.startsWith('image/')
    if (isPdf) {
      userContent = [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 } },
        { type: 'text', text: `Analyse this Dubai property document.${project ? ` Context: ${project}` : ''}` },
      ]
    } else if (isImage) {
      userContent = [
        { type: 'image', source: { type: 'base64', media_type: fileMime, data: fileBase64 } },
        { type: 'text', text: `Analyse this Dubai property brochure.${project ? ` Context: ${project}` : ''}` },
      ]
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }
  } else {
    userContent = [{ type: 'text', text: `Generate an institutional investment report for: ${project}` }]
  }

  const body: any = {
    model: 'claude-sonnet-4-5',
    max_tokens: 3500,
    system: SYSTEM,
    messages: [{ role: 'user', content: userContent }],
  }

  if (!isDocument) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }]
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'pdfs-2024-09-25',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Anthropic error:', data)
    return NextResponse.json({ error: 'API error' }, { status: 500 })
  }

  let txt = data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
  txt = txt.replace(/<cite[^>]*>|<\/cite>/g, '')
  txt = txt.replace(/```json|```/g, '').trim()
  const js = txt.indexOf('{'), je = txt.lastIndexOf('}')
  if (js !== -1 && je !== -1) txt = txt.slice(js, je + 1)

  let brief: any
  try {
    brief = JSON.parse(txt)
    if (cacheKey) briefCache.set(cacheKey, brief)
  } catch (e) {
    console.error('Parse error. Raw text length:', txt.length)
    console.error('First 500 chars:', txt.slice(0, 500))
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }

  return NextResponse.json(brief)
}
