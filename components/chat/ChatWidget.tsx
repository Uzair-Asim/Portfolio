'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  role:    'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'What technologies does Uzair know?',
  'Tell me about his experience',
  'What projects has he built?',
  'Is he available for hire?',
]

/**
 * WHY a custom bot SVG instead of lucide's Bot icon:
 * We want a friendly, distinct bot face that fits the
 * portfolio's aesthetic. The lucide Bot icon is too generic.
 * A custom SVG gives us precise control over the look.
 */
function BotIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <rect x="3" y="6" width="18" height="13" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
      {/* Mouth */}
      <path d="M9 15.5 Q12 17.5 15 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Antenna */}
      <line x1="12" y1="6" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="2.5" r="1" fill="currentColor" />
      {/* Ears */}
      <rect x="1" y="9" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="21" y="9" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  )
}

export default function ChatWidget({ enabled = true }: { enabled?: boolean }) {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  /**
   * WHY scroll to bottom on new message:
   * When a new message arrives the conversation grows downward.
   * Auto-scrolling keeps the latest message visible so the
   * visitor doesn't have to scroll manually after every reply.
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role:    'assistant',
        content: "Hi! I'm an AI assistant for Uzair. Ask me anything about his experience, skills, or projects.",
      }])
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return
    setError('')

    const userMessage: Message = { role: 'user', content: content.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: updatedMessages }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.message },
      ])
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  if (!enabled) return null

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{   opacity: 0, y: 20, scale: 0.95   }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="
              fixed bottom-24 right-6 z-50
              w-[360px] max-w-[calc(100vw-3rem)]
              bg-[var(--color-cream-50)]
              rounded-2xl
              border border-[var(--color-cream-300)]
              shadow-2xl shadow-black/10
              flex flex-col
              overflow-hidden
            "
            style={{ height: '520px' }}
          >
            {/**
             * WHY cream/orange header instead of navy:
             * The navy header clashed with the portfolio's warm
             * cream and clay palette. Orange header with cream
             * text feels cohesive and distinctly on-brand.
             */}
            {/* Header */}
            <div className="
              flex items-center justify-between
              px-5 py-4
              bg-[var(--color-clay-orange)]
              flex-shrink-0
            ">
              <div className="flex items-center gap-3">
                {/* Bot avatar */}
                <div className="
                  w-9 h-9 rounded-xl
                  bg-white/20
                  flex items-center justify-center
                  text-white
                ">
                  <BotIcon size={20} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Uzair's Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                    <span className="font-mono text-[10px] text-white/70">AI-powered</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[var(--color-cream-100)]">

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot icon next to assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="
                      w-6 h-6 rounded-lg mr-2 mt-0.5
                      bg-[var(--color-clay-navy)]/15
                      text-[var(--color-clay-orange)]
                      flex items-center justify-center
                      flex-shrink-0
                    ">
                      <BotIcon size={14} />
                    </div>
                  )}
                    <div className={`
                      max-w-[75%] px-4 py-2.5 rounded-2xl
                      text-sm font-semibold leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-[var(--color-clay-navy)] text-white rounded-br-sm'
                        : 'bg-white text-[var(--color-clay-navy)] rounded-bl-sm border border-[var(--color-cream-300)]'
                      }
                    `}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          components={{
                            /**
                             * WHY custom components:
                             * react-markdown renders standard HTML by default.
                             * We override each element to apply our design system
                             * classes so the markdown looks consistent with the
                             * rest of the portfolio rather than browser defaults.
                             */
                            p:      ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-black text-[var(--color-clay-navy)]">{children}</strong>,
                            ul:     ({ children }) => <ul className="mt-1 mb-2 flex flex-col gap-1">{children}</ul>,
                            ol:     ({ children }) => <ol className="mt-1 mb-2 flex flex-col gap-1 list-decimal list-inside">{children}</ol>,
                            li:     ({ children }) => (
                              <li className="flex items-start gap-2">
                                <span className="text-[var(--color-clay-orange)] mt-0.5 flex-shrink-0 text-xs">▸</span>
                                <span>{children}</span>
                              </li>
                            ),
                            h3: ({ children }) => <h3 className="font-black text-[var(--color-clay-navy)] mb-1 mt-2">{children}</h3>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                </div>
              ))}

              {/* Suggested questions */}
              {messages.length === 1 && (
                <div className="flex flex-col gap-2 mt-1">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="
                        text-left text-xs font-semibold
                        text-[var(--color-clay-muted)]
                        hover:text-[var(--color-clay-orange)]
                        bg-white
                        hover:bg-[var(--color-cream-50)]
                        border border-[var(--color-cream-300)]
                        hover:border-[var(--color-clay-orange)]/40
                        px-3 py-2 rounded-xl
                        transition-all duration-200
                        cursor-pointer
                      "
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="
                    w-6 h-6 rounded-lg
                    bg-[var(--color-clay-navy)]/15
                    text-[var(--color-clay-orange)]
                    flex items-center justify-center
                    flex-shrink-0
                  ">
                    <BotIcon size={14} />
                  </div>
                  <div className="
                    bg-white border border-[var(--color-cream-300)]
                    px-4 py-3 rounded-2xl rounded-bl-sm
                    flex items-center gap-2
                  ">
                    <Loader2 size={14} className="animate-spin text-[var(--color-clay-orange)]" />
                    <span className="text-xs font-semibold text-[var(--color-clay-muted)]">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="
                  text-xs font-semibold text-red-500
                  bg-red-50 border border-red-100
                  px-3 py-2 rounded-xl text-center
                ">
                  {error}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="
              flex items-center gap-2
              px-4 py-3
              border-t border-[var(--color-cream-300)]
              bg-[var(--color-cream-50)]
              flex-shrink-0
            ">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={loading}
                className="
                  flex-1 px-4 py-2.5 rounded-xl
                  border border-[var(--color-cream-300)]
                  focus:border-[var(--color-clay-orange)]
                  focus:outline-none
                  text-sm font-semibold
                  text-[var(--color-clay-navy)]
                  bg-white
                  transition-colors
                  disabled:opacity-50
                  placeholder:text-[var(--color-clay-muted)]/40
                "
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="
                  w-10 h-10 rounded-xl flex-shrink-0
                  bg-[var(--color-clay-orange)]
                  hover:bg-[var(--color-clay-orange-dark)]
                  disabled:opacity-40 disabled:cursor-not-allowed
                  flex items-center justify-center
                  text-white transition-colors cursor-pointer
                "
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/**
       * WHY orange toggle button not navy:
       * The floating button is the entry point to the chat.
       * Orange is the portfolio's primary accent and draws
       * the eye naturally. Navy blended too much with dark
       * sections of the page. Orange pops on both cream
       * and dark backgrounds.
       */}
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setOpen(p => !p)}
        className="
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-[var(--color-clay-navy)]
          hover:bg-[var(--color-clay-orange)]
          text-white
          flex items-center justify-center
          shadow-lg shadow-orange-900/20
          transition-colors duration-300
          cursor-pointer
        "
        title="Chat with Uzair's AI assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate: 90,  opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90,  opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BotIcon size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}