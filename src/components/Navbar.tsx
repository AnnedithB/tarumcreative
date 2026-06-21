"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-morphism rounded-full px-8 py-3 flex items-center gap-8 max-w-5xl w-full justify-between border-white/5"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-outfit font-black text-3xl tracking-tighter text-white uppercase italic">TARUM</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {["Create", "Industry", "Pricing", "Tutorial"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-[13px] font-bold text-white/40 hover:text-white transition-colors tracking-tight"
            >
              {item}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-[13px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer">
            Log in
          </button>
          <button className="bg-white text-black px-7 py-2.5 rounded-full text-[13px] font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 cursor-pointer">
            Start Generating
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
