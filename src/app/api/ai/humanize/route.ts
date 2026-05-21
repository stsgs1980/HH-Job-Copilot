import { NextRequest, NextResponse } from 'next/server'
import { humanize } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text } = body as { text?: string }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'text is required and must be a non-empty string' },
        { status: 400 },
      )
    }

    const humanized = await humanize(text)

    return NextResponse.json({ original: text, humanized })
  } catch (error) {
    console.error('[/api/ai/humanize] Error:', error)
    return NextResponse.json(
      { error: 'Failed to humanize text' },
      { status: 500 },
    )
  }
}
