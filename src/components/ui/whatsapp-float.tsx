"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_URL =
  "https://wa.me/6589009628?text=Hi,%20I%20need%20loan%20assistance%20from%20Lendkaki";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 50% of the viewport height (mid-hero)
      setIsVisible(window.scrollY > window.innerHeight * 0.1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === "/apply") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          key="whatsapp-float"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-2.5 shadow-lg transition-transform hover:scale-105 sm:p-3 lg:pr-5"
        >
          {/* Red notification dot */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center sm:h-5 sm:w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 sm:h-3.5 sm:w-3.5" />
          </span>

          {/* WhatsApp icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="h-7 w-7 fill-white sm:h-8 sm:w-8"
          >
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.96A15.91 15.91 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.388 1.094-1.938 2.002-3.168 2.266-.844.178-1.944.32-5.652-1.214-4.746-1.962-7.802-6.78-8.038-7.094-.226-.314-1.9-2.53-1.9-4.826s1.2-3.424 1.628-3.892c.348-.382.924-.574 1.474-.574.178 0 .338.018.482.032.428.018.642.044.924.716.352.84 1.212 2.946 1.318 3.162.108.216.216.502.072.788-.134.294-.252.426-.468.676-.216.25-.422.442-.638.712-.196.234-.416.484-.172.912.244.42 1.086 1.79 2.332 2.9 1.602 1.428 2.902 1.888 3.382 2.082.352.144.77.108 1.022-.164.32-.348.716-.926 1.118-1.496.286-.406.646-.458 1.032-.314.392.136 2.486 1.174 2.912 1.388.428.216.712.32.818.498.104.178.104 1.032-.284 2.126z" />
          </svg>

          {/* Desktop text label */}
          <span className="hidden text-sm font-semibold text-white lg:inline">
            WhatsApp Us
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
