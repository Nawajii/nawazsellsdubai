const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY!

// Fixed mandatory landmarks
const MANDATORY = [
  { name: 'Downtown Dubai / Burj Khalifa', place: 'Burj Khalifa, Dubai' },
  { name: 'Dubai International Airport (DXB)', place: 'Dubai International Airport' },
  { name: 'Al Maktoum International Airport (DWC)', place: 'Al Maktoum International Airport, Dubai' },
]

// Optional landmarks pool — Claude picks relevant ones based on location
export const OPTIONAL_LANDMARKS = [
  { name: 'Palm Jumeirah', place: 'Palm Jumeirah, Dubai' },
  { name: 'Dubai Marina', place: 'Dubai Marina, Dubai' },
  { name: 'Mall of the Emirates', place: 'Mall of the Emirates, Dubai' },
  { name: 'Dubai Hills Mall', place: 'Dubai Hills Mall, Dubai' },
  { name: 'Jumeirah Beach', place: 'Jumeirah Beach, Dubai' },
  { name: 'DIFC', place: 'DIFC, Dubai' },
  { name: 'Business Bay', place: 'Business Bay, Dubai' },
  { name: 'Expo City Dubai', place: 'Expo City Dubai' },
  { name: 'Global Village', place: 'Global Village, Dubai' },
  { name: 'Dubai Frame', place: 'Dubai Frame, Dubai' },
  { name: 'Ibn Battuta Mall', place: 'Ibn Battuta Mall, Dubai' },
  { name: 'Dubai South', place: 'Dubai South, Dubai' },
]

export type LandmarkDistance = {
  name: string
  duration: string
  distance: string
}

export async function getLandmarkDistances(
  projectAddress: string,
  optionalLandmarks: { name: string; place: string }[]
): Promise<LandmarkDistance[]> {
  const landmarks = [...MANDATORY, ...optionalLandmarks.slice(0, 3)]
  const results: LandmarkDistance[] = []

  for (const lm of landmarks) {
    try {
      const url = new URL('https://maps.googleapis.com/maps/api/directions/json')
      url.searchParams.set('origin', projectAddress)
      url.searchParams.set('destination', lm.place)
      url.searchParams.set('mode', 'driving')
      url.searchParams.set('key', MAPS_KEY)

      const res  = await fetch(url.toString())
      const data = await res.json()

      if (data.routes?.[0]?.legs?.[0]) {
        const leg = data.routes[0].legs[0]
        results.push({
          name:     lm.name,
          duration: leg.duration.text,
          distance: leg.distance.text,
        })
      } else {
        results.push({ name: lm.name, duration: 'N/A', distance: 'N/A' })
      }
    } catch (e) {
      console.error(`Maps error for ${lm.name}:`, e)
      results.push({ name: lm.name, duration: 'N/A', distance: 'N/A' })
    }
  }

  return results
}
