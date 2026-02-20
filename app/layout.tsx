import type { Metadata } from 'next'
import { Montserrat, Poppins, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Kache Digital Store',
  description: 'Cyber-Fusion Overhaul',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import NotepadOverlay from '@/components/NotepadOverlay';
import { ProjectProvider } from '@/context/ProjectContext';
import { LayoutWrapper } from '@/components/LayoutWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body className="font-poppins antialiased bg-background text-foreground">
        <ProjectProvider>
          <LayoutWrapper>
            {children}
            <NotepadOverlay />
          </LayoutWrapper>
        </ProjectProvider>
        <Analytics />
      </body>
    </html>
  )
}
