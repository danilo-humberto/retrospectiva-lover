import { motion } from 'framer-motion'
import { Disc3, Heart, Play } from 'lucide-react'

import type { RetrospectiveData } from '../data/retrospective'

type RetrospectiveStartScreenProps = {
  data: RetrospectiveData
  onStart: () => void
}

export function RetrospectiveStartScreen({
  data,
  onStart,
}: RetrospectiveStartScreenProps) {
  const coverImageUrl = data.coverUrl ?? data.coverPreviewUrl

  return (
    <main className="flex min-h-svh w-full items-stretch justify-center bg-[radial-gradient(circle_at_50%_0%,oklch(32%_0.12_355)_0%,oklch(14%_0.03_344)_44%,oklch(8%_0.018_342)_100%)] text-pearl md:items-center md:p-6">
      <motion.section
        className="relative min-h-svh w-full max-w-[430px] overflow-hidden bg-ink shadow-romance-panel ring-1 ring-pearl/15 md:h-[min(860px,calc(100svh-3rem))] md:min-h-0 md:rounded-[2rem]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-labelledby="public-retrospective-title"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,oklch(43%_0.16_356_/_0.34),transparent_36%),linear-gradient(180deg,oklch(13%_0.026_344),oklch(8%_0.018_342)_62%,oklch(5%_0.015_342))]" />
          <div className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-blush/18 blur-3xl" />
          <div className="absolute right-[-5rem] top-36 size-56 rounded-full bg-wine/46 blur-3xl" />
          <div className="absolute bottom-12 left-[-6rem] size-64 rounded-full bg-roseglow/16 blur-3xl" />

          {coverImageUrl && (
            <>
              <img
                src={coverImageUrl}
                alt=""
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-34 blur-xl"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(7%_0.018_342_/_0.58),oklch(6%_0.018_342_/_0.9)_58%,oklch(5%_0.015_342))]" />
            </>
          )}
        </div>

        <div className="relative z-10 flex min-h-svh flex-col px-7 pb-9 pt-10 text-center md:h-full md:min-h-0 md:px-9">
          <motion.div
            className="mt-auto flex flex-col items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative mb-8 w-full max-w-[17.5rem]">
              <div
                className="absolute inset-5 rounded-[2rem] bg-blush/35 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative aspect-square overflow-hidden rounded-[1.65rem] bg-[radial-gradient(circle_at_55%_24%,oklch(80%_0.16_18)_0%,transparent_25%),radial-gradient(circle_at_24%_76%,oklch(62%_0.2_316_/_0.86)_0%,transparent_34%),linear-gradient(135deg,oklch(70%_0.2_356),oklch(31%_0.12_345)_48%,oklch(20%_0.09_300))] shadow-[0_0_0_1px_oklch(96%_0.012_348_/_0.18),0_26px_70px_oklch(67%_0.2_356_/_0.28)]">
                {coverImageUrl ? (
                  <>
                    <img
                      src={coverImageUrl}
                      alt="Capa da retrospectiva"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(100%_0_0_/_0.16),transparent_34%),radial-gradient(circle_at_50%_50%,transparent_0_46%,oklch(8%_0.02_342_/_0.5)_100%)]" />
                  </>
                ) : (
                  <div className="relative flex h-full flex-col items-center justify-center gap-5">
                    <div className="grid size-24 place-items-center rounded-full bg-ink/48 text-pearl shadow-[0_0_44px_oklch(96%_0.012_348_/_0.14)] ring-1 ring-pearl/18 backdrop-blur-md">
                      <Disc3 className="size-12" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <p className="max-w-40 text-xs font-bold uppercase tracking-[0.3em] text-pearl/72">
                      Nossa história
                    </p>
                  </div>
                )}
              </div>

              <div
                className="absolute -bottom-4 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full bg-blush text-pearl shadow-[0_0_30px_oklch(69%_0.21_356_/_0.5)] ring-4 ring-ink"
                aria-hidden="true"
              >
                <Heart className="size-4 fill-current" strokeWidth={2.6} />
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blush">
              {data.coupleName}
            </p>
            <h1
              id="public-retrospective-title"
              className="mt-4 text-[2.25rem] font-extrabold leading-tight text-pearl"
            >
              {data.retrospectiveTitle}
            </h1>
            <p className="mt-4 max-w-[18rem] text-base font-medium leading-7 text-mist/82">
              {data.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="mt-auto flex w-full flex-col items-center gap-5 pt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
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
