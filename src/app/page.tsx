"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InteractiveImageBentoGallery from "@/components/ui/bento-gallery";

const imageItems = [
  {
    id: 1,
    title: "Vibrant Tokyo",
    desc: "The pulsing energy of Shibuya crossing.",
    url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=90",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Neon Ads",
    desc: "Digital storytelling in the heart of the city.",
    url: "https://images.unsplash.com/photo-1529218402470-5dec8fea0761?w=1200&q=90",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "Cyberpunk Alley",
    desc: "Hidden paths through future architecture.",
    url: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=1200&q=90",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    id: 4,
    title: "Shadow Night",
    desc: "Capturing the stillness of late-night streets.",
    url: "https://images.unsplash.com/photo-1493515322954-4fa727e97985?w=1200&q=90",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    id: 5,
    title: "Light Trails",
    desc: "Kinetic energy frozen in time.",
    url: "https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=1200&q=90",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 6,
    title: "Zen Modern",
    desc: "A fusion of tradition and technology.",
    url: "https://images.unsplash.com/photo-1528361237150-8a9a7df33035?q=80&w=2340",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 7,
    title: "Glass Cityscape",
    desc: "Reflections of a digital metropolis.",
    url: "https://images.unsplash.com/photo-1608875004752-2fdb6a39ba4c?q=80&w=2340",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 8,
    title: "Dynamic Curve",
    desc: "Fluid aesthetics and structural depth.",
    url: "https://images.unsplash.com/photo-1564284369929-026ba231f89b?w=1200&q=90",
    span: "md:col-span-1 md:row-span-1",
  },
];

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <main className={cn(
      "min-h-screen bg-black text-white selection:bg-white/10 selection:text-white transition-all duration-1000 ease-in-out",
      isGenerating ? "overflow-y-auto" : "overflow-hidden max-h-screen"
    )}>
      <Navbar />
      <Hero isGenerating={isGenerating} setIsGenerating={setIsGenerating} />
      
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 50, scale: 0.98, filter: "blur(10px)" }}
            transition={{ 
              duration: 1.2, 
              ease: [0.23, 1, 0.32, 1],
              opacity: { duration: 0.8 }
            }}
          >
            <InteractiveImageBentoGallery 
              imageItems={imageItems}
              title="Generation History"
              description="A journey through your creative evolution. Tag elements to refine your vision."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
