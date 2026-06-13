import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WorldCup26.my.id — Pusat Piala Dunia 2026 Indonesia',
  description: 'Jadwal live WIB, skor real-time, klasemen, prediksi & info nobar Piala Dunia 2026 dalam Bahasa Indonesia',
  keywords: ['piala dunia 2026', 'world cup 2026', 'jadwal WIB', 'skor live', 'klasemen'],
  openGraph: {
    title: 'WorldCup26.my.id',
    description: 'Pusat Piala Dunia 2026 untuk Indonesia 🇮🇩',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAFAF9] text-stone-900 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
