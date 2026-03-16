import { useEffect, useRef } from 'react'

const HEART_RES = 420 // points along the heart path

function heartPt(t: number, scale: number, cx: number, cy: number) {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  return { x: cx + x * scale, y: cy + y * scale }
}

type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number; hue: number }

export default function FinalCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2)

    const setup = () => {
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
    }
    setup()
    const ro = new ResizeObserver(setup)
    ro.observe(canvas)

    const DRAW_DELAY = 0.3
    const DRAW_DUR   = 2.0

    const sparks: Spark[] = []
    let lastSpawn = 0
    let raf = 0
    const t0 = performance.now()

    const drawNeonHeart = (progress: number, W: number, H: number, pulse: number) => {
      const cx    = W / 2
      const cy    = H * 0.48
      const scale = Math.min(W, H) / 52

      const pts = Math.floor(HEART_RES * progress)
      if (pts < 2) return

      ctx.beginPath()
      for (let i = 0; i <= pts; i++) {
        const t  = (i / HEART_RES) * Math.PI * 2
        const pt = heartPt(t, scale, cx, cy)
        i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
      }
      if (progress >= 1) ctx.closePath()

      ctx.lineCap  = 'round'
      ctx.lineJoin = 'round'

      // Neon glow layers using additive blending
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      const layers = [
        { w: 60 * dpr, a: 0.04, c: 'rgba(244,30,70,'  },
        { w: 32 * dpr, a: 0.10, c: 'rgba(244,63,94,'  },
        { w: 14 * dpr, a: 0.26, c: 'rgba(255,100,150,'},
        { w:  6 * dpr, a: 0.55, c: 'rgba(255,160,190,'},
      ]
      for (const l of layers) {
        ctx.strokeStyle = l.c + (l.a * pulse).toFixed(3) + ')'
        ctx.lineWidth   = l.w
        ctx.stroke()
      }
      ctx.restore()

      // Hot white core (non-additive, always visible)
      ctx.strokeStyle = `rgba(255,240,245,${(0.88 * pulse).toFixed(3)})`
      ctx.lineWidth   = 1.8 * dpr
      ctx.stroke()

      // Tip marker — bright dot at the drawing head
      if (progress < 1) {
        const tipT  = progress * Math.PI * 2
        const tip   = heartPt(tipT, scale, cx, cy)
        const gr    = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 14 * dpr)
        gr.addColorStop(0, 'rgba(255,255,255,0.95)')
        gr.addColorStop(0.4, 'rgba(255,120,160,0.5)')
        gr.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = gr
        ctx.fillRect(tip.x - 14 * dpr, tip.y - 14 * dpr, 28 * dpr, 28 * dpr)
        ctx.restore()
      }

      return { cx, cy, scale }
    }

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const elapsed = (performance.now() - t0) / 1000

      ctx.clearRect(0, 0, W, H)

      const prog  = Math.min(Math.max((elapsed - DRAW_DELAY) / DRAW_DUR, 0), 1)
      const pulse = prog >= 1 ? 1 + Math.sin(elapsed * 2.8) * 0.12 : 1

      // Central glow before drawing starts
      if (prog === 0) {
        const cx = W / 2
        const cy = H * 0.48
        const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22 * dpr)
        gr.addColorStop(0, 'rgba(255,255,255,0.95)')
        gr.addColorStop(0.35, 'rgba(244,63,94,0.55)')
        gr.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gr
        ctx.fillRect(0, 0, W, H)
      }

      drawNeonHeart(prog, W, H, pulse)

      // Spawn sparks from tip while drawing
      if (prog > 0 && prog < 1) {
        if (elapsed - lastSpawn > 0.038) {
          lastSpawn = elapsed
          const cx    = W / 2
          const cy    = H * 0.48
          const scale = Math.min(W, H) / 52
          const tipT  = prog * Math.PI * 2
          const tip   = heartPt(tipT, scale, cx, cy)
          for (let i = 0; i < 4; i++) {
            sparks.push({
              x: tip.x + (Math.random() - 0.5) * 8 * dpr,
              y: tip.y + (Math.random() - 0.5) * 8 * dpr,
              vx: (Math.random() - 0.5) * 4 * dpr,
              vy: (Math.random() - 0.5) * 4 * dpr,
              life: 1,
              size: (0.6 + Math.random() * 1.6) * dpr,
              hue:  330 + Math.random() * 70,
            })
          }
        }
      }

      // Draw + update sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x   += s.vx
        s.y   += s.vy
        s.vx  *= 0.90
        s.vy  *= 0.90
        s.life -= 0.022
        if (s.life <= 0) { sparks.splice(i, 1); continue }

        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${s.hue},100%,70%,${(s.life * 0.18).toFixed(3)})`
        ctx.fill()
        ctx.restore()

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${s.hue},100%,92%,${(s.life * 0.85).toFixed(3)})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas ref={ref} className={className} style={{ width: '100%', height: '100%' }} />
  )
}
