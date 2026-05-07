"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    function calc() {
      const diff = target - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      };
    }

    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

function FlipDigit({ value, label, compact = false }) {
  const prev = useRef(value);
  useEffect(() => { prev.current = value; });

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${compact ? "w-11 h-11 sm:w-12 sm:h-12" : "w-16 h-16 sm:w-20 sm:h-20"}`}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ rotateX: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotateX: 0, opacity: 1, scale: 1 }}
            exit={{ rotateX: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/75 backdrop-blur-md border border-amber-200/70 shadow-lg shadow-amber-900/10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className={`${compact ? "text-base sm:text-lg" : "text-2xl sm:text-3xl"} font-bold text-amber-950 tabular-nums`}>
              {String(value).padStart(2, "0")}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className={`${compact ? "mt-1 text-[10px]" : "mt-2 text-xs"} font-medium text-amber-700 uppercase tracking-widest`}>
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ cutoff, onExpire, compact = false }) {
  const time = useCountdown(cutoff);

  useEffect(() => {
    if (time?.expired) onExpire?.();
  }, [time?.expired, onExpire]);

  if (!time) return null;

  return (
    <div className={`flex items-end ${compact ? "gap-1.5 sm:gap-2" : "gap-3 sm:gap-5"} justify-center`}>
      <FlipDigit value={time.days} label="Days" compact={compact} />
      <span className={`${compact ? "text-sm pb-4" : "text-2xl pb-8"} text-amber-800/60 font-light`}>:</span>
      <FlipDigit value={time.hours} label="Hours" compact={compact} />
      <span className={`${compact ? "text-sm pb-4" : "text-2xl pb-8"} text-amber-800/60 font-light`}>:</span>
      <FlipDigit value={time.minutes} label="Mins" compact={compact} />
      <span className={`${compact ? "text-sm pb-4" : "text-2xl pb-8"} text-amber-800/60 font-light`}>:</span>
      <FlipDigit value={time.seconds} label="Secs" compact={compact} />
    </div>
  );
}
