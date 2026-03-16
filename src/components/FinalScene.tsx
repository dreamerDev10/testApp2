import { useEffect, useRef } from 'react'

const N            = 560
const GATHER_START = 0.7
const GATHER_DUR   = 2.4

function heartPt(t: number, scale: number, cx: number, cy: number) {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  return { x: cx + x * scale, y: cy + y * scale }
}

type Particle = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; hue: number; size: number; phi: number }
type Glitter  = { x: number; y: number; vy: number; vx: number; size: number; hue: number; a: number }
type Ring     = { r: number; a: number; dr: number; hue: number }

export default function FinalScene({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2)

    let pts: Particle[] = []
    let glitter: Glitter[] = []
    const rings: Ring[] = []

    const init = () => {
      const W = canvas.width
      const H = canvas.height
      const cx = W / 2
      const cy = H * 0.43
      const scale = Math.min(W, H) / 35

      pts = Array.from({ length: N }, (_, i) => {
        const t = (i / N) * Math.PI * 2
        const { x: tx, y: ty } = heartPt(t, scale, cx, cy)
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 3.5,
          vy: (Math.random() - 0.5) * 3.5,
          tx, ty,
          hue: Math.random() < 0.65 ? 328 + Math.random() * 52 : 268 + Math.random() * 42,
          size: 1.3 + Math.random() * 2.4,
          phi: Math.random() * Math.PI * 2,
        }
      })

      glitter = Array.from({ length: 80 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vy: 0.35 + Math.random() * 0.95,
        vx: (Math.random() - 0.5) * 0.4,
        size: 0.8 + Math.random() * 1.4,
        hue: ([40, 280, 338, 200] as number[])[Math.floor(Math.random() * 4)],
        a: Math.random(),
      }))

      rings.splice(0)
    }

    const setup = () => {
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      init()
    }
    setup()
    const ro = new ResizeObserver(setup)
    ro.observe(canvas)

    let raf = 0
    const t0 = performance.now()
    let lastRing = -99

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const elapsed = (performance.now() - t0) / 1000

      // Trail clear
      ctx.fillStyle = 'rgba(4,1,16,0.20)'
      ctx.fillRect(0, 0, W, H)

      const raw    = Math.min(Math.max((elapsed - GATHER_START) / GATHER_DUR, 0), 1)
      const ease   = 1 - Math.pow(1 - raw, 4)
      const formed = raw >= 1

      const cx    = W / 2
      const cy    = H * 0.43
      const sc    = Math.min(W, H) / 35
      const pulse = formed ? 1 + Math.sin(elapsed * 3.1) * 0.055 : 1

      // ── Nebula glow ──────────────────────────────────────────
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const nbR = sc * 22 * (0.35 + ease * 0.65)
      const nb  = ctx.createRadialGradient(cx, cy, 0, cx, cy, nbR)
      nb.addColorStop(0,    `rgba(244,40,90,${(0.09 * ease * pulse).toFixed(3)})`)
      nb.addColorStop(0.4,  `rgba(150,50,240,${(0.06 * ease).toFixed(3)})`)
      nb.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = nb
      ctx.fillRect(0, 0, W, H)
      ctx.restore()

      // ── Pulse rings ──────────────────────────────────────────
      if (formed && elapsed - lastRing > 1.85) {
        lastRing = elapsed
        rings.push({ r: sc * 3,  a: 0.70, dr: sc * 0.52, hue: 338 })
        rings.push({ r: sc * 5.5, a: 0.38, dr: sc * 0.44, hue: 285 })
      }
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i]
        rg.r += rg.dr
        rg.a -= 0.0085
        if (rg.a <= 0) { rings.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(cx, cy, rg.r, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${rg.hue},95%,65%,${rg.a.toFixed(3)})`
        ctx.lineWidth   = 1.8 * dpr
        ctx.stroke()
      }
      ctx.restore()

      // ── Glitter rain ─────────────────────────────────────────
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      for (const g of glitter) {
        g.x += g.vx
        g.y += g.vy * dpr
        g.a -= 0.0025
        if (g.a <= 0 || g.y > H + 10) {
          g.x = Math.random() * W
          g.y = -10
          g.a = 0.5 + Math.random() * 0.5
        }
        const sz = g.size * dpr
        ctx.beginPath()
        ctx.arc(g.x, g.y, sz * 3.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${g.hue},100%,80%,${(g.a * 0.11).toFixed(3)})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(g.x, g.y, sz, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${g.hue},100%,93%,${(g.a * 0.75).toFixed(3)})`
        ctx.fill()
      }
      ctx.restore()

      // ── Particles ────────────────────────────────────────────
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      for (const p of pts) {
        const ptx = cx + (p.tx - cx) * pulse
        const pty = cy + (p.ty - cy) * pulse

        const dx = ptx - p.x
        const dy = pty - p.y
        const att = 0.058 * ease + 0.0015
        p.vx = (p.vx + dx * att) * 0.86
        p.vy = (p.vy + dy * att) * 0.86
        p.x += p.vx
        p.y += p.vy

        const lit   = formed ? 68 + Math.sin(elapsed * 3.8 + p.phi) * 20 : 52 + ease * 18
        const alpha = formed ? 0.88 : 0.28 + ease * 0.55
        const sz    = p.size * dpr * (1 + ease * 0.75)

        // Glow halo
        ctx.beginPath()
        ctx.arc(p.x, p.y, sz * 4.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},88%,${lit}%,${(alpha * 0.09).toFixed(3)})`
        ctx.fill()

        // Bright core
        ctx.beginPath()
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},88%,${lit}%,${alpha.toFixed(3)})`
        ctx.fill()
      }
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={ref} className={className} style={{ width: '100%', height: '100%' }} />
}
