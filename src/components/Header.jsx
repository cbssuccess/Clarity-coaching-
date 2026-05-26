import React from 'react'

export default function Header({ focusMode, onToggleFocus, focusCount, onSetFocusCount, taskCount }) {
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

        {/* Center: task count when not in focus */}
        {!focusMode && taskCount > 0 && (
          <span className="text-xs text-text-muted hidden sm:block">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
        )}

        {/* Focus mode controls */}
        <div className="flex items-center gap-2">
          {!focusMode ? (
            <>
              {/* Focus count selector */}
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

              <button
                onClick={onToggleFocus}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
                           bg-gradient-to-r from-pastel-lavender/15 to-pastel-sky/10
                           border border-pastel-lavender/30 text-pastel-lavender
                           hover:from-pastel-lavender/25 hover:to-pastel-sky/20
                           hover:border-pastel-lavender/50 transition-all duration-200 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                Focus Mode
              </button>
            </>
          ) : (
            <button
              onClick={onToggleFocus}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
                         bg-surface border border-border text-text-secondary
                         hover:text-text-primary hover:border-border/80 transition-all duration-200 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Show All
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
