import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header.jsx'
import TaskCard from './components/TaskCard.jsx'
import TaskForm from './components/TaskForm.jsx'
import FocusMode from './components/FocusMode.jsx'
import ChatPanel from './components/ChatPanel.jsx'

const STORAGE_KEY = 'clarity-tasks-v1'
const PASTEL_COLORS = ['rose', 'lavender', 'mint', 'peach', 'sky', 'yellow']

// ─── helpers ─────────────────────────────────────────────────────────────────

function nextColor(tasks) {
  // cycle through pastel colors based on existing task count
  return PASTEL_COLORS[tasks.length % PASTEL_COLORS.length]
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // ignore storage errors
  }
}

function priorityOrder(p) {
  return p === 'must' ? 0 : p === 'should' ? 1 : 2
}

function selectFocusTasks(tasks, count) {
  const pending = tasks.filter(t => !t.done)

  // Pinned first
  const pinned = pending.filter(t => t.pinned)
  if (pinned.length > 0) {
    // Sort pinned by priority then by anxiety ascending (lower anxiety = easier win)
    const sorted = pinned.slice().sort((a, b) => {
      const pd = priorityOrder(a.priority) - priorityOrder(b.priority)
      if (pd !== 0) return pd
      return a.anxiety - b.anxiety
    })
    return sorted.slice(0, count)
  }

  // No pins — sort by priority then by anxiety ascending
  const sorted = pending.slice().sort((a, b) => {
    const pd = priorityOrder(a.priority) - priorityOrder(b.priority)
    if (pd !== 0) return pd
    return a.anxiety - b.anxiety
  })
  return sorted.slice(0, count)
}

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const CLAUDE_MODEL = 'claude-haiku-4-5-20251001'

