'use client'

import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, background: '#0a0a0f', color: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1.5rem',
            padding: '3rem 2rem',
            backdropFilter: 'blur(24px)',
          }}>
            {/* Icon */}
            <div style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Критическая ошибка
            </h2>

            {/* Description */}
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}>
              Произошла непредвиденная ошибка приложения. Попробуйте обновить страницу.
            </p>

            {error?.message && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '1.5rem',
              }}>
                <p style={{
                  color: '#f87171',
                  fontSize: '0.75rem',
                  wordBreak: 'break-word',
                }}>
                  {error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              alignItems: 'center',
            }}>
              <button
                onClick={reset}
                style={{
                  background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Попробовать снова
              </button>
              <a
                href="/"
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                На главную
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
