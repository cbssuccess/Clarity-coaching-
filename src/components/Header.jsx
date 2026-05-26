import React, { useState } from 'react'

export default function Header({
  focusMode, onToggleFocus, focusCount, onSetFocusCount, taskCount,
  syncId, syncStatus, onChangeSyncId,
}) {
  const [showSync, setShowSync] = useState(false)
  const [inputCode, setInputCode] = useState('')
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(syncId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const applyCode = () => {
    const code = inputCode.trim()
    if (code && code !== syncId) {
      onChangeSyncId(code)
      setInputCode('')
      setShowSync(false)
    }
  }

  const syncIcon = () => {
    if (syncStatus === 'syncing') {
      return (
        <svg className="w-4 h-4 animate-spin text-pastel-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
    if (syncStatus === 'error') {
      return (
        <svg className="w-4 h-4 text-pastel-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    }
    return (
      <svg className="w-4 h-4 text-pastel-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-app-bg/90 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pastel-lavender/30 to-pastel-rose/30 flex items-center justify-center border border-pastel-lavender/20">
            <span className="text-base">✨</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary leading-none">Clarity</h1>
            <p className="text-xs text-text-muted mt-0.5">your calm task space</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync button */}
          <div className="relative">
            <button
              onClick={() => setShowSync(v => !v)}
              title={syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Sync error'}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface border border-border/50 hover:border-border transition-all duration-150"
            >
              {syncIcon()}
            </button>

            {showSync && (
              <div className="absolute right-0 top-10 z-50 w-72 bg-card-bg border border-border/60 rounded-2xl shadow-2xl p-4 animate-slide-up">
                <p className="text-xs font-semibold text-text-primary mb-1">Your sync code</p>
                <p className="text-[10px] text-text-muted mb-3 leading-relaxed">
                  Copy this code and enter it on any other device to sync your tasks.
                </p>
                <div className="flex gap-2 mb-4">
                  <code className="flex-1 bg-surface border border-border/50 rounded-xl px-3 py-2 text-xs text-pastel-lavender font-mono break-all">
                    {syncId}
                  </code>
                  <button
                    onClick={copyCode}
                    className="px-3 rounded-xl bg-pastel-lavender/15 border border-pastel-lavender/30 text-pastel-lavender text-xs font-medium hover:bg-pastel-lavender/25 transition-all duration-150"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <p className="text-xs font-semibold text-text-primary mb-2">Use a different device's code</p>
                <div className="flex gap-2">
                  <input
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value)}
                    placeholder="Paste sync code here"
                    className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary placeholder-text-muted outline-none focus:border-pastel-lavender/60"
                  />
                  <button
                    onClick={applyCode}
                    disabled={!inputCode.trim()}
                    className="px-3 rounded-xl bg-surface border border-border text-text-secondary text-xs font-medium hover:border-pastel-lavender/40 hover:text-pastel-lavender disabled:opacity-40 transition-all duration-150"
                  >
                    Load
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Focus count selector */}
          {!focusMode && (
            <div className="flex items-center gap-1 bg-surface rounded-lg p-1 border border-border/50">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => onSetFocusCount(n)}
                  className={`w-7 h-7 rounded-md text-sm font-medium transition-all duration-150 ${
                    focusCount === n
                      ? 'bg-pastel-lavender/20 text-pastel-lavender border border-pastel-lavender/30'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                  title={`Show ${n} task${n > 1 ? 's' : ''} in Focus Mode`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={onToggleFocus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95
              ${focusMode
                ? 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border/80'
                : 'bg-gradient-to-r from-pastel-lavender/15 to-pastel-sky/10 border border-pastel-lavender/30 text-pastel-lavender hover:from-pastel-lavender/25 hover:to-pastel-sky/20 hover:border-pastel-lavender/50'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {focusMode
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                : <><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>
              }
            </svg>
            {focusMode ? 'Show All' : 'Focus Mode'}
          </button>
        </div>
      </div>
    </header>
  )
}
