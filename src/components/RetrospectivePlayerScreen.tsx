import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronDown,
  Disc3,
  Heart,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'

import { retrospectiveData, type RetrospectiveData } from '../data/retrospective'
import { formatTime } from '../utils/formatTime'
import { LyricsPreview } from './LyricsPreview'
import { MemoriesSection } from './MemoriesSection'
import { TimeTogetherCard } from './TimeTogetherCard'

type RetrospectivePlayerScreenProps = {
  data?: RetrospectiveData
  onCreateNew?: () => void
}

export function RetrospectivePlayerScreen({
  data,
  onCreateNew,
}: RetrospectivePlayerScreenProps) {
  const displayData = data ?? retrospectiveData
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackError, setPlaybackError] = useState<string | null>(null)

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0
  const coverImageUrl = displayData.coverUrl ?? displayData.coverPreviewUrl
  const coupleInitials =
    displayData.coupleName
      .split('&')
      .map((name) => name.trim().charAt(0))
      .filter(Boolean)
      .join(' & ') || 'D & A'

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const updateDuration = () => {
    const audio = audioRef.current

    if (!audio || !Number.isFinite(audio.duration)) {
      return
    }

    setDuration(audio.duration)
  }

  const handleTogglePlay = async () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    setPlaybackError(null)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    if (duration > 0 && audio.currentTime >= duration - 0.2) {
      audio.currentTime = 0
      setCurrentTime(0)
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
      setPlaybackError('Não foi possível tocar o áudio.')
    }
  }

  const handleSeek = (nextTime: number) => {
    const audio = audioRef.current

    if (!audio || duration <= 0) {
      return
    }

    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  return (
    <main className="flex min-h-svh w-full items-stretch justify-center bg-[radial-gradient(circle_at_50%_0%,oklch(32%_0.12_355)_0%,oklch(14%_0.03_344)_44%,oklch(8%_0.018_342)_100%)] text-pearl md:items-center md:p-6">
      <motion.section
        className="relative h-svh w-full max-w-[430px] overflow-hidden bg-ink shadow-romance-panel ring-1 ring-pearl/15 md:h-[min(860px,calc(100svh-3rem))] md:rounded-[2rem]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-labelledby="player-title"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,oklch(40%_0.15_356_/_0.34),transparent_34%),linear-gradient(180deg,oklch(12%_0.025_344),oklch(8%_0.018_342)_62%,oklch(5%_0.015_342))]" />
          <div className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-blush/18 blur-3xl" />
          <div className="absolute right-[-5rem] top-32 size-56 rounded-full bg-wine/45 blur-3xl" />
          <div className="absolute bottom-10 left-[-6rem] size-64 rounded-full bg-roseglow/16 blur-3xl" />
        </div>

        <div className="romance-screen-scroll relative z-10 flex h-full flex-col overflow-y-auto px-6 pb-9 pt-8 md:px-8">
          <motion.header
            className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid size-10 place-items-center rounded-full text-pearl/90" aria-hidden="true">
              <ChevronDown className="size-5" strokeWidth={2.4} aria-hidden="true" />
            </div>

            <p className="text-center text-[0.68rem] font-bold uppercase tracking-[0.2em] text-mist">
              {displayData.retrospectiveTitle}
            </p>

            <div className="grid size-10 place-items-center text-blush">
              <Heart className="size-4 fill-current" strokeWidth={2.5} aria-hidden="true" />
            </div>
          </motion.header>

          <motion.div
            className="mt-8 flex flex-1 flex-col items-center text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full max-w-[17.5rem]">
              <div className="absolute inset-5 rounded-[2rem] bg-blush/35 blur-3xl" aria-hidden="true" />

              <div className="relative aspect-square overflow-hidden rounded-[1.65rem] bg-[radial-gradient(circle_at_55%_24%,oklch(80%_0.16_18)_0%,transparent_25%),radial-gradient(circle_at_24%_76%,oklch(62%_0.2_316_/_0.86)_0%,transparent_34%),linear-gradient(135deg,oklch(70%_0.2_356),oklch(31%_0.12_345)_48%,oklch(20%_0.09_300))] shadow-[0_0_0_1px_oklch(96%_0.012_348_/_0.18),0_26px_70px_oklch(67%_0.2_356_/_0.28)]">
                {coverImageUrl ? (
                  <>
                    <img
                      src={coverImageUrl}
                      alt="Capa da retrospectiva"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(100%_0_0_/_0.16),transparent_34%),radial-gradient(circle_at_50%_50%,transparent_0_48%,oklch(8%_0.02_342_/_0.52)_100%)]" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(100%_0_0_/_0.22),transparent_34%),radial-gradient(circle_at_50%_50%,transparent_0_38%,oklch(8%_0.02_342_/_0.38)_72%)]" />
                    <div className="absolute inset-8 rounded-full border border-pearl/18" />
                    <div className="absolute left-1/2 top-[38%] size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pearl/16" />
                    <div className="relative flex h-full flex-col items-center justify-center gap-5">
                      <motion.div
                        className="grid size-24 place-items-center rounded-full bg-ink/48 text-pearl shadow-[0_0_44px_oklch(96%_0.012_348_/_0.14)] ring-1 ring-pearl/18 backdrop-blur-md"
                        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                        transition={{
                          duration: 8,
                          ease: 'linear',
                          repeat: isPlaying ? Infinity : 0,
                        }}
                      >
                        <Disc3 className="size-12" strokeWidth={1.8} aria-hidden="true" />
                      </motion.div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-pearl/75">{coupleInitials}</p>
                        <p className="mx-auto mt-2 max-w-40 truncate text-xs font-medium text-pearl/62">
                          {displayData.subtitle}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div
                className="absolute -bottom-4 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full bg-blush text-pearl shadow-[0_0_30px_oklch(69%_0.21_356_/_0.5)] ring-4 ring-ink"
                aria-hidden="true"
              >
                <Heart className="size-4 fill-current" strokeWidth={2.6} />
              </div>
            </div>

            <div className="mt-12">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blush">Tocando agora</p>
              <h1 id="player-title" className="mt-3 text-[1.85rem] font-extrabold leading-tight text-pearl">
                {displayData.songTitle}
              </h1>
              <p className="mt-2 text-base font-medium text-mist">{displayData.coupleName}</p>
              <p className="mt-1 text-sm text-mist/62">{displayData.artistName}</p>
            </div>

            <div className="mt-8 w-full">
              <input
                className="romance-progress"
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={(event) => handleSeek(Number(event.currentTarget.value))}
                style={{ '--progress': `${progress}%` } as CSSProperties}
                aria-label="Progresso da música"
              />

              <div className="mt-3 flex items-center justify-between text-xs font-medium text-mist/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mt-7 flex w-full items-center justify-between px-1">
              <button
                type="button"
                className="grid size-11 cursor-default place-items-center rounded-full text-mist/38"
                aria-label="Aleatório indisponível nesta etapa"
                disabled
              >
                <Shuffle className="size-4" strokeWidth={2.2} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="grid size-11 place-items-center rounded-full text-pearl transition duration-200 hover:bg-pearl/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush"
                aria-label="Voltar música"
                onClick={() => handleSeek(0)}
              >
                <SkipBack className="size-5 fill-current" strokeWidth={2.2} aria-hidden="true" />
              </button>

              <motion.button
                type="button"
                onClick={handleTogglePlay}
                className="grid size-[4.35rem] place-items-center rounded-full bg-blush text-pearl shadow-romance-button transition duration-200 hover:bg-roseglow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush active:scale-[0.98]"
                aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
                whileTap={{ scale: 0.96 }}
              >
                {isPlaying ? (
                  <Pause className="size-7 fill-current" strokeWidth={2.4} aria-hidden="true" />
                ) : (
                  <Play className="ml-1 size-7 fill-current" strokeWidth={2.4} aria-hidden="true" />
                )}
              </motion.button>

              <button
                type="button"
                className="grid size-11 place-items-center rounded-full text-pearl transition duration-200 hover:bg-pearl/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush"
                aria-label="Avançar música"
                onClick={() => handleSeek(duration)}
              >
                <SkipForward className="size-5 fill-current" strokeWidth={2.2} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="grid size-11 cursor-default place-items-center rounded-full text-mist/38"
                aria-label="Repetir indisponível nesta etapa"
                disabled
              >
                <Repeat2 className="size-4" strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            {playbackError && <p className="mt-5 text-sm font-medium text-blush">{playbackError}</p>}

            <div className="mt-8 w-full pb-2">
              <LyricsPreview lyrics={displayData.lyrics} />
            </div>

            <div className="mt-5 w-full pb-2">
              <TimeTogetherCard
                coupleName={displayData.coupleName}
                startDate={displayData.startDate}
                storyPhotoUrl={
                  displayData.storyPhotoUrl ?? displayData.storyPhotoPreviewUrl
                }
              />
            </div>

            <div className="mt-5 w-full pb-8">
              <MemoriesSection memories={displayData.memories} />
            </div>

            {onCreateNew && (
              <button
                type="button"
                className="mb-2 inline-flex min-h-11 items-center justify-center rounded-full border border-pearl/12 bg-pearl/[0.06] px-5 text-xs font-bold text-mist/78 transition duration-200 hover:border-blush/30 hover:bg-blush/10 hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush"
                onClick={onCreateNew}
              >
                Criar nova retrospectiva
              </button>
            )}
          </motion.div>
        </div>

        <audio
          ref={audioRef}
          src={displayData.audioUrl}
          preload="metadata"
          onLoadedMetadata={updateDuration}
          onDurationChange={updateDuration}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </motion.section>
    </main>
  )
}
