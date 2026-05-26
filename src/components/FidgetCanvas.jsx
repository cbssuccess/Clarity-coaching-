import React, { useEffect, useRef, useCallback } from 'react'

const PASTEL_COLORS = [
  { r: 244, g: 184, b: 193 }, // rose
  { r: 196, g: 181, b: 253 }, // lavender
  { r: 167, g: 243, b: 208 }, // mint
  { r: 252, g: 213, b: 181 }, // peach
  { r: 186, g: 230, b: 253 }, // sky
  { r: 254, g: 240, b: 138 }, // yellow
]

function randomColor() {
  return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)]
}

export default function FidgetCanvas({ onClose }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    particles: [],
    currentColor: randomColor(),
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    animId: null,
  })

  // Resize canvas to fill window
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  // Spawn sparkle burst at (x, y)
  function spawnSparkles(x, y, color) {
    const count = 18
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const speed = 1.5 + Math.random() * 3.5
      stateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        decay: 0.025 + Math.random() * 0.02,
        color,
        type: 'sparkle',
      })
    }
  }

  // Add trail point
  function addTrailPoint(x, y, color) {
    stateRef.current.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 5 + Math.random() * 4,
      alpha: 0.85,
      decay: 0.008 + Math.random() * 0.006,
      color,
      type: 'trail',
    })
  }

  // Animation loop
  function animate() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = stateRef.current

    // Fade background slightly each frame for trail ghost effect
    ctx.fillStyle = 'rgba(19, 19, 31, 0.18)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const p of s.particles) {
      const { r, g, b } = p.color
      ctx.save()
      ctx.globalAlpha = p.alpha

      if (p.type === 'sparkle') {
        // Sparkle: small star-like dot with glow
        ctx.shadowBlur = 12
        ctx.shadowColor = `rgba(${r},${g},${b},${p.alpha})`
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Trail: soft glowing blob
        ctx.shadowBlur = 20
        ctx.shadowColor = `rgba(${r},${g},${b},0.5)`
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5)
        grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // Update
      p.x += p.vx
      p.y += p.vy
      p.alpha -= p.decay
    }

    // Remove dead particles
    s.particles = s.particles.filter(p => p.alpha > 0)

    s.animId = requestAnimationFrame(animate)
  }

  // ── pointer handlers ──────────────────────────────────────────────────────

  function getPos(e) {
    if (e.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  const handleDown = useCallback((e) => {
    e.preventDefault()
    const { x, y } = getPos(e)
    const s = stateRef.current
    s.isDrawing = true
    s.lastX = x
    s.lastY = y
    s.currentColor = randomColor()
    spawnSparkles(x, y, s.currentColor)
  }, [])

  const handleMove = useCallback((e) => {
    e.preventDefault()
    const s = stateRef.current
    if (!s.isDrawing) return
    const { x, y } = getPos(e)

    // Interpolate points between last and current for smooth trail
    const dx = x - s.lastX
    const dy = y - s.lastY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const steps = Math.max(1, Math.floor(dist / 4))

    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      addTrailPoint(s.lastX + dx * t, s.lastY + dy * t, s.currentColor)
    }

    s.lastX = x
    s.lastY = y
  }, [])

  const handleUp = useCallback(() => {
    stateRef.current.isDrawing = false
  }, [])

  // ── lifecycle ─────────────────────────────────────────────────────────────

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#13131f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    stateRef.current.animId = requestAnimationFrame(animate)

    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(stateRef.current.animId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair touch-none"
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl
                   bg-surface/80 border border-border/60
                   text-text-secondary hover:text-text-primary
                   hover:bg-surface hover:border-pastel-lavender/40
                   flex items-center justify-center
                   transition-all duration-200 backdrop-blur-sm"
        title="Close (Esc)"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Clear button */}
      <button
        onClick={() => {
          stateRef.current.particles = []
          const canvas = canvasRef.current
          if (canvas) {
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#13131f'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
        }}
        className="absolute top-4 right-16 z-10 px-3 h-10 rounded-xl
                   bg-surface/80 border border-border/60
                   text-text-muted hover:text-text-secondary
                   hover:bg-surface hover:border-border
                   text-xs font-medium
                   transition-all duration-200 backdrop-blur-sm"
        title="Clear canvas"
      >
        Clear
      </button>

      {/* Hint text */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-text-muted/50 select-none pointer-events-none">
        draw, doodle, breathe
      </p>
    </div>
  )
}
