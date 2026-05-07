"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";
import RegistrationForm from "@/components/RegistrationForm";
import { eventName, heroTagline, formCutoffDate } from "@/config/content";

function ClosedScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 flex items-center justify-center p-4">
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
          className="mx-auto w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl"
        >
          <svg className="w-12 h-12 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-400/20 text-red-300 text-xs font-medium tracking-widest uppercase mb-4"
        >
          Registrations Closed
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-white mb-2"
        >
          {eventName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-purple-200/70 leading-relaxed"
        >
          The registration window for this event has closed. We look forward to seeing everyone who registered!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 px-6 py-4 rounded-2xl bg-white/5 border border-white/10"
        >
          <p className="text-sm text-purple-300">📅 Event Date</p>
          <p className="text-white font-semibold mt-1">18 May 2026</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 relative overflow-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-purple-200 text-xs font-medium tracking-widest uppercase mb-4"
          >
            Exclusive Event
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-3"
          >
            {eventName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-purple-200/70 text-sm sm:text-base max-w-md mx-auto"
          >
            {heroTagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8"
          >
            <p className="text-xs text-purple-300/70 uppercase tracking-widest mb-4">
              Registration closes in
            </p>
            <CountdownTimer
              cutoff={formCutoffDate.getTime()}
              onExpire={handleExpire}
            />
          </motion.div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30 p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Event Registration</h2>
            <p className="text-purple-300/60 text-sm mt-1">Fill in your details to secure your spot</p>
          </div>
          <RegistrationForm />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-white/20 mt-6"
        >
          Your data is secure and will only be used for event coordination.
        </motion.p>
      </div>
    </div>
  );
}
