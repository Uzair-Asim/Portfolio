import { getPortfolioData } from '@/lib/data'
import ChatWidget from './ChatWidget'

/**
 * WHY a wrapper server component:
 * ChatWidget is 'use client' so it can't fetch data itself.
 * layout.tsx is a server component but we don't want to
 * fetch portfolio data there - it's already fetched in page.tsx.
 * A dedicated wrapper server component fetches just what's
 * needed for the chat widget independently, keeping concerns
 * separated and layout.tsx clean.
 */
export default async function ChatWidgetWrapper() {
  const portfolio = await getPortfolioData()
  return <ChatWidget enabled={portfolio?.hero?.chatEnabled ?? true} />
}