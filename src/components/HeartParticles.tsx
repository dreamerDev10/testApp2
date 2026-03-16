import { motion } from 'framer-motion'
import { useMemo } from 'react'

type HeartParticlesProps = {
  density?: number
  className?: string
}

const SYMBOLS = ['❤', '❤', '❤', '✦', '✦', '✦', '✧', '♡']
const COLORS = [
  'rgba(244,63,94,VAR)',
  'rgba(236,72,153,VAR)',
  'rgba(192,132,252,VAR)',
  'rgba(251,191,36,VAR)',
  'rgba(148,163,184,VAR)',
  'rgba(99,179,237,VAR)',
]

export default function HeartParticles({ density = 16, className = '' }: HeartParticlesProps) {
  const particles = useMemo(() =>
    Array.from({ length: density }, (_, i) => {
      const opacity = 0.15 + (i % 6) * 0.07
      const colorTemplate = COLORS[i % COLORS.length]
      return {
        left: (i * 17 + 3) % 100,
        size: 8 + (i % 5) * 5,
        delay: (i % 9) * 0.8,
        duration: 8 + (i % 6) * 1.8,
        initialOpacity: opacity,
        driftX: ((i % 7) - 3) * 18,
        symbol: SYMBOLS[i % SYMBOLS.length],
        color: colorTemplate.replace('VAR', String(opacity + 0.05)),
      }
    }), [density])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            position: 'absolute',
            bottom: '-5%',
            userSelect: 'none',
            color: p.color,
          }}
          initial={{ y: 0, x: 0, opacity: p.initialOpacity, rotate: 0 }}
          animate={{
            y: '-118vh',
            x: p.driftX,
            opacity: [p.initialOpacity, p.initialOpacity * 1.4, 0],
            rotate: p.driftX > 0 ? 12 : -12,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
            repeatDelay: 0.4,
          }}
        >
          {p.symbol}
        </motion.span>
      ))}
    </div>
  )
}
