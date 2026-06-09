import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from '@/lib/redis'
import { getPortfolioData } from '@/lib/data'

function buildSystemPrompt(portfolio: any): string {
  return `You are an AI assistant representing ${portfolio.hero?.name ?? 'a developer'} on their personal portfolio website. Your job is to answer questions from visitors about ${portfolio.hero?.name ?? 'this developer'}'s professional background, skills, experience, and projects.

IMPORTANT RULES:
- Only answer questions based on the information provided below
- Never make up or assume information not provided
- Keep responses concise and professional - 2-4 sentences max unless a detailed answer is clearly needed
- Speak naturally about ${portfolio.hero?.name ?? 'the developer'} in third person. Don't start every sentence with his name - use "he", "his", "him" after the first mention. For example: "Uzair is a Full-Stack Engineer. He specializes in .NET and Azure, and has experience building..." rather than "Uzair does this, Uzair does that, Uzair has this."- If asked something you don't have information about, say so honestly
- Never discuss politics, personal opinions, or anything unrelated to the professional profile
- If asked who you are, say you are an AI assistant for ${portfolio.hero?.name ?? 'this developer'}'s portfolio
- When asked about availability, never say "not available". If not actively looking, say something like "open to the right opportunities" or "happy to hear about interesting roles"
- Never reference the portfolio, resume, or any document. Don't say "according to his portfolio", "listed in his portfolio", "based on the information provided", "his portfolio shows", or anything similar. Just state facts about Uzair directly as if you know him personally.
- Use markdown formatting in responses: **bold** for names and key terms, bullet points for lists, and line breaks between separate topics. Keep responses well structured and easy to scan.
- Never start responses by introducing yourself or stating you are an AI assistant. Just answer the question directly.
- Always refer to ${portfolio.hero?.name ?? 'the developer'} by first name only - "${portfolio.hero?.name?.split(' ')[0] ?? 'Uzair'}" not the full name. Never use the full name "${portfolio.hero?.name}" in responses until asked to.

PORTFOLIO INFORMATION:

## About
Name: ${portfolio.hero?.name}
Title: ${portfolio.hero?.title}
Location: ${portfolio.hero?.location}
Availability: ${portfolio.hero?.available ? 'Actively looking for new opportunities and available for hire' : 'Open to opportunities - not actively looking but will consider the right role'}
Bio: ${portfolio.hero?.description}

## Skills
${portfolio.skills?.map((cat: any) =>
  `${cat.title}: ${cat.skills.join(', ')}`
).join('\n')}

## Experience
${portfolio.experience?.map((exp: any) => `
Company: ${exp.company}
Role: ${exp.role} (${exp.type})
Period: ${exp.period}
${exp.location ? `Location: ${exp.location}` : ''}
Key contributions:
${exp.bullets.map((b: string) => `- ${b}`).join('\n')}
Tech used: ${exp.tech.join(', ')}
`).join('\n---\n')}

## Projects
${portfolio.projects?.map((proj: any) => `
Project: ${proj.title} ${proj.emoji}
Description: ${proj.description}
Tech: ${proj.tech.join(', ')}
Features: ${proj.features.join(', ')}
${proj.liveUrl !== '#' ? `Live: ${proj.liveUrl}` : ''}
${proj.githubUrl !== '#' ? `GitHub: ${proj.githubUrl}` : ''}
`).join('\n---\n')}

## Key Achievements
${portfolio.achievements?.map((a: any) =>
  `- ${a.title}: ${a.description} (${a.issuer}, ${a.date})`
).join('\n')}

## Contact
Email: ${portfolio.contact?.email}
LinkedIn: ${portfolio.contact?.linkedin}
GitHub: ${portfolio.contact?.github}
${portfolio.contact?.website ? `Website: ${portfolio.contact.website}` : ''}
`
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? 'anonymous'

    const redis = getRedis()
    if (redis) {
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 m'),
        prefix:  'portfolio_chat',
      })
      const { success } = await ratelimit.limit(ip)
      if (!success) {
        return NextResponse.json(
          { error: "You've sent too many messages. Please wait a few minutes before sending more." },
          { status: 429 }
        )
      }
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 })
    }

    const portfolio = await getPortfolioData()
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio data unavailable.' }, { status: 500 })
    }

    /**
     * WHY new GoogleGenAI SDK:
     * @google/generative-ai was deprecated November 2025.
     * The new @google/genai SDK is the official replacement
     * with a cleaner API and support for latest models.
     */
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

    /**
     * WHY filter leading assistant messages:
     * Gemini requires conversation history to start with a
     * user message. We strip the initial greeting message
     * (which is from the assistant) before building history.
     */
    const firstUserIndex = messages.findIndex((m: any) => m.role === 'user')
    if (firstUserIndex === -1) {
      return NextResponse.json({ error: 'No user message found.' }, { status: 400 })
    }

    const trimmed    = messages.slice(firstUserIndex)
    const lastMessage = trimmed[trimmed.length - 1]
    const history    = trimmed.slice(0, -1).map((msg: any) => ({
      role:  msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const chat = ai.chats.create({
      model:  'gemini-3.1-flash-lite',
      config: {
        systemInstruction: buildSystemPrompt(portfolio),
      },
      history,
    })
    
    const result = await chat.sendMessage({ message: lastMessage.content })
    const text   = result.text

    return NextResponse.json({ message: text })

  } catch (error: any) {
    console.error('Chat API error:', error)

    /**
     * WHY specific error messages:
     * Generic "something went wrong" is unhelpful and makes
     * the bot look broken. Specific messages tell the visitor
     * exactly what happened and what to do - builds trust
     * even when things aren't working.
     */
    const message = error?.message ?? ''

    if (message.includes('429') || message.includes('quota') || message.includes('Too Many Requests')) {
      return NextResponse.json(
        { error: 'The AI assistant has reached its daily request limit. Please try again tomorrow - the quota resets at midnight.' },
        { status: 429 }
      )
    }

    if (message.includes('API_KEY') || message.includes('403')) {
      return NextResponse.json(
        { error: 'The AI assistant is temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again in a moment.' },
      { status: 500 }
    )
  }
}