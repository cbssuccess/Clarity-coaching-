import React, { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

const ANXIETY_EMOJIS = { 1: '😌', 2: '😐', 3: '😟', 4: '😰', 5: '😱' }
const ANXIETY_LABELS = { 1: 'Calm', 2: 'Mild', 3: 'Moderate', 4: 'High', 5: 'Overwhelming' }

const PRIORITY_META = {
  must:    { label: 'Must Do',    textColor: 'text-pastel-rose',  bg: 'bg-pastel-rose/10',  border: 'border-pastel-rose/30'  },
  should:  { label: 'Should Do', textColor: 'text-pastel-peach', bg: 'bg-pastel-peach/10', border: 'border-pastel-peach/30' },
  someday: { label: 'Someday',   textColor: 'text-pastel-sky',   bg: 'bg-pastel-sky/10',   border: 'border-pastel-sky/30'   },
}

const PASTEL_GLOW = {
  rose:     'shadow-glow-rose border-pastel-rose/40',
  lavender: 'shadow-glow-lavender border-pastel-lavender/40',
  mint:     'shadow-glow-mint border-pastel-mint/40',
  peach:    'shadow-glow-peach border-pastel-peach/40',
  sky:      'shadow-glow-sky border-pastel-sky/40',
  yellow:   'shadow-glow-yellow border-pastel-yellow/40',
}

const PASTEL_TEXT = {
  rose:     'text-pastel-rose',
  lavender: 'text-pastel-lavender',
  mint:     'text-pastel-mint',
  peach:    'text-pastel-peach',
  sky:      'text-pastel-sky',
  yellow:   'text-pastel-yellow',
}

const PASTEL_BG = {
  rose:     'bg-pastel-rose/8',
  lavender: 'bg-pastel-lavender/8',
  mint:     'bg-pastel-mint/8',
  peach:    'bg-pastel-peach/8',
  sky:      'bg-pastel-sky/8',
  yellow:   'bg-pastel-yellow/8',
}

const FOCUS_AFFIRMATIONS = [
  "You only need to focus on this right now.",
  "One thing at a time. You've got this.",
  "These are the only things that matter right now.",
  "Small steps. You're already doing it.",
  "Just this. Everything else can wait.",
]

const CELEBRATION_MESSAGES = [
  "Beautiful. One less thing. 🌟",
  "You did it! That's real progress. ✨",
  "Done! That took courage. 💫",
  "One step closer. You're amazing. 🌸",
  "Knocked it out! Keep that momentum. 🌿",
]

export default function FocusMode({ tasks, onToggleDone, onExit }) {
  const affirmation = useRef(FOCUS_AFFIRMATIONS[Math.floor(Math.random() * FOCUS_AFFIRMATIONS.length)])

  const handleDone = (task) => {
    if (!task.done) {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#f4b8c1', '#c4b5fd', '#a7f3d0', '#fcd5b5', '#bae6fd', '#fef08a'],
        ticks: 220,
        gravity: 0.8,
        scalar: 1.0,
      })
    }
    onToggleDone(task.id)
  }

  // Escape exits focus mode
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onExit() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onExit])

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center p-6 bg-gradient-app animate-fade-in">
      {/* Ambient orbs — purely decorative */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pastel-lavender/4 blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-pastel-mint/4 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-pastel-rose/3 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Exit button — top right */}
      <button
        onClick={onExit}
        className="fixed top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-xl
                   bg-surface/80 border border-border/50 text-text-secondary text-sm font-medium
                   hover:text-text-primary hover:border-border transition-all duration-200 active:scale-95 backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Show All
      </button>

      {/* Header */}
      <div className="text-center mb-10 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/60 border border-border/40 backdrop-blur-sm mb-4">
          <svg className="w-3.5 h-3.5 text-pastel-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <span className="text-xs font-medium text-pastel-lavender">Focus Mode</span>
        </div>
        <p className="text-sm text-text-muted italic">{affirmation.current}</p>
      </div>

      {/* Task cards */}
      <div className="z-10 w-full max-w-lg space-y-4">
        {tasks.map((task, index) => {
          const colorGlow = PASTEL_GLOW[task.color] || PASTEL_GLOW.lavender
          const colorText = PASTEL_TEXT[task.color] || PASTEL_TEXT.lavender
          const colorBg = PASTEL_BG[task.color] || PASTEL_BG.lavender
          const priorityMeta = PRIORITY_META[task.priority] || PRIORITY_META.should

          return (
            <div
              key={task.id}
              className={`animate-slide-up rounded-2xl border bg-card-bg ${colorGlow} ${colorBg}
                transition-all duration-300 ${task.done ? 'opacity-50' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-5">
                {/* Top: number indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium ${colorText} opacity-70`}>
                    Task {index + 1} of {tasks.length}
                  </span>
                  {task.pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-pastel-yellow">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Pinned
                    </span>
                  )}
                </div>

                {/* Task name */}
                <h2 className={`text-xl font-semibold leading-snug mb-3
                  ${task.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                  {task.name}
                </h2>

                {/* Notes */}
                {task.notes && (
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed">{task.notes}</p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                    ${priorityMeta.textColor} ${priorityMeta.bg} ${priorityMeta.border}`}>
                    {priorityMeta.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-text-muted bg-surface border border-border/40">
                    <span>{ANXIETY_EMOJIS[task.anxiety]}</span>
                    <span>{ANXIETY_LABELS[task.anxiety]}</span>
                  </span>
                </div>

                {/* Steps if broken down */}
                {task.steps && task.steps.length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    {task.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-surface border border-border/50 flex items-center justify-center text-[9px] font-semibold text-text-muted">
                          {i + 1}
                        </span>
                        <span className="text-sm text-text-secondary leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Done button */}
                <button
                  onClick={() => handleDone(task)}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-98
                    ${task.done
                      ? 'bg-pastel-mint/20 border border-pastel-mint/40 text-pastel-mint cursor-pointer hover:bg-pastel-mint/10'
                      : `${colorBg} border ${colorGlow.split(' ')[0] ? '' : ''}
                         border-current ${colorText} hover:opacity-80`
                    }`}
                  style={task.done ? {} : {
                    borderColor: 'currentColor',
                    opacity: task.done ? undefined : 1,
                  }}
                >
                  {task.done ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Done! Tap to undo
                    </span>
                  ) : (
                    <span className={`flex items-center justify-center gap-2 ${colorText}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Mark Done
                    </span>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 z-10">
        <p className="text-xs text-text-muted text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/50 text-[10px]">Esc</kbd> or tap "Show All" to exit
        </p>
      </div>
    </div>
  )
}
