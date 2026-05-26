import React, { useState, useRef, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const MODEL = 'claude-haiku-4-5-20251001'

const QUICK_PROMPTS = [
  { label: 'Where do I start?', emoji: '🧭' },
  { label: "I'm overwhelmed",   emoji: '😵' },
  { label: 'Help me prep for a phone call', emoji: '📞' },
  { label: 'Encourage me', emoji: '💪' },
]

function buildSystemPrompt(tasks) {
  const pendingTasks = tasks.filter(t => !t.done)
  const doneTasks = tasks.filter(t => t.done)

  const PRIORITY_LABEL = { must: 'Must Do', should: 'Should Do', someday: 'Someday' }
  const ANXIETY_LABEL = { 1: 'calm', 2: 'mild', 3: 'moderate', 4: 'high', 5: 'overwhelming' }

  const taskLines = pendingTasks.map(t =>
    `- "${t.name}" (priority: ${PRIORITY_LABEL[t.priority] || t.priority}, anxiety: ${ANXIETY_LABEL[t.anxiety] || t.anxiety}${t.notes ? `, notes: "${t.notes}"` : ''}${t.pinned ? ', pinned' : ''})`
  ).join('\n')

  return `You are a warm, encouraging personal coach named Clara, helping someone who has GAD (Generalized Anxiety Disorder) and ADHD. Your role is to help them feel calm, supported, and able to take small steps forward.

Your communication style:
- Warm and human, never clinical or robotic
- Short, clear sentences — long paragraphs can feel overwhelming
- Acknowledge feelings first before jumping to solutions
- Break things into tiny, manageable steps when advising
- Celebrate small wins genuinely
- Never use toxic positivity ("just do it!", "easy!") — instead be realistic and compassionate
- Use light, encouraging language. Occasional gentle humor is fine.
- Keep responses concise (2-4 short paragraphs max unless they ask for more detail)

Current task context:
${pendingTasks.length === 0 ? 'The user has no pending tasks right now.' : `The user has ${pendingTasks.length} pending task${pendingTasks.length !== 1 ? 's' : ''}:\n${taskLines}`}
${doneTasks.length > 0 ? `\nCompleted today: ${doneTasks.length} task${doneTasks.length !== 1 ? 's' : ''} ✓` : ''}

Use this context to give relevant, personalized advice. If they ask where to start, help them identify the single best first task based on priority and anxiety level (start with lower anxiety tasks to build momentum).`
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pastel-lavender/30 to-pastel-rose/30 border border-pastel-lavender/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
          <span className="text-[10px]">✨</span>
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ai-message
          ${isUser
            ? 'bg-pastel-lavender/15 border border-pastel-lavender/25 text-text-primary rounded-br-sm'
            : 'bg-surface border border-border/50 text-text-secondary rounded-bl-sm'
          }`}
      >
        {msg.content.split('\n').map((line, i) => (
          <p key={i} className={line === '' ? 'mt-2' : ''}>{line}</p>
        ))}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pastel-lavender/30 to-pastel-rose/30 border border-pastel-lavender/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
        <span className="text-[10px]">✨</span>
      </div>
      <div className="bg-surface border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function ChatPanel({ tasks, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const hasApiKey = Boolean(API_KEY)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (hasApiKey) {
      inputRef.current?.focus()
    }
  }, [hasApiKey])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const sendMessage = async (text) => {
    if (!text.trim() || loading || !hasApiKey) return
    setError(null)

    const userMsg = { role: 'user', content: text.trim() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 600,
          system: buildSystemPrompt(tasks),
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `API error ${response.status}`)
      }

      const data = await response.json()
      const assistantText = data.content?.[0]?.text || "I'm here with you. What's on your mind?"

      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {/* Backdrop (click to close on mobile) */}
      <div
        className="fixed inset-0 z-40 sm:bg-transparent"
        style={{ background: 'rgba(19,19,31,0.5)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed bottom-0 right-0 z-50 w-full sm:w-96 h-[85vh] sm:h-[600px] sm:bottom-6 sm:right-6
                      bg-card-bg border border-border/60 sm:rounded-2xl rounded-t-2xl
                      flex flex-col shadow-2xl shadow-black/40 animate-slide-in-right overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pastel-lavender/25 to-pastel-rose/25 border border-pastel-lavender/30 flex items-center justify-center">
              <span className="text-base">✨</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Clara</h3>
              <p className="text-[10px] text-text-muted">your calm AI coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-all duration-150 active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!hasApiKey ? (
          /* No API key state */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border/50 flex items-center justify-center mb-4">
              <span className="text-2xl">🔑</span>
            </div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">AI Coach not connected</h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Add your Claude API key to enable Clara, your personal AI coach.
            </p>
            <div className="w-full bg-surface rounded-xl border border-border/50 p-4 text-left">
              <p className="text-[10px] font-medium text-text-muted uppercase tracking-wide mb-2">Setup instructions</p>
              <ol className="text-xs text-text-secondary space-y-1.5">
                <li>1. Create a <code className="bg-surface-2 px-1 rounded text-pastel-lavender">.env</code> file in the project root</li>
                <li>2. Add: <code className="bg-surface-2 px-1 rounded text-pastel-lavender text-[10px]">VITE_CLAUDE_API_KEY=sk-ant-...</code></li>
                <li>3. Restart the dev server</li>
              </ol>
            </div>
          </div>
        ) : (
          <>
            {/* Quick prompts */}
            {messages.length === 0 && (
              <div className="px-4 pt-4 pb-0 flex-shrink-0">
                <p className="text-xs text-text-muted mb-3 text-center">
                  Hi! I'm here to help you navigate your day. What do you need?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PROMPTS.map(qp => (
                    <button
                      key={qp.label}
                      onClick={() => sendMessage(qp.label)}
                      disabled={loading}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                                 bg-surface border border-border/40 text-text-secondary
                                 hover:border-pastel-lavender/40 hover:text-text-primary hover:bg-surface-2
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-150 active:scale-95 text-left"
                    >
                      <span className="text-sm flex-shrink-0">{qp.emoji}</span>
                      <span className="leading-tight">{qp.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
              {error && (
                <div className="flex justify-start animate-slide-up">
                  <div className="max-w-[85%] bg-pastel-rose/10 border border-pastel-rose/20 rounded-2xl px-4 py-3 text-xs text-pastel-rose">
                    <p className="font-medium mb-1">Hmm, something went wrong.</p>
                    <p className="text-pastel-rose/70">{error}</p>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-4 border-t border-border/40 flex-shrink-0"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(input)
                    }
                  }}
                  placeholder="Type a message... (Enter to send)"
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm
                             text-text-primary placeholder-text-muted outline-none resize-none
                             focus:border-pastel-lavender/60 focus:ring-2 focus:ring-pastel-lavender/10
                             disabled:opacity-50 transition-all duration-200"
                  style={{ maxHeight: '120px', overflowY: 'auto' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                             bg-gradient-to-br from-pastel-lavender/20 to-pastel-sky/15
                             border border-pastel-lavender/30 text-pastel-lavender
                             hover:from-pastel-lavender/30 hover:to-pastel-sky/25
                             disabled:opacity-40 disabled:cursor-not-allowed
                             transition-all duration-150 active:scale-90"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              {/* Quick prompts when already in conversation */}
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {QUICK_PROMPTS.slice(0, 3).map(qp => (
                    <button
                      key={qp.label}
                      type="button"
                      onClick={() => sendMessage(qp.label)}
                      disabled={loading}
                      className="px-2.5 py-1 rounded-full text-[10px] font-medium
                                 bg-surface border border-border/40 text-text-muted
                                 hover:border-pastel-lavender/30 hover:text-text-secondary
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-150 active:scale-95"
                    >
                      {qp.emoji} {qp.label}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </>
  )
}
