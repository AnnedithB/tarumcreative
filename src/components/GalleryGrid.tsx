"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Search, Download } from "lucide-react";

const GALLERY_IMAGES = [
  { id: 1, src: "/gallery/1.png", title: "Cyberpunk Night" },
  { id: 2, src: "/gallery/2.png", title: "Enchanted Library" },
  { id: 3, src: "/gallery/3.png", title: "Stellar Interior" },
  { id: 4, src: "/gallery/4.png", title: "Cosmic Abstract" },
];

export default function GalleryGrid() {
  return (
    <section className="py-24" id="gallery">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Featured <span className="text-gradient">Creation</span></h2>
          <p className="text-slate-400">Discover what the community is creating with CreativAI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-square rounded-3xl overflow-hidden glass-morphism cursor-pointer"
            >
              <Image 
                src={img.src} 
                alt={img.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h4 className="text-lg font-bold mb-2">{img.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm font-medium hover:text-rose-400 transition-colors">
                      <Heart className="w-4 h-4" />
                      1.2k
                    </button>
                    <button className="flex items-center gap-1 text-sm font-medium hover:text-indigo-400 transition-colors">
                      <Search className="w-4 h-4" />
                      View
                    </button>
                  </div>
                  <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="glass-morphism px-8 py-3 rounded-full font-semibold hover:bg-white/5 transition-colors cursor-pointer">
            View All Showcase
          </button>
        </div>
      </div>
    </section>
  );
}
