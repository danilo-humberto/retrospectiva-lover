import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import type { RetrospectiveMemory } from '../data/retrospective'

type StoryViewerProps = {
  memories: RetrospectiveMemory[]
  activeIndex: number | null
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

const storyBackgrounds = [
  'bg-[radial-gradient(circle_at_24%_22%,rgba(255,142,182,0.48),transparent_31%),radial-gradient(circle_at_78%_30%,rgba(161,99,255,0.34),transparent_34%),linear-gradient(150deg,#35101d_0%,#812246_48%,#271132_100%)]',
  'bg-[radial-gradient(circle_at_76%_18%,rgba(255,190,213,0.42),transparent_28%),radial-gradient(circle_at_20%_70%,rgba(149,87,255,0.32),transparent_33%),linear-gradient(155deg,#230d1a_0%,#5c1737_48%,#38144e_100%)]',
  'bg-[radial-gradient(circle_at_30%_24%,rgba(255,114,160,0.46),transparent_32%),radial-gradient(circle_at_72%_72%,rgba(255,210,232,0.2),transparent_28%),linear-gradient(145deg,#42101f_0%,#98234f_44%,#27122f_100%)]',
  'bg-[radial-gradient(circle_at_68%_24%,rgba(255,132,177,0.42),transparent_30%),radial-gradient(circle_at_22%_78%,rgba(122,96,255,0.3),transparent_32%),linear-gradient(150deg,#22101c_0%,#6e1c42_47%,#3c1237_100%)]',
  'bg-[radial-gradient(circle_at_24%_22%,rgba(255,211,225,0.3),transparent_27%),radial-gradient(circle_at_76%_66%,rgba(255,89,141,0.4),transparent_34%),linear-gradient(145deg,#31111e_0%,#761f3d_48%,#201028_100%)]',
  'bg-[radial-gradient(circle_at_74%_20%,rgba(255,140,181,0.48),transparent_31%),radial-gradient(circle_at_24%_72%,rgba(177,100,255,0.26),transparent_33%),linear-gradient(155deg,#2a0e1b_0%,#8a2247_46%,#2c143b_100%)]',
]

export function StoryViewer({
  memories,
  activeIndex,
  onClose,
  onNext,
  onPrevious,
}: StoryViewerProps) {
  const activeMemory = activeIndex === null ? null : memories[activeIndex]
  const currentIndex = activeIndex ?? 0
  const activeMemoryImageUrl =
    activeMemory?.imageUrl ?? activeMemory?.imagePreviewUrl

  useEffect(() => {
    if (!activeMemory) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft') onPrevious()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeMemory, onClose, onNext, onPrevious])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {activeMemory && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-4 py-6 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-label="Memória em formato de story"
            className={`relative h-full max-h-[760px] w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-white/12 ${storyBackgrounds[currentIndex % storyBackgrounds.length]} shadow-[0_30px_90px_rgba(0,0,0,0.62),0_0_70px_rgba(255,83,137,0.28)]`}
            initial={{ scale: 0.94, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 18, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            {activeMemoryImageUrl && (
              <img
                src={activeMemoryImageUrl}
                alt="Memória em story"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.36)_0%,transparent_24%,transparent_58%,rgba(0,0,0,0.88)_100%)]" />
            <div className="absolute left-6 top-16 h-36 w-36 rounded-full bg-white/12 blur-3xl" />
            <div className="absolute bottom-24 right-4 h-44 w-44 rounded-full bg-rose-300/18 blur-3xl" />

            <div className="absolute inset-x-4 top-4 z-20 flex gap-1.5">
              {memories.map((memory, index) => (
                <span
                  key={memory.id}
                  className={`h-1 flex-1 rounded-full ${
                    index <= currentIndex ? 'bg-rose-100' : 'bg-white/24'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Fechar memórias"
              className="absolute right-4 top-8 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/26 text-white backdrop-blur-md transition hover:bg-white/12"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Memória anterior"
              className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/18 text-white/90 backdrop-blur-md transition hover:bg-white/12"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Próxima memória"
              className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/18 text-white/90 backdrop-blur-md transition hover:bg-white/12"
              onClick={onNext}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="relative flex h-full items-center justify-center px-8">
              {!activeMemoryImageUrl && (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/18 bg-black/18 text-rose-100 shadow-[0_0_54px_rgba(255,90,144,0.34)] backdrop-blur-xl">
                  <Camera className="h-12 w-12" />
                </div>
              )}
              <Heart className="absolute bottom-9 left-1/2 h-7 w-7 -translate-x-1/2 fill-rose-300/70 text-rose-100 drop-shadow-[0_0_18px_rgba(255,115,161,0.75)]" />
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
