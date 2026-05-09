import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `You are an institutional-grade real estate investment analyst specializing in Dubai off-plan properties. Analyse the provided project information and return ONLY a valid JSON object — no markdown, no preamble, no explanation.

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

If a document is provided, extract all available data from it directly. For any gaps, use web search and comparable Dubai market data. Personalise the verdict_note to the investor's stated budget, goal, and timeline. Return only valid JSON.`

// Send WhatsApp message via WATI
async function sendWhatsApp(phone: string, name: string, brief: any) {
  const watiUrl = process.env.WATI_API_URL
  const watiToken = process.env.WATI_API_TOKEN

  if (!watiUrl || !watiToken) {
    console.warn('WATI credentials not configured — skipping WhatsApp delivery')
    return
  }

  // Clean phone number — remove spaces, dashes, + signs
  const cleanPhone = phone.replace(/[\s\-\+]/g, '')

  // First add contact to WATI
  try {
    await fetch(`${watiUrl}/api/v1/addContact/${cleanPhone}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${watiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        customParams: [
          { name: 'project', value: brief.project },
          { name: 'verdict', value: brief.verdict },
          { name: 'gross_yield', value: brief.gross_yield },
        ]
      })
    })
  } catch (e) {
    console.error('WATI addContact error:', e)
  }

  // Send template message
  try {
    const res = await fetch(`${watiUrl}/api/v1/sendTemplateMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${watiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_name: 'brief_delivery',
        broadcast_name: `brief_${Date.now()}`,
        receivers: [
          {
            whatsappNumber: cleanPhone,
            customParams: [
              { name: '1', value: name },
              { name: '2', value: brief.project },
              { name: '3', value: brief.verdict },
              { name: '4', value: brief.gross_yield },
              { name: '5', value: brief.base },
            ]
          }
        ]
      })
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('WATI sendTemplateMessage error:', data)
    } else {
      console.log('WhatsApp sent successfully:', data)
    }
  } catch (e) {
    console.error('WATI sendTemplateMessage error:', e)
  }
}

export async function POST(req: NextRequest) {
  const { project, fileBase64, fileMime, clientName, clientPhone, briefData } = await req.json()

  // If brief already generated — just send WhatsApp
  if (briefData && clientName && clientPhone) {
    await sendWhatsApp(clientPhone, clientName, briefData)
    return NextResponse.json({ ok: true })
  }

  if (!project && !fileBase64) {
    return NextResponse.json({ error: 'No project or file provided' }, { status: 400 })
  }

  const isDocument = !!fileBase64 && !!fileMime
  const isPdf = fileMime === 'application/pdf'
  const isImage = fileMime?.startsWith('image/')

  let userContent: any[]

  if (isDocument) {
    if (isPdf) {
      userContent = [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 },
        },
        {
          type: 'text',
          text: `Analyse this Dubai property document. Extract all project details from it. ${project ? `Additional context: ${project}` : ''}`,
        },
      ]
    } else if (isImage) {
      userContent = [
        {
          type: 'image',
          source: { type: 'base64', media_type: fileMime, data: fileBase64 },
        },
        {
          type: 'text',
          text: `Analyse this Dubai property brochure or sales offer image. Extract all project details visible. ${project ? `Additional context: ${project}` : ''}`,
        },
      ]
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }
  } else {
    userContent = [{ type: 'text', text: `Generate an investment brief for: ${project}` }]
  }

  const body: any = {
    model: 'claude-sonnet-4-5',
    max_tokens: 1500,
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
    console.error('Anthropic API error:', data)
    return NextResponse.json({ error: 'API error' }, { status: 500 })
  }

  let txt = data.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')

  txt = txt.replace(/```json|```/g, '').trim()
  const js = txt.indexOf('{')
  const je = txt.lastIndexOf('}')
  if (js !== -1 && je !== -1) txt = txt.slice(js, je + 1)

  let brief
  try {
    brief = JSON.parse(txt)
  } catch {
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }

  // Send WhatsApp if client details provided
  if (clientName && clientPhone) {
    await sendWhatsApp(clientPhone, clientName, brief)
  }

  return NextResponse.json(brief)
}
