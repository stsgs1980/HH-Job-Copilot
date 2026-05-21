import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/components/auth";
import { ErrorBoundary } from "@/components/error-boundary";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://hhcopilot.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HH Job Copilot — AI-ассистент для поиска работы",
  description:
    "Автоматизируй поиск работы на HH.ru с AI. Авто-отклики, чат с HR через Chatik API, интервью-ассистент с ASR. Найди работу мечты быстрее.",
  keywords: [
    "HH.ru",
    "AI",
    "поиск работы",
    "автоотклики",
    "интервью",
    "Chatik API",
    "карьера",
    "job search",
    "AI assistant",
    "resume",
    "auto apply",
  ],
  authors: [{ name: "HH Job Copilot" }],
  creator: "HH Job Copilot",
  publisher: "HH Job Copilot",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "ru-RU": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    title: "HH Job Copilot — AI-ассистент для поиска работы",
    description:
      "Автоматизируй поиск работы на HH.ru с AI. Авто-отклики, чат с HR через Chatik API, интервью-ассистент с ASR.",
    siteName: "HH Job Copilot",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "HH Job Copilot — AI-ассистент для поиска работы на HH.ru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Job Copilot — AI-ассистент для поиска работы",
    description:
      "Автоматизируй поиск работы на HH.ru с AI. Авто-отклики, чат с HR, интервью-ассистент.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@hhcopilot",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {/* NEURO: Noise overlay — refined SVG grain */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* NEURO: Cursor glow — smooth, large, cyan→purple→emerald */}
        <div
          className="cursor-glow"
          id="cursorGlow"
          aria-hidden="true"
        />

        {/* WCAG: Skip link for keyboard navigation */}
        <a href="#main-content" className="skip-link">
          Перейти к основному содержимому
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>
              <ErrorBoundary>
                <div id="main-content">
                  {children}
                </div>
              </ErrorBoundary>
              <Toaster />
            </AuthProvider>
          </Providers>
        </ThemeProvider>

        {/* NEURO: Cursor glow script — optimized with rAF throttling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var glow = document.getElementById('cursorGlow');
                if (!glow) return;
                var ticking = false;
                document.addEventListener('mousemove', function(e) {
                  if (!ticking) {
                    requestAnimationFrame(function() {
                      glow.style.left = e.clientX + 'px';
                      glow.style.top = e.clientY + 'px';
                      ticking = false;
                    });
                    ticking = true;
                  }
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
