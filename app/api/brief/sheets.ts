const SHEET_ID  = process.env.GOOGLE_SHEET_ID!
const SA_EMAIL  = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
const SA_KEY    = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
const SCOPES    = ['https://www.googleapis.com/auth/spreadsheets']

// ── JWT auth token ─────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const now   = Math.floor(Date.now() / 1000)
  const claim = {
    iss: SA_EMAIL,
    scope: SCOPES.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const payload = btoa(JSON.stringify(claim)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const data    = `${header}.${payload}`

  // Import private key
  const pemBody   = SA_KEY.replace(/-----BEGIN RSA PRIVATE KEY-----|-----BEGIN PRIVATE KEY-----|-----END RSA PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '')
  const keyBuffer = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0))
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', keyBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )

  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(data))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const jwt = `${data}.${sigB64}`

  const res  = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  })
  const json = await res.json()
  return json.access_token
}

// ── Get next report number ─────────────────────────────────────────────────

export async function getNextReportNumber(): Promise<string> {
  try {
    const token = await getAccessToken()
    const res   = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Counter!A2`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data  = await res.json()
    const count = parseInt(data.values?.[0]?.[0] || '0', 10) + 1

    // Write incremented counter back
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Counter!A2?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [[count]] }),
      }
    )

    // Format: YYMMnsd + 3-digit sequential
    const now    = new Date()
    const year   = String(now.getFullYear()).slice(2)
    const month  = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}${month}NSD${String(count).padStart(3, '0')}`
  } catch (e) {
    console.error('Report number error:', e)
    // Fallback if Sheets fails
    return `${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth()+1).padStart(2,'0')}NSD000`
  }
}

// ── Log report to sheet ────────────────────────────────────────────────────

export async function logReport(params: {
  reportNo:   string
  clientName: string
  phone:      string
  project:    string
  budget:     string
  goal:       string
  timeline:   string
  sources:    string[]
}) {
  try {
    const token = await getAccessToken()
    const date  = new Date().toISOString().split('T')[0]
    const row   = [
      params.reportNo,
      date,
      params.clientName,
      params.phone,
      params.project,
      params.budget,
      params.goal,
      params.timeline,
      params.sources.join(' | '),
    ]

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Reports!A:I:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] }),
      }
    )
    console.log('Logged report:', params.reportNo)
  } catch (e) {
    console.error('Sheet log error:', e)
  }
}
