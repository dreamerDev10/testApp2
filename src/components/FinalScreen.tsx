import { motion } from "framer-motion";
import FinalScene from "./FinalScene";

const WORDS = ["Я", "тебе", "кохаю"];

const FLOATERS = [
  { x: "11%", y: "22%", c: "#f43f5e", d: 3.2, t: 3.0, r: 2.8 },
  { x: "86%", y: "17%", c: "#a855f7", d: 3.6, t: 2.6, r: 3.2 },
  { x: "7%", y: "61%", c: "#60a5fa", d: 4.0, t: 3.4, r: 2.4 },
  { x: "91%", y: "53%", c: "#f43f5e", d: 4.2, t: 2.8, r: 3.0 },
  { x: "20%", y: "84%", c: "#c084fc", d: 3.8, t: 3.2, r: 2.6 },
  { x: "78%", y: "78%", c: "#f9a8d4", d: 3.4, t: 2.9, r: 2.9 },
] as const;

// photo prop: pass your image URL/import here
export default function FinalScreen({
  onReplay,
  photo,
}: {
  onReplay: () => void;
  photo?: string;
}) {
  // When a photo is shown the text appears earlier (no particle heart buildup needed)
  const textDelay = photo ? 1.8 : 3.2;

  return (
    <div
      className="relative min-h-[100svh] w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 10%, #1a0a2e 0%, #0d0820 35%, #060412 65%, #030209 100%)",
      }}
    >
      {/* ── Particle heart canvas (hidden behind photo when present) ── */}
      {!photo && <FinalScene className="absolute inset-0 z-0" />}

      {/* ── Aurora glow ────────────────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute z-10"
        style={{
          left: "50%",
          top: "50%",
          width: 700,
          height: 700,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220,40,80,0.13) 0%, rgba(140,60,220,0.07) 45%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* ── White flash ────────────────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 bg-white"
        initial={{ opacity: 0.75 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      />

      {/* ── Floating sparkles ──────────────────────────────────────── */}
      {FLOATERS.map((f, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute z-20"
          style={{
            left: f.x,
            top: f.y,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: f.c,
            boxShadow: `0 0 7px 3px ${f.c}bb`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1.8, 1, 1.6, 0],
            y: [0, -18, -8, -22, 0],
          }}
          transition={{
            delay: f.d,
            duration: f.t,
            repeat: Infinity,
            repeatDelay: f.r,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Centered column ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-5 text-center"
        style={{ paddingBottom: "max(72px, 10svh)" }}
      >
        {/* ── Photo card ─────────────────────────────────────────── */}
        {photo && (
          <motion.div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 320,
              borderRadius: 20,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: [
                "0 0 0 1.5px rgba(244,63,94,0.40)",
                "0 0 36px rgba(244,63,94,0.22)",
                "0 0 72px rgba(168,85,247,0.15)",
                "0 28px 60px rgba(0,0,0,0.75)",
              ].join(", "),
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={photo}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                objectFit: "contain",
                display: "block",
                background: "#0a0416",
              }}
            />

            {/* Shimmer sweep on the photo */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.10) 50%, transparent 70%)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "160%" }}
              transition={{ delay: 1.8, duration: 1.1, ease: "easeInOut" }}
            />

            {/* Bottom gradient inside photo */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background:
                  "linear-gradient(to top, rgba(6,2,20,0.80) 0%, transparent 100%)",
              }}
            />
          </motion.div>
        )}

        {/* ── Text ───────────────────────────────────────────────── */}
        <div style={{ marginTop: photo ? 24 : 0 }}>
          {/* Words */}
          <div className="flex flex-wrap items-baseline justify-center gap-x-[0.2em]">
            {WORDS.map((word, i) => (
              <motion.span
                key={i}
                style={{
                  fontFamily: "Fraunces, serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: photo
                    ? "clamp(36px, 9.5vw, 62px)"
                    : "clamp(48px, 13vw, 88px)",
                  color: "#fff",
                  lineHeight: 1.05,
                  textShadow:
                    "0 0 28px rgba(244,63,94,0.9), 0 0 72px rgba(244,63,94,0.4), 0 0 130px rgba(168,85,247,0.25)",
                }}
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: textDelay + i * 0.2,
                  duration: 0.78,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}

            {/* Heart ❤ */}
            <motion.span
              style={{
                fontSize: photo
                  ? "clamp(30px, 8vw, 52px)"
                  : "clamp(38px, 10vw, 68px)",
                lineHeight: 1,
                userSelect: "none",
                marginLeft: "0.1em",
                display: "inline-block",
                filter:
                  "drop-shadow(0 0 16px rgba(244,63,94,1)) drop-shadow(0 0 48px rgba(244,63,94,0.6))",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 2.4, 0.8, 1.1, 1] }}
              transition={{
                delay: textDelay + 0.65,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              ❤
            </motion.span>
          </div>

          {/* Divider */}
          <motion.div
            className="relative mx-auto mt-5"
            style={{ width: 180, height: 1 }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              delay: textDelay + 0.9,
              duration: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent, rgba(244,63,94,0.8), rgba(192,132,252,0.9), rgba(99,179,237,0.7), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -3,
                bottom: -3,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(90deg, transparent, rgba(244,63,94,0.4), rgba(192,132,252,0.45), rgba(99,179,237,0.35), transparent)",
                filter: "blur(5px)",
              }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              fontSize: "clamp(14px, 3.8vw, 19px)",
              letterSpacing: "0.09em",
              marginTop: 18,
              background:
                "linear-gradient(100deg, #fca5a5 0%, #e879f9 50%, #93c5fd 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: textDelay + 1.05,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            дякую за цей рік
          </motion.p>
        </div>
      </div>

      {/* ── Replay button (pinned bottom) ──────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 flex justify-center"
        style={{
          paddingBottom: "max(28px, env(safe-area-inset-bottom, 22px))",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: textDelay + 1.6,
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            style={{
              position: "relative",
              display: "inline-block",
              borderRadius: 100,
              padding: 1.5,
              overflow: "hidden",
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "300%",
                height: "300%",
                transform: "translate(-50%, -50%)",
                background:
                  "conic-gradient(from 0deg, #f43f5e, #a855f7, #3b82f6, #a855f7, #f43f5e)",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: textDelay + 2,
              }}
            />
            <button
              onClick={onReplay}
              style={{
                position: "relative",
                zIndex: 1,
                display: "block",
                borderRadius: 100,
                border: "none",
                background: "rgba(6, 2, 18, 0.88)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                padding: "11px 36px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.80)",
                cursor: "pointer",
                overflow: "hidden",
                outline: "none",
              }}
            >
              Повторити
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",
                  borderRadius: "inherit",
                }}
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 1.4,
                  delay: textDelay + 2.5,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
