import { motion } from 'framer-motion'
import { Heart, Play } from 'lucide-react'

export type StartScreenProps = {
  onStart: () => void
}

const memoryCards = [
  { className: 'memory-card-a', delay: 0.05 },
  { className: 'memory-card-b', delay: 0.12 },
  { className: 'memory-card-c', delay: 0.19 },
  { className: 'memory-card-d', delay: 0.26 },
  { className: 'memory-card-e', delay: 0.33 },
]

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="flex min-h-svh w-full items-stretch justify-center bg-[radial-gradient(circle_at_50%_0%,oklch(31%_0.11_355)_0%,oklch(15%_0.03_344)_42%,oklch(9%_0.018_342)_100%)] text-pearl md:items-center md:p-6">
      <motion.section
        className="relative min-h-svh w-full max-w-[430px] overflow-hidden bg-ink shadow-romance-panel ring-1 ring-pearl/15 md:h-[min(860px,calc(100svh-3rem))] md:min-h-0 md:rounded-[2rem]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        aria-labelledby="start-title"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,oklch(45%_0.16_8_/_0.38),transparent_34%),linear-gradient(180deg,oklch(18%_0.04_344),oklch(8%_0.02_342)_64%,oklch(6%_0.018_342))]" />

          {memoryCards.map((card) => (
            <motion.div
              key={card.className}
              className={`memory-card ${card.className}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.72, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: card.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,oklch(7%_0.02_342_/_0.35)_38%,oklch(5%_0.018_342_/_0.9)_78%),linear-gradient(180deg,oklch(6%_0.018_342_/_0.35),oklch(8%_0.02_342_/_0.64)_45%,oklch(5%_0.018_342_/_0.96))] backdrop-blur-[2px]" />
          <div className="absolute inset-x-0 top-[31%] h-28 bg-blush/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-svh flex-col items-center px-7 pb-9 pt-12 text-center md:h-full md:min-h-0 md:px-9">
          <motion.div
            className="mt-auto flex flex-col items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="mb-6 grid size-16 place-items-center rounded-full bg-blush text-pearl shadow-[0_0_38px_oklch(69%_0.21_356_/_0.58)] ring-1 ring-pearl/20"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <Heart className="size-8 fill-current" strokeWidth={2.4} aria-hidden="true" />
            </motion.div>

            <h1 id="start-title" className="max-w-[18rem] leading-none">
              <span className="mb-3 block text-sm font-medium uppercase tracking-[0.42em] text-mist">
                Nossa
              </span>
              <span className="block text-[2.45rem] font-extrabold text-blush sm:text-5xl">
                Retrospectiva
              </span>
            </h1>

            <p className="mt-5 max-w-[17rem] text-base leading-7 text-pearl/90">
              Uma história, uma música e milhares de momentos.
            </p>
          </motion.div>

          <motion.div
            className="mt-auto flex w-full flex-col items-center gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex min-h-14 w-full max-w-[21rem] items-center justify-center gap-3 rounded-full bg-blush px-6 text-sm font-bold text-pearl shadow-romance-button transition duration-200 ease-out hover:bg-roseglow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush active:scale-[0.99]"
            >
              <Play
                className="size-4 fill-current transition duration-200 ease-out group-hover:translate-x-0.5"
                strokeWidth={2.6}
                aria-hidden="true"
              />
              Começar retrospectiva
            </button>

            <p className="text-sm font-medium text-mist/75">Prepare os fones ❤️</p>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
