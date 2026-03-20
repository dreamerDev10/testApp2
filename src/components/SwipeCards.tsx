import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LoveCardData } from "../data/cards";
import LoveCard from "./LoveCard";

type SwipeCardsProps = {
  cards: LoveCardData[];
  onComplete: () => void;
};

const STORY_DURATION_MS = 4200;

export default function SwipeCards({ cards, onComplete }: SwipeCardsProps) {
  const [index, setIndex] = useState(0);
  const [, setDirection] = useState<1 | -1>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingStep, setPendingStep] = useState<1 | -1 | null>(null);

  const currentCard = cards[index];
  const underCard = cards[index + 1];
  const underCard2 = cards[index + 2];

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 22,
  });
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 22,
  });

  const progressBars = useMemo(() => cards.map((c) => c.id), [cards]);
  const cardRef = useRef<HTMLDivElement>(null);

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  useEffect(() => {
    resetTilt();
  }, [index]);

  const navigate = (step: -1 | 1) => {
    if (isTransitioning || pendingStep !== null) return;
    const next = index + step;
    if (next < 0) return;
    if (next >= cards.length) {
      onComplete();
      return;
    }
    setDirection(step);
    setIsTransitioning(true);
    setPendingStep(step);
    resetTilt();
  };

  useEffect(() => {
    if (isTransitioning) return undefined;
    const t = window.setTimeout(() => navigate(1), STORY_DURATION_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isTransitioning]);

  const handleExitComplete = () => {
    if (pendingStep === null) return;
    setIndex((prev) => prev + pendingStep);
    setPendingStep(null);
    setIsTransitioning(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTransitioning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  if (!currentCard) return null;

  return (
    <div
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-4 pt-safe"
      style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
    >
      {/* ── Ambient glow ────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.35, 0.52, 0.35] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,_rgba(143,180,255,0.26),_transparent_50%)]" />
      </motion.div>

      {/* ══ MOBILE: horizontal dots above card ═══════════ */}
      <div className="relative z-20 mb-6 flex sm:hidden items-center gap-1 rounded-full border border-white/18 bg-black/32 px-3 py-1.5 backdrop-blur-sm">
        {progressBars.map((barId, i) => (
          <div
            key={barId}
            className="relative flex h-5 w-5 items-center justify-center"
          >
            <span
              className={`text-[13px] leading-none ${i < index ? "text-sky-100/95" : "text-slate-100/30"}`}
            >
              {i < index ? "❤" : "♡"}
            </span>
            {i === index && (
              <motion.span
                key={`fill-${barId}-${index}`}
                className="absolute text-[13px] leading-none text-sky-100"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{
                  duration: STORY_DURATION_MS / 1000,
                  ease: "linear",
                }}
              >
                ❤
              </motion.span>
            )}
            {i === index && (
              <motion.span
                className="pointer-events-none absolute h-6 w-6 rounded-full border border-sky-100/30"
                animate={{ scale: [1, 1.14, 1], opacity: [0.18, 0.44, 0.18] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ══ CARD + DESKTOP DOTS row ═══════════════════════ */}
      <div className="relative z-20 flex items-center gap-3">
        {/* Card stack */}
        <div
          className="relative w-[min(390px,calc(100vw-20px))] flex-shrink-0 sm:w-[440px] [perspective:1800px]"
          style={{ height: "min(580px, calc(100svh - 150px))" }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
        >
          {underCard2 && (
            <motion.div
              className="absolute inset-0"
              animate={
                isTransitioning
                  ? { y: 30, scale: 0.92, opacity: 0 }
                  : { y: 30, scale: 0.92, opacity: 0.52 }
              }
              transition={{ type: "spring", stiffness: 240, damping: 30 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <LoveCard
                card={underCard2}
                imageLoading="eager"
                imagePriority="low"
              />
            </motion.div>
          )}

          {underCard && (
            <motion.div
              className="absolute inset-0"
              animate={
                isTransitioning
                  ? { y: 16, scale: 0.958, opacity: 0 }
                  : { y: 16, scale: 0.958, opacity: 0.88 }
              }
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <LoveCard
                card={underCard}
                imageLoading="eager"
                imagePriority="high"
              />
            </motion.div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              ref={cardRef}
              key={currentCard.id}
              className="absolute inset-0 cursor-pointer"
              drag={isTransitioning ? false : "x"}
              dragConstraints={{ left: -130, right: 130 }}
              dragElastic={0.11}
              dragMomentum={false}
              onDragStart={resetTilt}
              onDrag={(_, info) => {
                pointerX.set(
                  Math.max(-0.5, Math.min(0.5, (info.offset.x / 130) * 0.5)),
                );
              }}
              onDragEnd={(_, info) => {
                resetTilt();
                if (
                  Math.abs(info.offset.x) > 70 ||
                  Math.abs(info.velocity.x) > 400
                ) {
                  navigate(info.offset.x < 0 ? 1 : -1);
                }
              }}
              onTap={(_, info) => {
                if (isTransitioning || !cardRef.current) return;
                const rect = cardRef.current.getBoundingClientRect();
                navigate(
                  (info.point.x - rect.left) / rect.width < 0.38 ? -1 : 1,
                );
              }}
              style={{
                rotateX: isTransitioning ? 0 : tiltX,
                rotateY: isTransitioning ? 0 : tiltY,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
              initial={{ x: 0, y: 22, rotateZ: 0, scale: 0.95, opacity: 0 }}
              animate={
                isTransitioning
                  ? {
                      x: pendingStep === 1 ? -460 : 460,
                      y: 35,
                      rotateZ: pendingStep === 1 ? -24 : 24,
                      scale: 0.58,
                      opacity: 0,
                      transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] },
                    }
                  : {
                      x: 0,
                      y: 0,
                      rotateZ: 0,
                      scale: 1,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 310,
                        damping: 25,
                        mass: 0.8,
                      },
                    }
              }
              onAnimationComplete={handleExitComplete}
            >
              <LoveCard
                card={currentCard}
                isActive
                imageLoading="eager"
                imagePriority="high"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ══ DESKTOP: vertical dots right of card ══════ */}
        <div className="hidden sm:block flex-shrink-0 rounded-[28px] border border-white/18 bg-black/32 px-2 py-3 backdrop-blur-sm">
          <div className="relative flex flex-col items-center gap-1.5">
            <div className="pointer-events-none absolute bottom-1 top-1 w-[1px] bg-white/12" />
            {progressBars.map((barId, i) => (
              <div
                key={barId}
                className="relative flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`text-[17px] leading-none ${i < index ? "text-sky-100/95" : "text-slate-100/30"}`}
                >
                  {i < index ? "❤" : "♡"}
                </span>
                {i === index && (
                  <motion.span
                    key={`fill-${barId}-${index}`}
                    className="absolute text-[17px] leading-none text-sky-100"
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)" }}
                    transition={{
                      duration: STORY_DURATION_MS / 1000,
                      ease: "linear",
                    }}
                  >
                    ❤
                  </motion.span>
                )}
                {i === index && (
                  <motion.span
                    className="pointer-events-none absolute h-8 w-8 rounded-full border border-sky-100/30"
                    animate={{
                      scale: [1, 1.14, 1],
                      opacity: [0.18, 0.44, 0.18],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Counter ─────────────────────────────────────── */}
      <motion.p
        key={`counter-${currentCard.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26 }}
        className="relative z-20 mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300/55"
      >
        {index + 1} / {cards.length}
      </motion.p>
    </div>
  );
}
