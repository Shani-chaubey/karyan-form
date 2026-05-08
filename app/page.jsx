"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import RegistrationForm from "@/components/RegistrationForm";
import { eventName, heroTagline, formCutoffDate } from "@/config/content";

function ClosedScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lux-ivory via-lux-cream/80 to-lux-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="max-w-md w-full text-center"
      >
        {/* Lock icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-24 h-24 rounded-full bg-white/70 border border-amber-200/60 flex items-center justify-center mb-6 shadow-xl shadow-amber-900/10"
        >
          <svg className="w-12 h-12 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-700 text-xs font-medium tracking-widest uppercase mb-4"
        >
          Registrations Closed
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-amber-950 mb-2"
        >
          {eventName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-amber-900/75 leading-relaxed"
        >
          The registration window for this event has closed. We look forward to seeing everyone who registered!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 px-6 py-4 rounded-2xl bg-white/70 border border-amber-200/60"
        >
          <p className="text-sm text-amber-700">📅 Event Date</p>
          <p className="text-amber-950 font-semibold mt-1">18 May 2026</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const [closed, setClosed] = useState(() => Date.now() > formCutoffDate.getTime());
  const handleExpire = useCallback(() => setClosed(true), []);

  if (closed) return <ClosedScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lux-ivory via-lux-cream/80 to-lux-cream relative overflow-x-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-orange-300/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-10 pb-36 sm:pt-16 sm:pb-28">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.45 }}
            className="mx-auto mb-5 w-fit"
          >
            <div className="relative rounded-2xl border border-amber-200/80 bg-white/75 px-5 py-3 shadow-xl shadow-amber-900/10 backdrop-blur">
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-amber-100/60 to-transparent" />
              <Image
                src="/logo.webp"
                alt="Karyan logo"
                width={180}
                height={72}
                priority
                className="relative h-12 sm:h-14 w-auto object-contain"
              />
            </div>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/70 border border-amber-200/70 text-amber-700 text-xs font-medium tracking-widest uppercase mb-4"
          >
            karyan Launch
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold text-amber-950 leading-tight mb-3"
          >
            {eventName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4 }}
            className="text-xl sm:text-2xl text-amber-800/90 font-medium mb-2"
          >
            Studio & Luxury Residences
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-amber-900/75 text-sm sm:text-base max-w-md mx-auto"
          >
            {heroTagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 w-fit text-center mx-auto"
          >
            <p className="text-[10px] sm:text-xs text-amber-700/80 uppercase tracking-widest mb-2">
              Registration closes in
            </p>
            <CountdownTimer
              cutoff={formCutoffDate.getTime()}
              onExpire={handleExpire}
              compact
            />
          </motion.div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-2xl bg-white/85 backdrop-blur-xl border border-amber-200 shadow-2xl shadow-amber-900/10 p-6 sm:p-8 overflow-visible"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Event Registration</h2>
            <p className="text-slate-600 text-sm mt-1">Fill in your details to secure your spot</p>
          </div>
          <RegistrationForm />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-base text-amber-900/55 mt-6"
        >
          Important Note: Kindly ensure that all the information shared by you is accurate, as entry will be permitted strictly through barcode verification only.
        </motion.p>
      </div>
    </div>
  );
}
