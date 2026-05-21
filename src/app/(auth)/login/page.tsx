'use client'

import { useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth'

export default function LoginPage() {
  const router = useRouter()

  return <AuthForm onNavigate={() => router.push('/dashboard')} />
}
