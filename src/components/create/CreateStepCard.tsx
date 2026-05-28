import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import type { ReactNode } from 'react'

type CreateStepCardStep = {
  id: number
  label: string
  placeholder: string
}

type CreateStepCardProps = {
  step: CreateStepCardStep
  isFirstStep: boolean
  onPrevious: () => void
  onNext: () => void
  primaryActionLabel: string
  children?: ReactNode
}

export function CreateStepCard({
  step,
  isFirstStep,
  onPrevious,
  onNext,
  primaryActionLabel,
  children,
}: CreateStepCardProps) {
  const hasCustomContent = Array.isArray(children)
    ? children.some(Boolean)
    : Boolean(children)

  return (
    <motion.section
      layout
      className="relative overflow-hidden rounded-[1.55rem] border border-pearl/12 bg-[linear-gradient(145deg,oklch(17%_0.035_344_/_0.86),oklch(12%_0.026_342_/_0.8)_52%,oklch(27%_0.08_356_/_0.62))] p-5 text-left shadow-[0_24px_70px_oklch(4%_0.012_342_/_0.5),0_0_52px_oklch(69%_0.21_356_/_0.14)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="create-step-title"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -right-14 -top-12 size-36 rounded-full bg-blush/18 blur-3xl" />
        <div className="absolute -bottom-16 left-0 size-44 rounded-full bg-wine/38 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(96%_0.012_348_/_0.08),transparent_42%)]" />
      </div>

      <div className="relative">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-blush">
              Etapa {step.id}
            </p>
            <p id="create-step-title" className="mt-2 text-sm font-semibold text-mist/72">
              {step.label}
            </p>
          </div>

          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-blush/18 text-blush ring-1 ring-blush/22">
            <Heart className="size-4 fill-current" strokeWidth={2.5} aria-hidden="true" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            className={`min-h-[12rem] rounded-[1.25rem] border border-pearl/10 bg-ink/34 px-5 py-8 shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.08)] ${
              hasCustomContent ? 'text-left' : 'grid place-items-center text-center'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {hasCustomContent ? (
              children
            ) : (
              <h2
                className="text-2xl font-extrabold leading-tight text-pearl"
              >
                {step.placeholder}
              </h2>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-pearl/12 bg-pearl/7 px-4 text-sm font-bold text-pearl transition duration-200 hover:bg-pearl/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onPrevious}
            disabled={isFirstStep}
          >
            <ChevronLeft className="size-4" strokeWidth={2.4} aria-hidden="true" />
            Voltar
          </button>

          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blush px-4 text-sm font-bold text-pearl shadow-romance-button transition duration-200 hover:bg-roseglow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush disabled:cursor-not-allowed disabled:opacity-55"
            onClick={onNext}
          >
            {primaryActionLabel}
            <ChevronRight className="size-4" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.section>
  )
}
