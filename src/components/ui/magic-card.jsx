import React, { useCallback, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

export function MagicCard({
  children,
  className,
  gradientSize = 220,
  gradientColor = "rgba(255,255,255,0.25)",
  gradientOpacity = 0.9,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}) {
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const reset = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [gradientSize, mouseX, mouseY]);

  const handlePointerMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const handleGlobalPointerOut = (e) => {
      if (!e.relatedTarget) {
        reset();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") {
        reset();
      }
    };

    window.addEventListener("pointerout", handleGlobalPointerOut);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reset]);

  return (
    <div
      className={cn("magic-card", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerEnter={reset}
    >
      <motion.div
        className="magic-card__border"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientFrom},
              ${gradientTo},
              transparent 70%
            )`,
        }}
      />
      <div className="magic-card__surface" />
      <motion.div
        className="magic-card__glow"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      <div className="magic-card__body">{children}</div>
    </div>
  );
}
