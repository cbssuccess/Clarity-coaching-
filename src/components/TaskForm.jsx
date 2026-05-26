import React, { useState, useEffect, useRef } from 'react'

const ANXIETY_LEVELS = [
  { value: 1, emoji: '😌', label: 'Calm' },
  { value: 2, emoji: '😐', label: 'Mild' },
  { value: 3, emoji: '😟', label: 'Moderate' },
  { value: 4, emoji: '😰', label: 'High' },
  { value: 5, emoji: '😱', label: 'Overwhelming' },
]

const PRIORITIES = [
  { value: 'must', label: 'Must Do', color: 'text-pastel-rose border-pastel-rose/40 bg-pastel-rose/10' },
  { value: 'should', label: 'Should Do', color: 'text-pastel-peach border-pastel-peach/40 bg-pastel-peach/10' },
  { value: 'someday', label: 'Someday', color: 'text-pastel-sky border-pastel-sky/40 bg-pastel-sky/10' },
]

export default function TaskForm({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [anxiety, setAnxiety] = useState(2)
  const [priority, setPriority] = useState('should')
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      notes: notes.trim(),
      anxiety,
      priority,
    })
    onClose()
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(19,19,31,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="animate-slide-up w-full max-w-md bg-card-bg rounded-2xl border border-border/60 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
          <h2 className="text-base font-semibold text-text-primary">Add a new task</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-all duration-150"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Task name */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
              Task name *
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="What do you need to do?"
              className="input-base"
              maxLength={120}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
              Notes <span className="text-text-muted normal-case">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any details, context, or reminders..."
              rows={2}
              className="input-base resize-none"
              maxLength={400}
            />
          </div>

          {/* Anxiety level */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
              How anxious does this feel?
            </label>
            <div className="flex gap-2">
              {ANXIETY_LEVELS.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setAnxiety(level.value)}
                  title={level.label}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition-all duration-150 ${
                    anxiety === level.value
                      ? 'bg-surface-2 border-pastel-lavender/50 shadow-glow-lavender scale-105'
                      : 'border-border/40 hover:border-border hover:bg-surface/50'
                  }`}
                >
                  <span className="text-xl">{level.emoji}</span>
                  <span className="text-[10px] text-text-muted">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all duration-150 active:scale-95 ${
                    priority === p.value ? p.color : 'border-border/40 text-text-muted hover:border-border hover:text-text-secondary'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-border/40 text-text-secondary hover:text-text-primary hover:border-border transition-all duration-150 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold
                         bg-gradient-to-r from-pastel-lavender/25 to-pastel-sky/20
                         border border-pastel-lavender/40 text-pastel-lavender
                         hover:from-pastel-lavender/35 hover:to-pastel-sky/30 hover:border-pastel-lavender/60
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-150 active:scale-95"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
