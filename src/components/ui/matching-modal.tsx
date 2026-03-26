"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const statusMessages = [
  "Submitting your application…",
  "Searching our lender network…",
  "Analysing your profile…",
  "Matching you with the best lender…",
];

const MATCHING_DURATION_MS = 4000;
const MESSAGE_INTERVAL_MS = MATCHING_DURATION_MS / statusMessages.length;

interface MatchingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function MatchingModal({ isOpen, onComplete }: MatchingModalProps) {
  const [phase, setPhase] = useState<"matching" | "found">("matching");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase("matching");
      setMessageIndex(0);
      return;
    }

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) =>
        prev < statusMessages.length - 1 ? prev + 1 : prev
      );
    }, MESSAGE_INTERVAL_MS);

    const phaseTimer = setTimeout(() => {
      setPhase("found");
    }, MATCHING_DURATION_MS);

    return () => {
      clearInterval(messageTimer);
      clearTimeout(phaseTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDone = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-x-4 top-1/2 z-[101] mx-auto max-w-md -translate-y-1/2 rounded-2xl shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2 ${
              phase === "matching" ? "bg-white p-8 sm:p-10" : "p-0"
            }`}
          >
            <AnimatePresence mode="wait">
              {phase === "matching" ? (
                <motion.div
                  key="matching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Spinner */}
                  <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-primary/20"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full border-4 border-transparent border-b-primary/50"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    {/* Pulsing core */}
                    <motion.div
                      className="h-6 w-6 rounded-full bg-primary/20"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Finding Your Best Match
                  </h3>

                  {/* Cycling status messages */}
                  <div className="mt-4 h-6">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="text-sm text-slate-500 sm:text-base"
                      >
                        {statusMessages[messageIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: MATCHING_DURATION_MS / 1000,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="found"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden rounded-2xl bg-[#0f1b3d] px-6 py-8 text-center sm:px-10 sm:py-10"
                >
                  {/* Close button */}
                  <button
                    onClick={handleDone}
                    className="absolute right-3 top-3 cursor-pointer rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Heading */}
                  <motion.h3
                    initial={{ opacity: 0, scale: 0.7, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 14,
                      delay: 0.1,
                    }}
                    className="text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl"
                  >
                    Lender Found!
                  </motion.h3>

                  {/* Body text */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-white/70 sm:text-base"
                  >
                    The lender will contact you to gather more info and discuss
                    your loan details. Please expect a call and WhatsApp from
                    them soon.
                  </motion.p>

                  {/* Done button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                    onClick={handleDone}
                    className="mt-5 w-full cursor-pointer rounded-lg bg-white py-3 text-sm font-bold text-[#0f1b3d] transition-colors hover:bg-white/90"
                  >
                    Done
                  </motion.button>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
