"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface FeatureProps {
  badge?: string;
  title: string;
  subtitle: string;
  features: {
    title: string;
    description: string;
  }[];
  imageUrl?: string;
  imageAlt?: string;
}

function Feature({
  badge = "Platform",
  title,
  subtitle,
  features,
  imageUrl,
  imageAlt = "Feature illustration",
}: FeatureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="w-full py-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-slate-900 p-6 sm:p-10 lg:p-14"
        >
          <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2 lg:gap-14">
            <div className="flex gap-10 flex-col">
              <div className="flex gap-4 flex-col">
                <div>
                  <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                    {badge}
                  </Badge>
                </div>
                <div className="flex gap-3 flex-col">
                  <h2 className="text-3xl lg:text-5xl tracking-tighter max-w-xl text-left font-semibold text-white">
                    {title}
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed tracking-tight text-slate-400 max-w-xl text-left">
                    {subtitle}
                  </p>
                </div>
              </div>
              <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.12 }}
                    className="flex flex-row gap-4 items-start"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-white">{feature.title}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl overflow-hidden aspect-video lg:aspect-square relative bg-slate-800"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <span className="text-sm">Image placeholder</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export { Feature };
