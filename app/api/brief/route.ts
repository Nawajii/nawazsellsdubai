import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { project } = await req.json()
  if (!project) return NextResponse.json({ error: 'No project provided' }, { status: 400 })

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system: `You are an institutional-grade real estate investment analyst specializing in Dubai off-plan properties. Given a project name, search for current information and return ONLY a valid JSON structure:
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
  "verdict_note": "2-sentence analyst rationale",
  "key_risk": "Single key risk factor"
}
If specific data is unavailable, provide educated estimates based on comparable Dubai projects. Return only valid JSON.`,
      messages: [{ role: 'user', content: `Generate an investment brief for: ${project}` }],
    }),
  })

  const data = await res.json()
  let txt = data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
  txt = txt.replace(/```json|```/g, '').trim()
  const js = txt.indexOf('{'), je = txt.lastIndexOf('}')
  if (js !== -1 && je !== -1) txt = txt.slice(js, je + 1)

  try {
    return NextResponse.json(JSON.parse(txt))
  } catch {
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }
}