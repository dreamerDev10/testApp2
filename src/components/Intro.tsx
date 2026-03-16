import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'

type IntroProps = {
  onStart: () => void
  preloadProgress: number
  isReady: boolean
}

// Mirror the actual card themes + anniversary line
const LINES = [
  '...красти твою картоплю фрі',
  '...надсилати меми о 3 ночі',
  '...засинати під серіал',
  '...рівно рік поруч',
  '...це ти ❤',
]

// Card-illustration style floating hearts
const FLOATERS = Array.from({ length: 11 }, (_, i) => ({
  left:     4 + (i * 8.7) % 88,
  size:     11 + (i % 5) * 5,
  delay:    i * 0.5,
  duration: 5 + (i % 4) * 1.6,
  driftX:   ((i % 5) - 2) * 22,
  opacity:  0.55 + (i % 3) * 0.13,
}))

export default function Intro({ onStart, preloadProgress, isReady }: IntroProps) {
  const [idx, setIdx] = useState(0)
  const progressPercent = Math.round(preloadProgress * 100)

  useEffect(() => {
    const id = window.setInterval(
      () => setIdx(p => (p + 1) % LINES.length),
      2300,
    )
    return () => window.clearInterval(id)
  }, [])

  const floaters = useMemo(() => FLOATERS, [])

  return (
    <div
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, #2d0e1c 0%, #160520 38%, #070412 68%, #030209 100%)',
      }}
    >
      {/* ── Floating hearts (card-illustration style) ── */}
      {floaters.map((h, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute"
          style={{
            bottom: '-6%',
            left: `${h.left}%`,
            fontSize: h.size,
            color: `rgba(215,48,58,${h.opacity})`,
            userSelect: 'none',
            lineHeight: 1,
          }}
          animate={{
            y: '-118vh',
            x: h.driftX,
            opacity: [h.opacity, h.opacity * 1.2, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeOut',
            repeatDelay: 0.3,
          }}
        >
          ❤
        </motion.span>
      ))}

      {/* ── Center content ──────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* "Love is..." — matches the card header style */}
        <motion.h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(56px, 15vw, 88px)',
            lineHeight: 1.05,
            color: '#fff',
            textShadow:
              '0 2px 0 rgba(0,0,0,0.3), 0 0 48px rgba(220,80,110,0.45)',
            letterSpacing: '-0.01em',
          }}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Love is...
        </motion.h1>

        {/* Cycling completions */}
        <motion.div
          className="mt-4 overflow-hidden"
          style={{ height: 'clamp(28px, 8vw, 38px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              style={{
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(17px, 4.8vw, 23px)',
                color: 'rgba(255,195,205,0.88)',
                textShadow: '0 0 24px rgba(220,80,110,0.55)',
                lineHeight: 1.3,
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.38, ease: 'easeInOut' }}
            >
              {LINES[idx]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Anniversary badge */}
        <motion.div
          className="mt-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <div className="h-px w-10 bg-white/20" />
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            перша річниця
          </span>
          <div className="h-px w-10 bg-white/20" />
        </motion.div>
      </div>

      {/* ── Loading bar + button ─────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center px-6 pb-safe">
        <div className="w-full max-w-[180px]">
          <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(215,48,58,0.8), rgba(236,72,153,0.8))',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />
          </div>
        </div>

        <motion.button
          className="relative mt-5 overflow-hidden rounded-full px-12 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: isReady
              ? 'linear-gradient(135deg, #be123c 0%, #e11d48 50%, #9f1239 100%)'
              : 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: isReady
              ? '0 0 48px rgba(225,29,72,0.45), 0 16px 40px -16px rgba(225,29,72,0.65)'
              : 'none',
          }}
          onClick={onStart}
          disabled={!isReady}
          whileTap={isReady ? { scale: 0.97 } : undefined}
          whileHover={isReady ? { scale: 1.05 } : undefined}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          {isReady ? '❤ Відкрити' : 'Завантаження...'}

          {isReady && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: 1.0,
                delay: 2.0,
                repeat: Infinity,
                repeatDelay: 3.5,
              }}
            />
          )}
        </motion.button>
      </div>
    </div>
  )
}
