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
                    Thank You!
                  </motion.h3>

                  {/* Body text */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-white/70 sm:text-base"
                  >
                    We will WhatsApp you the next steps very soon during normal
                    business hours (Mon–Fri, 9am–6pm).
                  </motion.p>

                  {/* Divider */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="my-4 flex items-center gap-3"
                  >
                    <span className="h-px flex-1 bg-white/15" />
                    <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                      or
                    </span>
                    <span className="h-px flex-1 bg-white/15" />
                  </motion.div>

                  {/* Chat prompt */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                    className="text-sm text-white/60"
                  >
                    Chat with us now about your application
                  </motion.p>

                  {/* WhatsApp CTA */}
                  <motion.a
                    href="https://wa.me/6589009628?text=Hi,I%20just%20submitted%20loan%20application"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.35 }}
                    className="mt-3 inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-[#25D366]"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us Now
                  </motion.a>

                  {/* Done button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.35 }}
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
