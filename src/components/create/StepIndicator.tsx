import { motion } from 'framer-motion'

type StepIndicatorStep = {
  id: number
  label: string
}

type StepIndicatorProps = {
  steps: readonly StepIndicatorStep[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Etapas da criação" className="relative px-1">
      <ol className="relative grid grid-cols-4">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep
          const isCompleted = step.id < currentStep
          const isFuture = step.id > currentStep
          const hasNextStep = index < steps.length - 1

          return (
            <li key={step.id} className="relative flex min-w-0 flex-col items-center gap-2">
              {hasNextStep && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[calc(50%+1rem)] right-[calc(-50%+1rem)] top-4 h-px bg-pearl/14"
                >
                  <motion.div
                    className="h-full rounded-full bg-blush shadow-[0_0_18px_oklch(69%_0.21_356_/_0.42)]"
                    initial={false}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              )}

              <motion.div
                className={`relative z-10 grid size-8 place-items-center rounded-full border text-[0.72rem] font-extrabold transition-colors duration-200 ${
                  isCurrent
                    ? 'border-blush bg-blush text-pearl shadow-[0_0_30px_oklch(69%_0.21_356_/_0.46)]'
                    : isCompleted
                      ? 'border-blush/55 bg-blush/18 text-blush'
                      : 'border-pearl/16 bg-ink/70 text-mist/46'
                }`}
                animate={isCurrent ? { scale: 1.08 } : { scale: 1 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {step.id}
              </motion.div>

              <span
                className={`max-w-[4.8rem] text-center text-[0.58rem] font-bold uppercase leading-3 tracking-[0.08em] sm:text-[0.62rem] sm:tracking-[0.12em] ${
                  isCurrent
                    ? 'text-pearl'
                    : isCompleted
                      ? 'text-blush/86'
                      : isFuture
                        ? 'text-mist/42'
                        : 'text-mist/62'
                }`}
              >
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
