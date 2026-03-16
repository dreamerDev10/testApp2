import { motion } from 'framer-motion'
import FinalScene from './FinalScene'

const WORDS = ['Я', 'тебе', 'кохаю']

export default function FinalScreen({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden" style={{ background: '#04010f' }}>

      {/* ── Particle heart canvas ────────────────────────── */}
      <FinalScene className="absolute inset-0 z-0" />

      {/* ── White flash entrance ─────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 bg-white"
        initial={{ opacity: 0.72 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      />

      {/* ── Bottom fade ───────────────────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20"
        style={{
          height: 'min(300px, 45svh)',
          background: 'linear-gradient(to top, rgba(4,1,16,0.98) 0%, rgba(4,1,16,0.72) 42%, transparent 100%)',
        }}
      />

      {/* ── UI ────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center px-6 text-center pb-safe">

        {/* "Я тебе кохаю ❤" */}
        <div className="flex flex-wrap items-center justify-center gap-x-3">
          {WORDS.map((word, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(30px, 8vw, 44px)',
                color: '#fff',
                textShadow:
                  '0 0 28px rgba(244,63,94,0.95), 0 0 70px rgba(244,63,94,0.45), 0 0 110px rgba(168,85,247,0.3)',
              }}
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 3.3 + i * 0.26, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            style={{ fontSize: 'clamp(28px,7vw,40px)', userSelect: 'none', lineHeight: 1 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 2.1, 1] }}
            transition={{ delay: 4.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >❤</motion.span>
        </div>

        {/* Subtitle */}
        <motion.p
          style={{
            fontFamily: 'Fraunces, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 4.5vw, 21px)',
            color: 'rgba(255,195,205,0.90)',
            letterSpacing: '0.06em',
            marginTop: 8,
            textShadow: '0 0 20px rgba(244,63,94,0.55), 0 0 48px rgba(192,132,252,0.25)',
          }}
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 4.25, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          дякую за цей рік
        </motion.p>

        {/* Liner */}
        <motion.div
          className="mt-3 h-px w-48"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(244,63,94,0.8), rgba(192,132,252,0.9), rgba(99,179,237,0.65), transparent)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 4.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Replay button */}
        <motion.button
          className="relative mt-5 overflow-hidden rounded-full border border-white/20 bg-white/10 px-10 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.6 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.18)' }}
          onClick={onReplay}
        >
          Повторити
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.2, delay: 5.5, repeat: Infinity, repeatDelay: 4 }}
          />
        </motion.button>
      </div>
    </div>
  )
}
