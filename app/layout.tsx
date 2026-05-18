import type { Metadata } from 'next'
import { Nunito, Space_Mono } from 'next/font/google'
import './globals.css'

/**
 * WHY: We load fonts here at the root level so every page
 * gets them automatically. next/font/google handles downloading,
 * optimizing, and self-hosting the font for us.
 *
 * The 'variable' option creates a CSS custom property
 * (--font-nunito and --font-space-mono) that our globals.css
 * @theme block references.
 */
const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

/**
 * WHY: Metadata is used by search engines and social media
 * when someone shares your portfolio link. This is what
 * shows up in Google results and LinkedIn/WhatsApp previews.
 */
export const metadata: Metadata = {
  title: 'Portfolio Uzair Asim',
  description: 'Full Stack Developer specializing in .NET, Azure, and modern JS frameworks. Based in Islamabad, Pakistan.',
  keywords: [
    'Uzair Asim',
    'Full Stack Developer',
    'Software Engineer',
    '.NET',
    'Azure',
    'React',
    'Islamabad'
  ],
  openGraph: {
    title: 'Uzair Asim — Full-Stack Engineer',
    description: 'Full-Stack Developer specializing in .NET, Azure, and modern JS frameworks.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /**
   * WHY suppressHydrationWarning: Next.js renders on the server
   * first, then React takes over in the browser (hydration).
   * Sometimes the browser adds attributes to <html> that the
   * server didn't know about (like a dark mode class from an
   * extension). suppressHydrationWarning tells React to ignore
   * that mismatch instead of throwing a warning.
   *
   * WHY both font variables on body: We apply both CSS variable
   * classes to the body so that both --font-nunito and
   * --font-space-mono are available to every child component.
   */
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${spaceMono.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}