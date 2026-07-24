'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Msg = { from: 'bot' | 'user'; text: string }

const CANNED: { match: RegExp; reply: string }[] = [
  { match: /ship|delivery|deliver/i, reply: 'We offer free AU shipping on orders over $99. Most orders arrive in 3–5 business days.' },
  { match: /return|refund|exchange/i, reply: 'Returns are free within 30 days on unworn gear. Start one from your dashboard under Orders.' },
  { match: /size|fit|sizing/i, reply: 'Check the size guide on each product page. Our tees run true to size; wetsuits run snug.' },
  { match: /point|reward|loyal/i, reply: 'You earn 1 point per $1 spent, plus 50 points just for signing up. Redeem them at checkout.' },
  { match: /board|deck|surf|skate/i, reply: 'Tell me your skill level and I can point you to the right board — or browse the Shop to filter by spec.' },
]

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: 'Hey, welcome to Liminal. Ask me about shipping, returns, sizing, or rewards.' },
  ])

  function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const reply =
      CANNED.find((c) => c.match.test(text))?.reply ??
      'Good question — a human from the crew will follow up by email. In the meantime, try the Shop or your dashboard.'
    setMessages((prev) => [...prev, { from: 'user', text }, { from: 'bot', text: reply }])
    setInput('')
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <span className="font-heading text-sm uppercase tracking-wide">Liminal Help</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.from === 'bot'
                    ? 'bg-muted text-foreground'
                    : 'ml-auto bg-primary text-primary-foreground'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              aria-label="Chat message"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
      <Button
        onClick={() => setOpen((o) => !o)}
        size="icon"
        className="fixed bottom-4 right-4 z-50 size-14 rounded-full shadow-lg"
        aria-label="Open help chat"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </Button>
    </>
  )
}
