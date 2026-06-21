"use client"

import React, { useState } from "react"
import {
  motion,
  AnimatePresence,
} from "framer-motion"
import { cn } from "@/lib/utils"
import { X, Maximize2 } from "lucide-react"

export type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  span: string
}

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  title: string
  description: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
}

const ImageModal = ({
  item,
  onClose,
}: {
  item: ImageItem
  onClose: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-6xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.title}
          className="h-auto max-h-[80vh] w-full rounded-[3rem] object-contain shadow-[0_0_100px_rgba(255,255,255,0.1)] border border-white/10"
        />
        <div className="mt-10 text-left">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">{item.title}</h2>
            <p className="text-xl text-white/50 font-medium max-w-2xl">{item.desc}</p>
        </div>
      </motion.div>
      <button
        onClick={onClose}
        className="absolute right-10 top-10 text-white/20 transition-all hover:text-white hover:rotate-90"
      >
        <X size={48} />
      </button>
    </motion.div>
  )
}

const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description }) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)

  return (
    <section className="relative w-full bg-black py-32 px-6 sm:px-12 md:px-24">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-20 space-y-4">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex items-center gap-4"
          >
             <span className="h-[1px] w-12 bg-white/20" />
             <span className="text-xs font-black uppercase tracking-[0.4em] text-white/40 italic">History View</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-xl text-white/40 font-medium"
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-6 grid-flow-dense"
          variants={containerVariants}
          initial="visible"
          animate="visible"
        >
          {[...imageItems, ...imageItems, ...imageItems].map((item, idx) => (
            <motion.div
              key={`${item.id}-${idx}`}
              variants={itemVariants}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] transition-all duration-700 hover:border-white/20",
                item.span // This will handle the bento grid logic (e.g. md:col-span-2 md:row-span-2)
              )}
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={item.url}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-40 transition-opacity duration-700 group-hover:opacity-80" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none italic">{item.title}</h3>
                <p className="mt-2 text-sm text-white/50 font-medium line-clamp-2">{item.desc}</p>
                <div className="mt-6 flex justify-end">
                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                        <Maximize2 size={20} />
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default InteractiveImageBentoGallery