// ─── main component ──────────────────────────────────────────────────────────

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks())
  const [showForm, setShowForm] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [focusCount, setFocusCount] = useState(2)
  const [chatOpen, setChatOpen] = useState(false)
  const [breakingDownId, setBreakingDownId] = useState(null)

  // Persist on change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  // ── task actions ─────────────────────────────────────────────────────────

  const addTask = useCallback((fields) => {
    const newTask = {
      id: crypto.randomUUID(),
      name: fields.name,
      notes: fields.notes || '',
      anxiety: fields.anxiety,
      priority: fields.priority,
      pinned: false,
      done: false,
      steps: [],
      color: nextColor(tasks),
      createdAt: Date.now(),
    }
    setTasks(prev => [newTask, ...prev])
  }, [tasks])

  const toggleDone = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  const togglePin = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── break it down ─────────────────────────────────────────────────────────

  const breakItDown = useCallback(async (id) => {
    if (!API_KEY) {
      // Without API key, use a helpful fallback
      const task = tasks.find(t => t.id === id)
      if (!task) return
      const fallbackSteps = [
        `Write down exactly what "${task.name}" means to you`,
        'Identify the single next physical action',
        'Do just that one action for 5 minutes',
        'Decide what the next step is after that',
      ]
      setTasks(prev => prev.map(t => t.id === id ? { ...t, steps: fallbackSteps } : t))
      return
    }

    setBreakingDownId(id)
    const task = tasks.find(t => t.id === id)
    if (!task) { setBreakingDownId(null); return }

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
          model: CLAUDE_MODEL,
          max_tokens: 400,
          system: `You are a helpful assistant for someone with GAD and ADHD. Break tasks into tiny, non-overwhelming steps.
Rules:
- Return ONLY a JSON array of strings (step descriptions)
- 3 to 6 steps maximum
- Each step should be very small and concrete — something completable in under 10 minutes
- Use plain language, no jargon
- No numbering in the step text itself
- Don't include anything other than the JSON array
Example output: ["Open your email app", "Search for the email from Jane", "Read it once without replying", "Write one sentence draft reply"]`,
          messages: [
            {
              role: 'user',
              content: `Break this task into small steps: "${task.name}"${task.notes ? `\nContext: ${task.notes}` : ''}`,
            },
          ],
        }),
      })

      if (!response.ok) throw new Error('API error')

      const data = await response.json()
      const text = data.content?.[0]?.text || '[]'

      // Extract JSON array from response (handle any surrounding text)
      const match = text.match(/\[[\s\S]*\]/)
      const steps = match ? JSON.parse(match[0]) : []

      if (Array.isArray(steps) && steps.length > 0) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, steps } : t))
      }
    } catch (err) {
      // Fallback gracefully
      const fallback = [
        `Figure out exactly what "${task.name}" requires`,
        'Identify the first tiny action',
        'Set a 10-minute timer and start',
        'Check in with yourself after',
      ]
      setTasks(prev => prev.map(t => t.id === id ? { ...t, steps: fallback } : t))
    } finally {
      setBreakingDownId(null)
    }
  }, [tasks])

  // ── derived state ──────────────────────────────────────────────────────────

  const pendingTasks = tasks.filter(t => !t.done)
  const doneTasks = tasks.filter(t => t.done)
  const focusTasks = selectFocusTasks(tasks, focusCount)

  // Sort display: pinned first, then by priority, then undone before done
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return priorityOrder(a.priority) - priorityOrder(b.priority)
  })

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-app">
      <Header
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode(v => !v)}
        focusCount={focusCount}
        onSetFocusCount={setFocusCount}
        taskCount={tasks.length}
      />

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Add task button / hero area */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="w-full group flex items-center gap-3 p-4 rounded-2xl
                       border border-dashed border-border/50 hover:border-pastel-lavender/40
                       bg-card-bg/50 hover:bg-card-bg
                       text-text-muted hover:text-pastel-lavender
                       transition-all duration-200 active:scale-[0.99]"
          >
            <div className="w-8 h-8 rounded-xl bg-surface group-hover:bg-pastel-lavender/10 border border-border/50 group-hover:border-pastel-lavender/30
                            flex items-center justify-center transition-all duration-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium">Add a new task</span>
          </button>
        </div>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pastel-lavender/15 to-pastel-rose/10 border border-pastel-lavender/20 flex items-center justify-center mb-4 animate-float">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-base font-semibold text-text-primary mb-2">Nothing here yet</h2>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
              Add your first task above. You don't have to tackle everything — just what feels right for today.
            </p>
          </div>
        )}

        {/* Task list */}
        {tasks.length > 0 && (
          <div className="space-y-3">
            {/* Pending tasks */}
            {pendingTasks.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    To do
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-surface text-text-muted text-[10px] border border-border/40">
                    {pendingTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {sortedTasks.filter(t => !t.done).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleDone={toggleDone}
                      onTogglePin={togglePin}
                      onDelete={deleteTask}
                      onBreakDown={breakItDown}
                      isBreakingDown={breakingDownId === task.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Done tasks */}
            {doneTasks.length > 0 && (
              <section className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Completed
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-pastel-mint/10 text-pastel-mint text-[10px] border border-pastel-mint/20">
                    {doneTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {sortedTasks.filter(t => t.done).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleDone={toggleDone}
                      onTogglePin={togglePin}
                      onDelete={deleteTask}
                      onBreakDown={breakItDown}
                      isBreakingDown={breakingDownId === task.id}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Bottom padding so FAB doesn't overlap last task */}
        <div className="h-24" />
      </main>

      {/* Focus Mode overlay */}
      {focusMode && (
        <FocusMode
          tasks={focusTasks}
          onToggleDone={toggleDone}
          onExit={() => setFocusMode(false)}
        />
      )}

      {/* Add task modal */}
      {showForm && (
        <TaskForm
          onAdd={addTask}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Floating AI chat button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl
                     bg-gradient-to-br from-pastel-lavender/25 to-pastel-rose/20
                     border border-pastel-lavender/40
                     text-pastel-lavender shadow-glow-lavender
                     hover:from-pastel-lavender/35 hover:to-pastel-rose/30
                     hover:border-pastel-lavender/60 hover:shadow-lg
                     flex items-center justify-center
                     transition-all duration-200 active:scale-90 animate-pulse-soft"
          title="Chat with your AI coach"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {chatOpen && (
        <ChatPanel
          tasks={tasks}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  )
}
