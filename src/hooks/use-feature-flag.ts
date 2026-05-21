'use client'

import { isFeatureEnabled, type FeatureFlag } from '@/lib/feature-flags'

/**
 * Client-side hook that reads feature flags.
 * Since flags use NEXT_PUBLIC_ prefix, they are available on the client too.
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return isFeatureEnabled(flag)
}
