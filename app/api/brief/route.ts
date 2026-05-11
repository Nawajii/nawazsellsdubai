import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { v2 as cloudinary } from 'cloudinary'
import { BriefPDF } from './pdf'

// ─── Cloudinary config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM = `You are an institutional-grade real estate investment analyst specializing in Dubai off-plan properties. Analyse the provided project information and return ONLY a valid JSON object — no markdown, no preamble, no explanation.

IMPORTANT: Perform a MAXIMUM of 2 web searches. Be efficient.

JSON structure:
{
  "project": "Full project name",
  "developer": "Developer name",
  "developer_score": integer 1-5,
  "developer_note": "One-line track record note",
  "location": "Community, Dubai",
  "overview": "2-3 sentences on the project",
  "price_sqft": "AED X,XXX",
  "gross_yield": "X.X%",
  "net_yield": "X.X%",
  "bear": "+X%",
  "base": "+X%",
  "bull": "+X%",
  "payment_plan": "e.g. 60/40 construction plan",
  "handover": "e.g. Q4 2027",
  "golden_visa": true or false,
  "verdict": "BUY" or "WATCH" or "AVOID",
  "verdict_note": "2-sentence analyst rationale personalised to the investor profile",
  "key_risk": "Single key risk factor"
}
Return only valid JSON.`

// ─── Cache ────────────────────────────────────────────────────────────────────
const briefCache = new Map<string, any>()

// ─── Upload PDF to Cloudinary ─────────────────────────────────────────────────
async function uploadPDF(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'nawazsellsdubai/briefs',
        public_id: filename,
        format: 'pdf',
        overwrite: true,
      },
      (err, result) => {
        if (err) reject(err)
        else resolve(result!.secure_url)
      }
    )
    stream.end(buffer)
  })
}

// ─── Send WhatsApp via WATI ───────────────────────────────────────────────────
async function sendWhatsApp(phone: string, name: string, brief: any, pdfUrl: string) {
  const watiUrl   = process.env.WATI_API_URL
  const watiToken = process.env.WATI_API_TOKEN
  if (!watiUrl || !watiToken) { console.warn('WATI not configured'); return }

  const cleanPhone = phone.replace(/[\s\-\+]/g, '')

  // Add contact
  try {
    await fetch(`${watiUrl}/api/v1/addContact/${cleanPhone}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${watiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, customParams: [{ name: 'project', value: brief.project }] }),
    })
  } catch (e) { console.error('WATI addContact:', e) }

  // Send template message with PDF URL
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
            { name: '2', value: brief.project },
            { name: '3', value: brief.verdict },
            { name: '4', value: brief.gross_yield },
            { name: '5', value: pdfUrl },
          ],
        }],
      }),
    })
    const data = await res.json()
    if (!res.ok) console.error('WATI template error:', data)
    else console.log('WhatsApp sent:', data)
  } catch (e) { console.error('WATI send error:', e) }
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { project, fileBase64, fileMime, clientName, clientPhone, briefData, answers } = await req.json()

  // ── Deliver PDF for already-generated brief ──
  if (briefData && clientName && clientPhone) {
    try {
      const pdfBuffer = await renderToBuffer(
        createElement(BriefPDF, {
          brief: briefData,
          answers: answers || { budget: '', goal: '', timeline: '' },
          clientName,
        })
      )
      const filename = `brief_${clientName.replace(/\s+/g, '_')}_${Date.now()}`
      const pdfUrl = await uploadPDF(pdfBuffer as Buffer, filename)
      await sendWhatsApp(clientPhone, clientName, briefData, pdfUrl)
    } catch (e) {
      console.error('PDF/delivery error:', e)
    }
    return NextResponse.json({ ok: true })
  }

  // ── Generate brief ──
  if (!project && !fileBase64) {
    return NextResponse.json({ error: 'No project or file provided' }, { status: 400 })
  }

  // Cache check
  const cacheKey = project?.toLowerCase().trim().slice(0, 100)
  if (cacheKey && !fileBase64 && briefCache.has(cacheKey)) {
    return NextResponse.json(briefCache.get(cacheKey))
  }

  const isDocument = !!fileBase64 && !!fileMime
  const isPdf      = fileMime === 'application/pdf'
  const isImage    = fileMime?.startsWith('image/')

  let userContent: any[]

  if (isDocument) {
    if (isPdf) {
      userContent = [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 } },
        { type: 'text', text: `Analyse this Dubai property document.${project ? ` Context: ${project}` : ''}` },
      ]
    } else if (isImage) {
      userContent = [
        { type: 'image', source: { type: 'base64', media_type: fileMime, data: fileBase64 } },
        { type: 'text', text: `Analyse this Dubai property brochure image.${project ? ` Context: ${project}` : ''}` },
      ]
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }
  } else {
    userContent = [{ type: 'text', text: `Generate an investment brief for: ${project}` }]
  }

  const body: any = {
    model: 'claude-sonnet-4-5',
    max_tokens: 800,
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
  txt = txt.replace(/```json|```/g, '').trim()
  const js = txt.indexOf('{'), je = txt.lastIndexOf('}')
  if (js !== -1 && je !== -1) txt = txt.slice(js, je + 1)

  let brief: any
  try {
    brief = JSON.parse(txt)
    if (cacheKey) briefCache.set(cacheKey, brief)
  } catch {
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }

  return NextResponse.json(brief)
}
