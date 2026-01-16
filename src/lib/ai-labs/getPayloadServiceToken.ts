// src/lib/ai-labs/getPayloadServiceToken.ts

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000'
const EMAIL = process.env.PAYLOAD_SERVICE_EMAIL || ''
const PASSWORD = process.env.PAYLOAD_SERVICE_PASSWORD || ''

export async function getPayloadServiceToken(): Promise<string> {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Missing PAYLOAD_SERVICE_EMAIL or PAYLOAD_SERVICE_PASSWORD')
  }

  const res = await fetch(`${PAYLOAD_API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Payload login failed (${res.status}): ${text}`)
  }

  const json = await res.json()
  if (!json?.token) throw new Error('Payload login succeeded but token is missing')
  return json.token as string
}