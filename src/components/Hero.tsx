"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimationFrame, MotionValue } from "framer-motion";
import { Paperclip, Mic, ArrowUp, ArrowRight, Sparkles, History as HistoryIcon, LayoutGrid, Cpu, Lightbulb, Sliders, ChevronDown, X, Ratio, Zap, Palette, ImageIcon, Layers, Settings2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const IMAGES = [
  { id: 1, src: "/gallery/1.png", label: "Portrait" },
  { id: 2, src: "/gallery/2.png", label: "Cyberpunk" },
  { id: 3, src: "/gallery/3.png", label: "Architecture" },
  { id: 4, src: "/gallery/4.png", label: "Product" },
  { id: 5, src: "/gallery/5.png", label: "Interior" },
  { id: 6, src: "/gallery/6.png", label: "Abstract" },
];

interface BackgroundItemProps {
  img: any;
  idx: number;
  isGenerating: boolean;
  onImageClick: (src: string) => void;
  isRight: boolean;
  offsetY: MotionValue<number>;
}

const BackgroundItem = React.memo(({ img, idx, isGenerating, onImageClick, isRight, offsetY }: BackgroundItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const initialPosArr = [
    { top: "10%", left: "8%", rotate: -6, size: "w-56 h-72" },
    { top: "45%", left: "4%", rotate: -2, size: "w-80 h-96" },
    { bottom: "8%", left: "15%", rotate: 4, size: "w-64 h-56" },
    { top: "8%", right: "12%", rotate: 8, size: "w-72 h-56" },
    { top: "40%", right: "5%", rotate: 3, size: "w-80 h-96" },
    { bottom: "10%", right: "15%", rotate: -5, size: "w-64 h-56" },
  ];

  const initialPos = initialPosArr[idx] || { top: "50%", left: "50%", rotate: 0, size: "w-64 h-80" };

  const variants = {
    idle: {
      ...initialPos,
      opacity: 0.8,
      scale: 1,
      x: 0,
      y: 0,
      transition: { duration: 1.2, ease: [0.23, 1, 0.32, 1] as any }
    },
    generating: {
      opacity: 0.6,
      scale: 0.85,
      rotate: isRight ? -5 : 5,
      top: "auto",
      left: "auto",
      right: "auto",
      bottom: "auto",
      transition: { duration: 1.5, ease: [0.23, 1, 0.32, 1] as any }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial={false}
      animate={isGenerating ? "generating" : "idle"}
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)"
      }}
      whileHover={isGenerating ? {
        opacity: 1,
        scale: 0.9,
        x: isRight ? 20 : -20,
        zIndex: 30,
        transition: { duration: 0.3 }
      } : { scale: 1.02, opacity: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onImageClick(img.src)}
      className={cn(
        "absolute z-0 pointer-events-auto rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl transition-shadow group shrink-0",
        isGenerating ? "cursor-pointer" : "cursor-default",
        !isGenerating ? (initialPos.size || "w-64 h-80") : "w-72 h-96",
        isGenerating && "relative"
      )}
    >
      <Image src={img.src} alt={img.label} fill className="object-cover" priority={idx < 6} />
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={cn(
            "opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-[10px] font-black text-white uppercase tracking-[0.3em] bg-white/10 px-6 py-2.5 rounded-full backdrop-blur-xl border border-white/20",
            isHovered && "opacity-100 translate-y-0"
          )}>
            {isRight ? "Tag Effect" : "Tag Preset"}
          </span>
        </div>
      )}
    </motion.div>
  );
});

BackgroundItem.displayName = "BackgroundItem";

interface SideCarouselProps {
  images: typeof IMAGES;
  isGenerating: boolean;
  isRight: boolean;
  onImageClick: (src: string) => void;
}

