import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Heart, Quote } from 'lucide-react'

import { retrospectiveData } from '../data/retrospective'

const PREVIEW_LINES = 3
const ACTIVE_LINE_INDEX = 2

type LyricsPreviewProps = {
  lyrics?: string[]
}

export function LyricsPreview({ lyrics }: LyricsPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const displayLyrics = lyrics && lyrics.length > 0 ? lyrics : retrospectiveData.lyrics
  const visibleLines = isExpanded ? displayLyrics : displayLyrics.slice(0, PREVIEW_LINES)

  return (
    <motion.section
      layout
      className="relative w-full overflow-hidden rounded-[1.45rem] border border-pearl/12 bg-[linear-gradient(145deg,oklch(17%_0.035_344_/_0.84),oklch(12%_0.026_342_/_0.78)_52%,oklch(26%_0.08_356_/_0.58))] p-5 text-left shadow-[0_24px_70px_oklch(4%_0.012_342_/_0.46),0_0_52px_oklch(69%_0.21_356_/_0.14)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="lyrics-preview-title"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -right-12 -top-14 size-36 rounded-full bg-blush/18 blur-3xl" />
        <div className="absolute -bottom-16 left-0 size-40 rounded-full bg-wine/35 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(96%_0.012_348_/_0.08),transparent_38%)]" />
      </div>

      <div className="relative">
        <header className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-blush">
              <Quote className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
              Mensagem
            </p>
            <h2 id="lyrics-preview-title" className="mt-2 text-lg font-bold leading-snug text-pearl">
              Para ouvir com o coração
            </h2>
          </div>

          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blush/18 text-blush ring-1 ring-blush/22">
            <Heart className="size-4 fill-current" strokeWidth={2.5} aria-hidden="true" />
          </div>
        </header>

        <motion.div layout className="space-y-3.5">
          <AnimatePresence initial={false}>
            {visibleLines.map((line, index) => {
              const isActive = index === ACTIVE_LINE_INDEX

              return (
                <motion.p
                  key={`${line}-${index}`}
                  layout
                  className={`text-[0.95rem] leading-7 ${
                    isActive ? 'font-semibold text-blush' : 'font-medium text-pearl/82'
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                </motion.p>
              )
            })}
          </AnimatePresence>
        </motion.div>

        <button
          type="button"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-blush/28 bg-blush/12 px-4 py-3 text-sm font-bold text-pearl shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.12)] transition duration-200 hover:bg-blush/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush"
          aria-expanded={isExpanded}
          aria-controls="lyrics-preview-title"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Mostrar menos' : 'Mostrar mensagem completa'}
          <ChevronDown
            className={`size-4 transition duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            strokeWidth={2.4}
            aria-hidden="true"
          />
        </button>
      </div>
    </motion.section>
  )
}
