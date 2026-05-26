import React, { useState, useRef } from 'react'
import confetti from 'canvas-confetti'

const PASTEL_COLORS = ['rose', 'lavender', 'mint', 'peach', 'sky', 'yellow']

const ANXIETY_EMOJIS = { 1: '😌', 2: '😐', 3: '😟', 4: '😰', 5: '😱' }
const ANXIETY_LABELS = { 1: 'Calm', 2: 'Mild', 3: 'Moderate', 4: 'High', 5: 'Overwhelming' }

const PRIORITY_META = {
  must:    { label: 'Must Do',    textColor: 'text-pastel-rose',    bg: 'bg-pastel-rose/10',    border: 'border-pastel-rose/30'    },
  should:  { label: 'Should Do', textColor: 'text-pastel-peach',   bg: 'bg-pastel-peach/10',   border: 'border-pastel-peach/30'   },
  someday: { label: 'Someday',   textColor: 'text-pastel-sky',     bg: 'bg-pastel-sky/10',     border: 'border-pastel-sky/30'     },
}

const CELEBRATION_MESSAGES = [
  "Nice work! One less thing to worry about. 🌟",
  "You did it! That's the good stuff. ✨",
  "Boom! Crossed off. You're doing great. 🎉",
  "Task complete — you should feel proud. 💫",
  "Done! Every little step counts. 🌸",
  "That's progress. Keep going, you've got this. 🌿",
]

function getColorClass(colorName) {
  const map = {
    rose:     'pastel-border-rose',
    lavender: 'pastel-border-lavender',
    mint:     'pastel-border-mint',
    peach:    'pastel-border-peach',
    sky:      'pastel-border-sky',
    yellow:   'pastel-border-yellow',
  }
  return map[colorName] || 'pastel-border-lavender'
}

export default function TaskCard({ task, onToggleDone, onTogglePin, onDelete, onBreakDown, isBreakingDown }) {
  const [expanded, setExpanded] = useState(false)
  const [celebration, setCelebration] = useState(null)
  const [justDone, setJustDone] = useState(false)
  const cardRef = useRef(null)

  const colorClass = getColorClass(task.color)
  const priorityMeta = PRIORITY_META[task.priority] || PRIORITY_META.should

  const handleDone = () => {
    if (!task.done) {
      // Trigger confetti
      const rect = cardRef.current?.getBoundingClientRect()
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x, y },
        colors: ['#f4b8c1', '#c4b5fd', '#a7f3d0', '#fcd5b5', '#bae6fd', '#fef08a'],
        ticks: 180,
        gravity: 0.9,
        scalar: 0.9,
      })

      const msg = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]
      setCelebration(msg)
      setJustDone(true)
      setTimeout(() => setCelebration(null), 3500)
      setTimeout(() => setJustDone(false), 500)
    }
    onToggleDone(task.id)
  }

  return (
    <div
      ref={cardRef}
      className={`card-base ${colorClass} overflow-hidden animate-slide-up group
        ${task.done ? 'opacity-50' : ''}
        ${justDone ? 'animate-celebration' : ''}
      `}
    >
      {/* Celebration banner */}
      {celebration && (
        <div className="px-4 py-2 bg-pastel-lavender/10 border-b border-pastel-lavender/20 text-xs text-pastel-lavender animate-fade-in">
          {celebration}
        </div>
      )}

      {/* Main card body */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleDone}
            className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${task.done
                ? 'bg-pastel-mint/30 border-pastel-mint'
                : 'border-border hover:border-pastel-lavender/60'
              }`}
            title={task.done ? 'Mark incomplete' : 'Mark done'}
          >
            {task.done && (
              <svg className="w-3 h-3 text-pastel-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top row: name + actions */}
            <div className="flex items-start justify-between gap-2">
              <span className={`text-sm font-medium leading-snug ${task.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                {task.name}
              </span>

              {/* Action buttons — shown on hover or always visible on touch */}
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {/* Pin button */}
                <button
                  onClick={() => onTogglePin(task.id)}
                  title={task.pinned ? 'Unpin from Focus Mode' : 'Pin to Focus Mode'}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90
                    ${task.pinned
                      ? 'text-pastel-yellow bg-pastel-yellow/15 border border-pastel-yellow/30'
                      : 'text-text-muted hover:text-pastel-yellow hover:bg-surface'
                    }`}
                >
                  <svg className="w-3.5 h-3.5" fill={task.pinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => onDelete(task.id)}
                  title="Delete task"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-pastel-rose hover:bg-surface transition-all duration-150 active:scale-90"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {/* Priority badge */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${priorityMeta.textColor} ${priorityMeta.bg} ${priorityMeta.border}`}>
                {priorityMeta.label}
              </span>

              {/* Anxiety badge */}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-text-muted bg-surface border border-border/40"
                title={`Anxiety: ${ANXIETY_LABELS[task.anxiety]}`}
              >
                <span>{ANXIETY_EMOJIS[task.anxiety]}</span>
                <span>{ANXIETY_LABELS[task.anxiety]}</span>
              </span>

              {/* Pinned indicator */}
              {task.pinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-pastel-yellow bg-pastel-yellow/10 border border-pastel-yellow/20">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Pinned
                </span>
              )}
            </div>

            {/* Notes (if any) */}
            {task.notes && (
              <p className="mt-2 text-xs text-text-secondary leading-relaxed line-clamp-2">
                {task.notes}
              </p>
            )}
          </div>
        </div>

        {/* Bottom actions */}
        {!task.done && (
          <div className="mt-3 flex items-center gap-2">
            {/* Break it down button */}
            <button
              onClick={() => {
                onBreakDown(task.id)
                setExpanded(true)
              }}
              disabled={isBreakingDown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         text-text-secondary border border-border/40 hover:border-pastel-lavender/40
                         hover:text-pastel-lavender hover:bg-pastel-lavender/5
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-150 active:scale-95"
            >
              {isBreakingDown ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Breaking down...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8" />
                  </svg>
                  Break it down
                </>
              )}
            </button>

            {/* Toggle steps if they exist */}
            {task.steps && task.steps.length > 0 && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary transition-colors duration-150"
              >
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {task.steps.length} step{task.steps.length !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Steps panel */}
      {task.steps && task.steps.length > 0 && expanded && (
        <div className="px-4 pb-4 pt-0 animate-fade-in">
          <div className="pl-8 border-l-2 border-border/30 ml-2.5 space-y-2">
            {task.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-surface border border-border/50 flex items-center justify-center text-[9px] font-semibold text-text-muted">
                  {i + 1}
                </span>
                <span className="text-xs text-text-secondary leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
