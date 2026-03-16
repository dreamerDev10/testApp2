import { useEffect, useRef } from 'react'

interface Blob {
  bx: number; by: number          // base position (0–1 of screen)
  r:  number                      // base radius (fraction of min dimension)
  rgb: [number, number, number]   // color
  ax: number; ay: number          // drift amplitude (0–1)
  fx: number; fy: number          // drift frequency
  phx: number; phy: number        // phase offset
  pr: number; pf: number          // pulse amplitude & frequency
}

const BLOBS: Blob[] = [
  { bx:0.28, by:0.38, r:0.52, rgb:[244, 63,  94],  ax:0.18, ay:0.14, fx:0.18, fy:0.22, phx:0.0, phy:1.5, pr:0.07, pf:0.65 },
  { bx:0.74, by:0.55, r:0.48, rgb:[168, 85,  247], ax:0.20, ay:0.18, fx:0.14, fy:0.17, phx:2.2, phy:0.9, pr:0.09, pf:0.50 },
  { bx:0.50, by:0.72, r:0.42, rgb:[236, 72,  153], ax:0.16, ay:0.20, fx:0.21, fy:0.14, phx:1.1, phy:3.3, pr:0.06, pf:0.80 },
  { bx:0.16, by:0.62, r:0.38, rgb:[124, 58,  237], ax:0.19, ay:0.15, fx:0.17, fy:0.20, phx:3.9, phy:0.6, pr:0.08, pf:0.58 },
  { bx:0.84, by:0.28, r:0.36, rgb:[217, 70,  239], ax:0.14, ay:0.22, fx:0.20, fy:0.16, phx:0.8, phy:2.5, pr:0.06, pf:0.72 },
  { bx:0.52, by:0.20, r:0.40, rgb:[244,114,  182], ax:0.18, ay:0.16, fx:0.16, fy:0.21, phx:2.0, phy:1.2, pr:0.07, pf:0.60 },
  { bx:0.08, by:0.30, r:0.30, rgb:[ 99,179,  237], ax:0.12, ay:0.18, fx:0.23, fy:0.18, phx:1.4, phy:4.1, pr:0.05, pf:0.88 },
]

export default function IntroCanvas({ className = '' }: { className?: string }) {
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

    let raf = 0
    const t0 = performance.now()

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const t = (performance.now() - t0) / 1000
      const D = Math.min(W, H)

      // ── Deep dark background ──────────────────────
      ctx.fillStyle = '#06010f'
      ctx.fillRect(0, 0, W, H)

      // ── Blobs (screen blend = additive glow) ──────
      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      for (const b of BLOBS) {
        const x = (b.bx + b.ax * Math.sin(b.fx * t + b.phx)) * W
        const y = (b.by + b.ay * Math.cos(b.fy * t + b.phy)) * H
        const r = (b.r  + b.pr * Math.sin(b.pf * t)) * D

        const [rr, gg, bb] = b.rgb

        // Soft body
        const body = ctx.createRadialGradient(x, y, 0, x, y, r)
        body.addColorStop(0,    `rgba(${rr},${gg},${bb},0.28)`)
        body.addColorStop(0.38, `rgba(${rr},${gg},${bb},0.16)`)
        body.addColorStop(0.70, `rgba(${rr},${gg},${bb},0.06)`)
        body.addColorStop(1,    `rgba(${rr},${gg},${bb},0)`)
        ctx.fillStyle = body
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()

        // Specular highlight — makes it look liquid/spherical
        const hAngle = t * 0.28 + b.phx
        const hx = x + r * 0.28 * Math.cos(hAngle)
        const hy = y + r * 0.22 * Math.sin(hAngle)
        const hr = r * 0.36
        const hl = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr)
        hl.addColorStop(0,   `rgba(255,255,255,0.14)`)
        hl.addColorStop(0.5, `rgba(255,255,255,0.05)`)
        hl.addColorStop(1,   `rgba(255,255,255,0)`)
        ctx.fillStyle = hl
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      // ── Vignette ──────────────────────────────────
      const vig = ctx.createRadialGradient(W/2, H/2, D*0.3, W/2, H/2, D*0.95)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,10,0.72)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, W, H)

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={ref} className={className} style={{ width: '100%', height: '100%' }} />
}