const SideCarousel = React.memo(({ images, isGenerating, isRight, onImageClick }: SideCarouselProps) => {
  const scrollValue = useMotionValue(0);
  const smoothScroll = useSpring(scrollValue, { stiffness: 60, damping: 20, mass: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-scroll effect
  useAnimationFrame((time, delta) => {
    if (isGenerating && !isHovered && !isDragging) {
      scrollValue.set(scrollValue.get() - delta * 0.05); // Slow crawl
    }
  });

  const handleWheel = (e: React.WheelEvent) => {
    if (!isGenerating) return;
    scrollValue.set(scrollValue.get() - e.deltaY * 0.5);
  };

  const tripleImages = [...images, ...images, ...images];
  const itemHeight = 392;
  const totalHeight = images.length * itemHeight;

  const loopedY = useTransform(smoothScroll, (v) => {
    const wrapped = ((v % totalHeight) + totalHeight) % totalHeight;
    return wrapped - (totalHeight * 1.5);
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 100 : -100 }}
      animate={{ opacity: isGenerating ? 1 : 0, x: isGenerating ? 0 : (isRight ? 100 : -100) }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] as any }}
      onWheel={handleWheel}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      drag="y"
      dragConstraints={{ top: -Infinity, bottom: Infinity }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onDrag={(e, info) => {
        scrollValue.set(scrollValue.get() + info.delta.y);
      }}
      className={cn(
        "absolute top-0 bottom-0 w-[400px] z-[50] pointer-events-auto flex flex-col items-center gap-8 overflow-hidden cursor-grab active:cursor-grabbing",
        isRight ? "right-0" : "left-0"
      )}
    >
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black via-black/0 via-50% to-black" />

      <motion.div
        style={{ y: isGenerating ? loopedY : 0 }}
        className="flex flex-col gap-2 py-10 pointer-events-none"
      >
        {tripleImages.map((img, idx) => (
          <BackgroundItem
            key={`${img.id}-${idx}`}
            img={img}
            idx={idx % images.length}
            isGenerating={isGenerating}
            onImageClick={onImageClick}
            isRight={isRight}
            offsetY={useMotionValue(0)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
});

const HeroBackground = React.memo(({ isGenerating, onImageClick, staticOffsetY }: any) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {!isGenerating && IMAGES.map((img, idx) => (
        <BackgroundItem
          key={`idle-${img.id}`}
          img={img}
          idx={idx}
          isGenerating={false}
          onImageClick={() => { }}
          isRight={idx >= 3}
          offsetY={staticOffsetY}
        />
      ))}

      <SideCarousel
        images={IMAGES}
        isGenerating={isGenerating}
        isRight={false}
        onImageClick={(src) => onImageClick(src, false)}
      />
      <SideCarousel
        images={IMAGES}
        isGenerating={isGenerating}
        isRight={true}
        onImageClick={(src) => onImageClick(src, true)}
      />
    </div>
  );
});

HeroBackground.displayName = "HeroBackground";

const GENERATING_IMAGES = [
  "/gallery/1.png",
  "/gallery/2.png",
  "/gallery/3.png",
  "/gallery/4.png",
  "/gallery/5.png",
  "/gallery/6.png"
];

const Mini3DCarousel = () => {
  // Use images from the IMAGES array (gallery/1.png - gallery/6.png)
  const items = [...IMAGES, IMAGES[0]].slice(0, 7);
  const count = items.length;

  // Smaller rainbow arc configuration
  const arcRadius = 250;
  const totalArcAngle = 180;
  const angleStep = totalArcAngle / (count - 1);
  const startAngle = -180;

  return (
    <div className="relative w-[700px] h-[280px] flex items-end justify-center overflow-visible will-change-transform transform-gpu">
      {/* Ambient glow at the base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[220px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      {items.map((img, i) => {
        const angleDeg = startAngle + i * angleStep;
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = Math.cos(angleRad) * arcRadius;
        const y = Math.sin(angleRad) * arcRadius;
        const cardRotate = angleDeg + 90;

        const distFromCenter = Math.abs(i - Math.floor(count / 2));
        const zIndex = count - distFromCenter;

        return (
          <motion.div
            key={`arc-rainbow-sm-${i}-${img.id}`}
            initial={{ opacity: 0, scale: 0.5, x: 0, y: 70 }}
            animate={{
              opacity: 1,
              x: x,
              y: y,
              scale: 1,
              rotate: cardRotate,
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.08,
              ease: [0.23, 1, 0.32, 1] as any,
            }}
            className="absolute rounded-[1.25rem] overflow-hidden border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-md transform-gpu"
            style={{
              width: 104,
              height: 144,
              zIndex,
              bottom: 0,
              willChange: 'transform, opacity',
            }}
          >
            <Image
              src={img.src}
              alt="Generating..."
              fill
              className="object-cover blur-[10px] scale-125 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-white/10" />

            <div className="absolute bottom-4 left-4 right-4 h-[1.5px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5 + (i * 0.1), repeat: Infinity, ease: "linear" }}
                className="h-full w-full bg-white/40"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};



function HeroFront({
  isGenerating,
  onBegin,
  selectedPreset,
  setSelectedPreset,
  selectedHistory,
  setSelectedHistory,
  activeModel,
  setActiveModel,
  thinkingMode,
  setThinkingMode,
  promptHistory
}: any) {
  const [localPrompt, setLocalPrompt] = useState("");
  const [showControls, setShowControls] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promptHistory]);

  return (
    <div className="container mx-auto px-6 relative z-[70] flex flex-col items-center max-w-4xl h-full justify-start pt-36">
      <AnimatePresence mode="wait">
        {isGenerating && promptHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="flex flex-col items-center w-full mb-12"
          >
            {/* Single Active Prompt Bubble */}
            <div className="relative mb-36 z-[80]">
              <div className="px-10 py-5 rounded-[2.5rem] bg-white/[0.05] border border-white/20 backdrop-blur-2xl shadow-[0_0_100px_rgba(255,255,255,0.05)]">
                <p className="text-2xl font-light text-white leading-relaxed italic">
                  "{promptHistory[promptHistory.length - 1]}"
                </p>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white/[0.05] border-r border-b border-white/20 backdrop-blur-2xl" />
            </div>

            {/* 3D Carousel */}
            <div className="mb-12">
              <Mini3DCarousel />
            </div>

            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="flex items-center gap-3 text-white/20 uppercase tracking-[0.4em] font-black text-[8px]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                Synthesizing latent space...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div animate={{ y: isGenerating ? -20 : 0 }} className="w-full flex justify-center pb-32">
        <div className="w-full max-w-3xl space-y-6">
          <div className="relative group mx-auto">
            <div className="absolute -inset-1 bg-white/5 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
            <div className="relative flex flex-col bg-white/[0.03] border border-white/10 rounded-[2.5rem] transition-all focus-within:border-white/20 focus-within:bg-white/[0.05] shadow-2xl p-2">
              <div className="flex items-center px-6 pt-2 pb-2">
                <div className="flex items-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {selectedPreset && (
                      <motion.div key={`preset-${selectedPreset}`} initial={{ scale: 0, opacity: 0, width: 0 }} animate={{ scale: 1, opacity: 1, width: "auto" }} exit={{ scale: 0, opacity: 0, width: 0 }} className="mr-3 flex items-center group/thumb">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20">
                          <Image src={selectedPreset} alt="P" fill className="object-cover" />
                          <button onClick={() => setSelectedPreset(null)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"><X className="w-4 h-4 text-white" /></button>
                        </div>
                      </motion.div>
                    )}
                    {selectedHistory && (
                      <motion.div key={`history-${selectedHistory}`} initial={{ scale: 0, opacity: 0, width: 0 }} animate={{ scale: 1, opacity: 1, width: "auto" }} exit={{ scale: 0, opacity: 0, width: 0 }} className="mr-3 flex items-center group/thumb">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20">
                          <Image src={selectedHistory} alt="H" fill className="object-cover" />
                          <button onClick={() => setSelectedHistory(null)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"><X className="w-4 h-4 text-white" /></button>
                        </div>
                      </motion.div>
                    )}
                    {!selectedPreset && !selectedHistory && (
                      <motion.div key="default-paperclip">
                        <Paperclip className="w-5 h-5 text-white/20 mr-4 cursor-pointer hover:text-white/40 transition-colors" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <input type="text" value={localPrompt} onChange={(e) => setLocalPrompt(e.target.value)} placeholder={(selectedPreset || selectedHistory) ? "Refine tagged elements..." : "Describe a new image..."} className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder:text-white/20 font-light" onKeyDown={(e) => e.key === "Enter" && localPrompt && (onBegin(localPrompt), setLocalPrompt(""))} />
                <div className="flex items-center gap-4">
                  <Mic className="w-5 h-5 text-white/20 cursor-pointer hover:text-white/40 transition-colors" />
                  <button onClick={() => { if (localPrompt) { onBegin(localPrompt); setLocalPrompt(""); } }} className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer", (localPrompt.length > 0 || isGenerating || selectedPreset || selectedHistory) ? "bg-white text-black" : "bg-white/10 text-white/30")}>
                    <ArrowUp className={cn("w-5 h-5 transition-transform duration-500", isGenerating ? "rotate-180" : "")} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.05] bg-white/[0.01]">
                <div className="flex items-center gap-3 relative">
                  <button onClick={() => setShowControls(!showControls)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[11px] font-bold text-white/40 hover:text-white uppercase tracking-wider", showControls ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5")}><Settings2 className="w-3.5 h-3.5" /> {activeModel} <ChevronDown className={cn("w-3 h-3 transition-transform", showControls && "rotate-180")} /></button>
                  <button onClick={() => setThinkingMode(!thinkingMode)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[11px] font-bold uppercase tracking-wider", thinkingMode ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-white/40 hover:text-white")}><Lightbulb className={cn("w-3.5 h-3.5", thinkingMode && "text-yellow-400 fill-yellow-400")} /> Thinking</button>

                  <AnimatePresence>
                    {showControls && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-4 w-[300px] z-[100]"
                      >
                        <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-black/90 border border-white/10 backdrop-blur-2xl shadow-2xl">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                              <Settings2 className="w-4 h-4 text-white/40" />
                              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">Model Controls</span>
                            </div>
                            <X className="w-4 h-4 text-white/20 cursor-pointer hover:text-white/40" onClick={() => setShowControls(false)} />
                          </div>

                          <div className="space-y-4">
                            {/* Model Selector */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">Selection</label>
                              <div className="flex flex-col gap-1.5">
                                {["Tarum Ultra 1.0", "Tarum Creative", "Tarum Fast"].map((m) => (
                                  <button key={m} onClick={() => setActiveModel(m)} className={cn("w-full text-left px-3 py-2 rounded-xl text-[12px] transition-all", activeModel === m ? "bg-white/10 text-white border border-white/20" : "text-white/40 hover:bg-white/5 hover:text-white")}>{m}</button>
                                ))}
                              </div>
                            </div>

                            {/* Aspect Ratio */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">Aspect Ratio</label>
                              <div className="grid grid-cols-4 gap-1.5">
                                {['1:1', '4:3', '16:9', '9:16'].map((r) => (
                                  <button key={r} className={cn("px-2 py-2 rounded-xl text-[11px] font-bold transition-all border", r === '1:1' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.02] border-white/[0.05] text-white/30 hover:text-white/50')}>{r}</button>
                                ))}
                              </div>
                            </div>

                            {/* Quality & Style */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">Quality</label>
                                <div className="flex flex-col gap-1.5">
                                  {['Draft', 'HD', 'Ultra'].map(q => (
                                    <button key={q} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-left", q === 'Ultra' ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-white/30")}>{q}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">Style</label>
                                <div className="flex flex-col gap-1.5">
                                  {['Cinematic', 'Anime', 'Photo', 'Abstract'].map(s => (
                                    <button key={s} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-left", s === 'Cinematic' ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-white/30")}>{s}</button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Creativity */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">Creativity</label>
                                <span className="text-[10px] font-mono text-white/35">0.75</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[75%] bg-white/20 rounded-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-4"><button className="p-1.5 text-white/20 hover:text-white transition-colors"><Sliders className="w-4 h-4" /></button></div>
              </div>
            </div>
          </div>
          {!isGenerating && (
            <motion.div initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="flex justify-center">
              <button onClick={() => { if (localPrompt) onBegin(localPrompt); }} className="h-16 rounded-full text-sm font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl bg-white text-black px-12 uppercase tracking-widest cursor-pointer">Begin Generation <ArrowRight className="w-4 h-4" /></button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero({ isGenerating, setIsGenerating }: { isGenerating: boolean, setIsGenerating: (val: boolean) => void }) {
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [activeModel, setActiveModel] = useState("Tarum Ultra 1.0");
  const [thinkingMode, setThinkingMode] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

  const staticOffsetY = useMotionValue(0);

  const handleBegin = React.useCallback((promptText: string) => {
    if (!isGenerating) {
      if (promptText) setPromptHistory([promptText]);
      setIsGenerating(true);
      return;
    }
    if (!promptText && !selectedPreset && !selectedHistory) {
      setIsGenerating(false);
    } else if (promptText) {
      setPromptHistory(prev => [...prev, promptText]);
    }
  }, [isGenerating, selectedPreset, selectedHistory, setIsGenerating]);

  const handleImageClick = React.useCallback((src: string, isRight: boolean) => {
    if (!isGenerating) return;
    if (isRight) setSelectedHistory(src);
    else setSelectedPreset(src);
  }, [isGenerating]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pb-20 perspective-[2000px]">
      <HeroBackground isGenerating={isGenerating} onImageClick={handleImageClick} staticOffsetY={staticOffsetY} />
      <AnimatePresence>
        {isGenerating && (
          <React.Fragment key="side-labels">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="absolute left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none">
              <div className="flex items-center gap-2 text-white/30 vertical-text py-4 tracking-[0.2em] font-bold text-[10px] uppercase">Presets</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="absolute right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none">
              <div className="flex items-center gap-2 text-white/30 vertical-text py-4 tracking-[0.2em] font-bold text-[10px] uppercase">Effects</div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
      <HeroFront isGenerating={isGenerating} onBegin={handleBegin} selectedPreset={selectedPreset} setSelectedPreset={setSelectedPreset} selectedHistory={selectedHistory} setSelectedHistory={setSelectedHistory} activeModel={activeModel} setActiveModel={setActiveModel} thinkingMode={thinkingMode} setThinkingMode={setThinkingMode} promptHistory={promptHistory} />
      <style jsx global>{`
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </section>
  );
}
