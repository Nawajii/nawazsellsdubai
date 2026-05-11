import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { v2 as cloudinary } from 'cloudinary'
import { BriefPDF } from './pdf'
import { getNextReportNumber, logReport } from './sheets'
import { getLandmarkDistances } from './maps'

export const maxDuration = 120 // seconds

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// ── Cache ──────────────────────────────────────────────────────────────────
const briefCache = new Map<string, any>()

// ── System prompt ──────────────────────────────────────────────────────────
const SYSTEM = `You are a senior real estate investment analyst preparing institutional-grade reports for serious investors — the standard is Blackrock, Rothschild, or top-tier MENA investment advisory firms.

Your analysis must be data-backed, measured, and serious in tone. Every conclusion must be briefly justified. No marketing language. No fluff.

Given a Dubai off-plan project name and investor profile, perform deep web research and return a JSON object ONLY — no markdown, no preamble.

SEARCH STRATEGY:
- Max 2 web searches. Be precise and efficient.
- Search 1: Project details, developer, pricing, handover
- Search 2: Area performance, yield data, price trends

Return this exact JSON structure:

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
    "founded": "Year or N/A",
    "overview": "2-3 sentences on the developer",
    "projects_delivered": ["Project 1 (year)", "Project 2 (year)"],
    "delivery_track_record": "Assessment of on-time delivery — data-backed",
    "quality_assessment": "Assessment of build quality based on market feedback",
    "existing_supply": "Current unsold/rental inventory overview",
    "resellability": "Assessment of secondary market demand for their projects",
    "absorption": "How quickly their units typically sell and rent",
    "serious_redflag": false,
    "redflag_note": "Only populate if serious_redflag is true"
  },
  "project": {
    "type": "e.g. Residential Apartments",
    "units": "Unit types available e.g. Studio, 1BR, 2BR",
    "size_range": "e.g. 450 – 1,200 sqft",
    "price_range": "e.g. AED 800K – 2.4M",
    "price_per_sqft": "AED X,XXX",
    "handover": "e.g. Q4 2027",
    "usp": "2-3 sentences on what makes this project distinctive",
    "amenities": ["Amenity 1", "Amenity 2", "Amenity 3", "Amenity 4", "Amenity 5"],
    "branding": "Any hospitality or lifestyle branding e.g. Wyndham, or N/A",
    "lifestyle_positioning": "1 sentence on lifestyle target"
  },
  "yield_analysis": {
    "gross_yield_range": "e.g. 6.5% – 8.2%",
    "area_avg_yield": "Community average gross yield",
    "rental_demand": "Assessment of rental demand drivers",
    "area_transactions_2024": "Transaction volume note for the area in 2024",
    "absorption_rate": "How quickly units are absorbed in this community",
    "supply_pipeline": "Upcoming supply in this community over next 24 months",
    "yield_outlook": "1-2 sentence forward-looking yield commentary"
  },
  "capital_appreciation": {
    "price_2020": "Approx AED per sqft in 2020 or earliest available",
    "price_current": "Current AED per sqft",
    "growth_pct": "Percentage growth since 2020",
    "key_growth_drivers": ["Driver 1", "Driver 2", "Driver 3"],
    "bear_case": "+X% over 3 years",
    "base_case": "+X% over 3 years",
    "bull_case": "+X% over 3 years",
    "appreciation_commentary": "2 sentences on appreciation outlook, data-backed"
  },
  "risk_assessment": {
    "location_risks": ["Risk 1 with reassurance", "Risk 2 with reassurance"],
    "market_risks": ["Market risk 1"],
    "overall_risk_level": "Low / Moderate / Elevated",
    "risk_commentary": "2-3 sentences — balanced, investor-safety focused, not alarmist"
  },
  "sources": ["URL or source 1", "URL or source 2", "URL or source 3"]
}

CRITICAL: Return pure JSON only. Do NOT include any <cite> tags, citation markers, or source references inside the JSON values. Plain text values only.
- No payment plan information — omit entirely
- No verdict, no BUY/WATCH/AVOID
- Risk section must be balanced — never alarmist, never negligent
- Only flag developer redflag if there is documented evidence of serious issues
- optional_landmarks must be 3 landmarks relevant to the project location — NOT Palm Jumeirah if project is near Palm Jumeirah, NOT DXB if project is near DXB. Choose what's relevant geographically.
- All data must be sourced from web search. If unavailable, state "Data not publicly available at time of report"
- Return only valid JSON`

// ── Upload PDF to Cloudinary ───────────────────────────────────────────────
async function uploadPDF(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'nawazsellsdubai/briefs', public_id: filename, format: 'pdf', overwrite: true },
      (err, result) => { if (err) reject(err); else resolve(result!.secure_url) }
    )
    stream.end(buffer)
  })
}

// ── Send via WATI ──────────────────────────────────────────────────────────
async function sendWhatsApp(phone: string, name: string, project: string, pdfUrl: string) {
  const watiUrl   = process.env.WATI_API_URL
  const watiToken = process.env.WATI_API_TOKEN
  if (!watiUrl || !watiToken) { console.warn('WATI not configured'); return }

  const cleanPhone = phone.replace(/[\s\-\+]/g, '')

  try {
    await fetch(`${watiUrl}/api/v1/addContact/${cleanPhone}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${watiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
  } catch (e) { console.error('WATI addContact:', e) }

  try {
    const res = await fetch(`${watiUrl}/api/v1/sendTemplateMessage`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${watiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_name: 'brief_delivery',
        broadcast_name: `brief_${Date.now()}`,
        receivers: [{
          whatsappNumber: cleanPhone,
          customParams: [
            { name: '1', value: name },
            { name: '2', value: project },
            { name: '3', value: pdfUrl },
          ],
        }],
      }),
    })
    const data = await res.json()
    if (!res.ok) console.error('WATI error:', data)
  } catch (e) { console.error('WATI send:', e) }
}

// ── Main handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { project, fileBase64, fileMime, clientName, clientPhone, briefData, answers } = await req.json()

  // ── Deliver PDF for already-generated brief ──
  if (briefData && clientName && clientPhone) {
    const reportNo = await getNextReportNumber()
    console.log('Report number generated:', reportNo)

    // Log to sheets immediately — don't wait for PDF
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

    // Generate and deliver PDF separately
    try {
      console.log('Getting landmarks...')
      const landmarks = await getLandmarkDistances(
        briefData.location?.address || `${briefData.project_name}, Dubai`,
        briefData.location?.optional_landmarks || []
      )
      console.log('Landmarks done, rendering PDF...')

      const pdfBuffer = await renderToBuffer(
        createElement(BriefPDF, {
          brief: briefData,
          answers: answers || { budget: '', goal: '', timeline: '' },
          clientName,
          reportNo,
          landmarks,
        }) as any
      )
      console.log('PDF rendered, uploading to Cloudinary...')

      const filename = `${reportNo}_${clientName.replace(/\s+/g,'_')}`
      const pdfUrl   = await uploadPDF(pdfBuffer as Buffer, filename)
      console.log('PDF uploaded:', pdfUrl)

      await sendWhatsApp(clientPhone, clientName, briefData.project_name || briefData.project, pdfUrl)
      console.log('WhatsApp sent')
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
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
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
  // Strip citation tags inserted by web search
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
