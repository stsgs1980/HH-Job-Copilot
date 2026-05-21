// ============================================================
// Feature Flags — Central control for all features
// Set via .env, checked at runtime
// ============================================================

const flags = {
  /** Stripe payments (test mode when true, no real charges) */
  stripe:        process.env.NEXT_PUBLIC_FEATURE_STRIPE === 'true',

  /** NextAuth real auth (mock session when false) */
  nextauth:      process.env.NEXT_PUBLIC_FEATURE_NEXTAUTH === 'true',

  /** AI chat via z-ai-sdk */
  aiChat:        process.env.NEXT_PUBLIC_FEATURE_AI_CHAT !== 'false', // default ON

  /** HH.ru Chatik API (mock data when false) */
  hhChatik:      process.env.NEXT_PUBLIC_FEATURE_HH_CHATIK === 'true',

  /** ASR speech recognition for interviews */
  asr:           process.env.NEXT_PUBLIC_FEATURE_ASR === 'true',

  /** TTS voice output (Ultra only) */
  tts:           process.env.NEXT_PUBLIC_FEATURE_TTS === 'true',

  /** AI streaming responses (SSE) */
  aiStreaming:   process.env.NEXT_PUBLIC_FEATURE_AI_STREAMING === 'true',
} as const

export type FeatureFlag = keyof typeof flags

/** Check if a feature is enabled */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return flags[flag]
}

/** Get all feature flags (for debugging / admin) */
export function getAllFlags(): Record<FeatureFlag, boolean> {
  return { ...flags }
}

/** Server-side only flags (not exposed to client) */
export const serverFlags = {
  /** Stripe secret key configured */
  stripeConfigured: !!(process.env.STRIPE_SECRET_KEY),

  /** HH.ru OAuth credentials configured */
  hhOAuthConfigured: !!(process.env.HH_CLIENT_ID && process.env.HH_CLIENT_SECRET),

  /** Database URL configured */
  dbConfigured: !!(process.env.DATABASE_URL),
} as const
