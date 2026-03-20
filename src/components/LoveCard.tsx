import { motion } from "framer-motion";
import type { LoveCardData } from "../data/cards";

type LoveCardProps = {
  card: LoveCardData;
  isActive?: boolean;
  imageLoading?: "eager" | "lazy";
  imagePriority?: "high" | "low" | "auto";
};

export default function LoveCard({
  card,
  isActive = false,
  imageLoading = "lazy",
  imagePriority = "auto",
}: LoveCardProps) {
  return (
    <div
      className={`relative flex h-full w-full overflow-hidden rounded-[28px] will-change-transform ${
        isActive
          ? "shadow-[0_0_0_1.5px_rgba(148,163,184,0.5),0_34px_88px_-20px_rgba(107,151,255,0.7),0_0_60px_rgba(244,63,94,0.18)]"
          : "shadow-[0_34px_88px_-34px_rgba(107,151,255,0.45)] ring-1 ring-white/20"
      }`}
      style={{
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        background: "#0d111f",
      }}
    >
      {/* Photo */}
      <img
        src={card.image}
        alt={card.alt}
        className="h-full w-full object-cover"
        draggable={false}
        decoding="async"
        loading={imageLoading}
        fetchPriority={imagePriority}
        style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      />

      {/* Active shimmer edge glow */}
      {isActive && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[30px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(148,163,184,0.08) 0%, transparent 50%, rgba(244,63,94,0.06) 100%)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
