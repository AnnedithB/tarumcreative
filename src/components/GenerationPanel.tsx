"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Settings, Image as ImageIcon, Wand2, Zap, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GenerationPanel() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <section className="py-20 bg-slate-950/50" id="generate">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="glass-morphism rounded-3xl p-6 space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg">Generation Settings</h3>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-400">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Layout, label: "1:1", active: true },
                    { icon: Layout, label: "16:9", active: false },
                    { icon: Layout, label: "9:16", active: false },
                  ].map((ratio) => (
                    <button 
                      key={ratio.label}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                        ratio.active 
                          ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" 
                          : "border-white/5 bg-white/5 hover:bg-white/10 text-slate-500"
                      )}
                    >
                      <ratio.icon className="w-4 h-4 mb-1" />
                      <span className="text-xs">{ratio.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-400">Style Profile</label>
                <div className="space-y-2">
                  {["Cinematic Hyper-realism", "Cyberpunk Digital Art", "Classic Oil Painting", "Minimalist Vector"].map((style, idx) => (
                    <button 
                      key={style}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all",
                        idx === 0 
                          ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" 
                          : "border-white/5 bg-white/5 hover:bg-white/10 text-slate-400"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-400">Guidance Scale</span>
                  <span className="text-sm text-indigo-400 font-bold">7.5</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                </div>
              </div>
            </div>
            
            <div className="glass-morphism rounded-3xl p-6 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border-indigo-500/20">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold">Turbo Engine</h4>
                  <p className="text-xs text-slate-400">Generation is 3x faster with our premium servers.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Prompt & Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            <div className="glass-morphism rounded-3xl p-8 flex flex-col gap-6">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to see... e.g., 'A futuristic city floating in the clouds during a pink sunset, cinematic lighting, 8k'"
                  className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-600"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                      isGenerating || !prompt 
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    )}
                  >
                    {isGenerating ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Wand2 className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isGenerating ? "Synthesizing..." : "Generate"}
                  </button>
                </div>
              </div>
              
              <div className="relative aspect-video rounded-2xl bg-slate-900/50 border border-white/5 overflow-hidden flex items-center justify-center group">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 text-center"
                    >
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                        <motion.div 
                          className="absolute inset-0 border-4 border-t-indigo-500 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                      </div>
                      <p className="text-slate-400 animate-pulse">Consulting neural networks...</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-8"
                    >
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Ready to create</h4>
                      <p className="text-slate-500">Your generated image will appear here.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Simulated Glow when empty */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
