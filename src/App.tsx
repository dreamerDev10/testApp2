import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import FinalScreen from './components/FinalScreen'
import HeartParticles from './components/HeartParticles'
import Intro from './components/Intro'
import SwipeCards from './components/SwipeCards'
import { loveCards } from './data/cards'

type Stage = 'intro' | 'cards' | 'final'

function App() {
  const [stage, setStage] = useState<Stage>('intro')
  const [runId, setRunId] = useState(0)
  const [preloadProgress, setPreloadProgress] = useState(0)

  const isReady = preloadProgress >= 1

  useEffect(() => {
    let cancelled = false
    let loadedCount = 0
    const total = loveCards.length

    const markLoaded = () => {
      if (cancelled) {
        return
      }
      loadedCount += 1
      setPreloadProgress(Math.min(loadedCount / total, 1))
    }

    loveCards.forEach((card) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = card.image

      if (img.decode) {
        img.decode().catch(() => undefined).finally(markLoaded)
      } else {
        img.onload = markLoaded
        img.onerror = markLoaded
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

const handleReplay = () => {
    setRunId((prev) => prev + 1)
    setStage('intro')
  }

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-[radial-gradient(circle_at_16%_12%,_#29427a_0%,_#111a38_32%,_#0a1024_58%,_#060912_100%)]">
      <HeartParticles density={stage === 'cards' ? 6 : 10} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_20%,_rgba(124,168,255,0.16),_transparent_36%),radial-gradient(circle_at_10%_90%,_rgba(101,217,255,0.10),_transparent_42%),radial-gradient(circle_at_52%_100%,_rgba(255,255,255,0.06),_transparent_55%)]" />

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.section key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Intro onStart={() => setStage('cards')} preloadProgress={preloadProgress} isReady={isReady} />
          </motion.section>
        )}

        {stage === 'cards' && (
          <motion.section key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SwipeCards key={runId} cards={loveCards} onComplete={() => setStage('final')} />
          </motion.section>
        )}

        {stage === 'final' && (
          <motion.section key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FinalScreen onReplay={handleReplay} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
