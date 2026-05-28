import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Heart } from 'lucide-react'
import {
  retrospectiveData,
  type RetrospectiveMemory,
} from '../data/retrospective'
import { StoryViewer } from './StoryViewer'

const featuredMemoryStyle =
  'bg-[radial-gradient(circle_at_22%_20%,rgba(255,134,177,0.48),transparent_30%),radial-gradient(circle_at_76%_28%,rgba(152,80,255,0.34),transparent_32%),linear-gradient(145deg,#3a101f_0%,#7a1f42_46%,#2b1236_100%)]'

type MemoriesSectionProps = {
  memories?: RetrospectiveMemory[]
}

export function MemoriesSection({ memories }: MemoriesSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const visibleMemories =
    memories && memories.length > 0 ? memories.slice(0, 6) : retrospectiveData.memories.slice(0, 6)
  const firstMemory = visibleMemories[0]

  const handleNext = () => {
    setActiveIndex((current) =>
      current === null ? 0 : (current + 1) % visibleMemories.length,
    )
  }

  const handlePrevious = () => {
    setActiveIndex((current) =>
      current === null
        ? visibleMemories.length - 1
        : (current - 1 + visibleMemories.length) % visibleMemories.length,
    )
  }

  return (
    <>
      <motion.section
        aria-label="Memórias em formato de story"
        className="mt-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
      >
        <motion.button
          type="button"
          aria-label="Abrir memórias em formato de story"
          className={`group relative block w-full overflow-hidden rounded-[2rem] border border-rose-200/14 ${featuredMemoryStyle} aspect-[4/5] min-h-[390px] max-h-[560px] text-left shadow-[0_26px_70px_rgba(115,29,62,0.42)] outline-none ring-1 ring-white/5 transition duration-300 focus-visible:ring-2 focus-visible:ring-rose-300/70`}
          onClick={() => setActiveIndex(0)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.985 }}
        >
          {firstMemory?.imagePreviewUrl && (
            <img
              src={firstMemory.imagePreviewUrl}
              alt="Memória em destaque"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,transparent_30%,rgba(255,93,139,0.1)_64%,rgba(0,0,0,0.2)_100%)]" />
          <span className="absolute left-5 top-5 h-24 w-24 rounded-full bg-white/12 blur-2xl" />
          <span className="absolute right-8 top-16 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />
          <span className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/92 via-black/58 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(15,8,13,0.9))]" />

          <span className="absolute left-1/2 top-[43%] flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/22 text-rose-100 shadow-[0_0_42px_rgba(255,92,142,0.36)] backdrop-blur-md">
            <Heart className="h-9 w-9 fill-rose-300/70 text-rose-200" />
          </span>

          <span className="absolute inset-x-5 bottom-5 flex items-center justify-center rounded-full border border-rose-200/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(0,0,0,0.34)] backdrop-blur-xl transition duration-300 group-hover:bg-rose-300/18">
            <Camera className="mr-2 h-4 w-4 text-rose-100" />
            Abrir em story
          </span>
        </motion.button>
      </motion.section>

      <StoryViewer
        memories={visibleMemories}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  )
}
