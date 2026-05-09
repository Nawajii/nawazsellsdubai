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

export async function POST(req: NextRequest) {
  const { project, fileBase64, fileMime } = await req.json()

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
    // Text-only mode — use web search
    userContent = [{ type: 'text', text: `Generate an investment brief for: ${project}` }]
  }

  const body: any = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: SYSTEM,
    messages: [{ role: 'user', content: userContent }],
  }

  // Only use web search for text-based queries, not document uploads
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

  try {
    return NextResponse.json(JSON.parse(txt))
  } catch {
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }
}
