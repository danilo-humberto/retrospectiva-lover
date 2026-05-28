import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  Heart,
  ImagePlus,
  MessageCircle,
  Music2,
  Plus,
  Trash2,
} from 'lucide-react'

import { CreateStepCard } from '../components/create/CreateStepCard'
import { StepIndicator } from '../components/create/StepIndicator'
import {
  retrospectiveData,
  type RetrospectiveData,
  type RetrospectiveMemory,
} from '../data/retrospective'

const createSteps = [
  {
    id: 1,
    label: 'Dados',
    placeholder: '',
  },
  {
    id: 2,
    label: 'Música e mensagem',
    placeholder: 'Música e mensagem',
  },
  {
    id: 3,
    label: 'Memórias',
    placeholder: 'Memórias',
  },
  {
    id: 4,
    label: 'Preview',
    placeholder: 'Preview da retrospectiva',
  },
] as const

type CreateRetrospectiveScreenProps = {
  onFinish: (formData: RetrospectiveData) => void
}

type MainDataForm = {
  coupleName: string
  retrospectiveTitle: string
  subtitle: string
  startDate: string
}

type MusicMessageForm = {
  songTitle: string
  artistName: string
  lyricsText: string
}

type CreateMemory = {
  id: number
  file?: File
  imagePreviewUrl?: string
}

const MAX_MEMORIES = 6

const mainDataFields = [
  {
    id: 'coupleName',
    label: 'Nome do casal',
    placeholder: 'Ex: Danilo & Amor',
    type: 'text',
  },
  {
    id: 'retrospectiveTitle',
    label: 'Título da retrospectiva',
    placeholder: 'Ex: Nossa Retrospectiva',
    type: 'text',
  },
  {
    id: 'subtitle',
    label: 'Subtítulo',
    placeholder: 'Ex: Uma história, uma música e milhares de momentos.',
    type: 'text',
  },
  {
    id: 'startDate',
    label: 'Data de início do relacionamento',
    placeholder: '',
    type: 'date',
  },
] as const

const formInputClass =
  'min-h-12 w-full rounded-2xl border border-pearl/10 bg-pearl/[0.06] px-4 text-sm font-semibold text-pearl shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.08)] outline-none transition duration-200 placeholder:text-mist/38 focus:border-blush/70 focus:bg-blush/[0.08] focus:shadow-[0_0_0_3px_oklch(69%_0.21_356_/_0.14),inset_0_1px_0_oklch(96%_0.012_348_/_0.1)]'

const sectionTitleClass =
  'text-[0.68rem] font-bold uppercase tracking-[0.22em] text-blush'

const previewGroupClass =
  'rounded-[1.2rem] border border-pearl/10 bg-pearl/[0.055] p-4 shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.08)]'

const getPreviewValue = (value: string) => value.trim() || 'Não informado'

const formatPreviewDate = (value: string) => {
  if (!value) {
    return 'Não informado'
  }

  const [year, month, day] = value.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

export function CreateRetrospectiveScreen({
  onFinish,
}: CreateRetrospectiveScreenProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [mainData, setMainData] = useState<MainDataForm>({
    coupleName: '',
    retrospectiveTitle: '',
    subtitle: '',
    startDate: '',
  })
  const [musicMessage, setMusicMessage] = useState<MusicMessageForm>({
    songTitle: retrospectiveData.songTitle,
    artistName: retrospectiveData.artistName,
    lyricsText: retrospectiveData.lyrics.join('\n'),
  })
  const [memoryItems, setMemoryItems] = useState<CreateMemory[]>([{ id: 1 }])
  const nextMemoryIdRef = useRef(2)
  const memoryItemsRef = useRef(memoryItems)
  const shouldPreserveMemoryUrlsRef = useRef(false)

  const currentStepData = useMemo(
    () => createSteps.find((step) => step.id === currentStep) ?? createSteps[0],
    [currentStep],
  )
  const previewMessageLines = musicMessage.lyricsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const previewMessageExcerpt = previewMessageLines.slice(0, 3)
  const remainingMessageLines =
    previewMessageLines.length - previewMessageExcerpt.length
  const selectedMemoryCount = memoryItems.filter(
    (memory) => memory.imagePreviewUrl,
  ).length
  const mainDataPreviewItems = [
    {
      label: 'Nome do casal',
      value: getPreviewValue(mainData.coupleName),
    },
    {
      label: 'Título da retrospectiva',
      value: getPreviewValue(mainData.retrospectiveTitle),
    },
    {
      label: 'Subtítulo',
      value: getPreviewValue(mainData.subtitle),
    },
    {
      label: 'Data de início',
      value: formatPreviewDate(mainData.startDate),
    },
  ]
  const musicPreviewItems = [
    {
      label: 'Nome da música',
      value: getPreviewValue(musicMessage.songTitle),
    },
    {
      label: 'Artista/subtítulo',
      value: getPreviewValue(musicMessage.artistName),
    },
    {
      label: 'Arquivo atual',
      value: retrospectiveData.audioUrl,
    },
  ]

  useEffect(() => {
    memoryItemsRef.current = memoryItems
  }, [memoryItems])

  useEffect(() => {
    return () => {
      if (shouldPreserveMemoryUrlsRef.current) {
        return
      }

      memoryItemsRef.current.forEach((memory) => {
        if (memory.imagePreviewUrl) {
          URL.revokeObjectURL(memory.imagePreviewUrl)
        }
      })
    }
  }, [])

  const handlePrevious = () => {
    setCurrentStep((step) => Math.max(1, step - 1))
  }

  const handleNext = () => {
    if (currentStep === createSteps.length) {
      shouldPreserveMemoryUrlsRef.current = true
      onFinish(buildRetrospectivePayload())
      return
    }

    setCurrentStep((step) => Math.min(createSteps.length, step + 1))
  }

  const handleMainDataChange =
    (field: keyof MainDataForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setMainData((currentData) => ({
        ...currentData,
        [field]: event.target.value,
      }))
    }

  const handleMusicMessageInputChange =
    (field: keyof Pick<MusicMessageForm, 'songTitle' | 'artistName'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setMusicMessage((currentData) => ({
        ...currentData,
        [field]: event.target.value,
      }))
    }

  const handleLyricsTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMusicMessage((currentData) => ({
      ...currentData,
      lyricsText: event.target.value,
    }))
  }

  const handleAddMemory = () => {
    setMemoryItems((currentMemories) => {
      if (currentMemories.length >= MAX_MEMORIES) {
        return currentMemories
      }

      const nextMemory = { id: nextMemoryIdRef.current }
      nextMemoryIdRef.current += 1

      return [...currentMemories, nextMemory]
    })
  }

  const handleRemoveMemory = (memoryId: number) => {
    setMemoryItems((currentMemories) => {
      if (currentMemories.length <= 1) {
        return currentMemories
      }

      const removedMemory = currentMemories.find((memory) => memory.id === memoryId)

      if (removedMemory?.imagePreviewUrl) {
        URL.revokeObjectURL(removedMemory.imagePreviewUrl)
      }

      return currentMemories.filter((memory) => memory.id !== memoryId)
    })
  }

  const handleMemoryImageChange =
    (memoryId: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]

      if (!selectedFile) {
        return
      }

      const imagePreviewUrl = URL.createObjectURL(selectedFile)

      setMemoryItems((currentMemories) =>
        currentMemories.map((memory) => {
          if (memory.id !== memoryId) {
            return memory
          }

          if (memory.imagePreviewUrl) {
            URL.revokeObjectURL(memory.imagePreviewUrl)
          }

          return {
            ...memory,
            file: selectedFile,
            imagePreviewUrl,
          }
        }),
      )

      event.target.value = ''
    }

  const buildRetrospectivePayload = (): RetrospectiveData => {
    const lyrics = previewMessageLines.length > 0
      ? previewMessageLines
      : retrospectiveData.lyrics
    const memories: RetrospectiveMemory[] = memoryItems
      .slice(0, MAX_MEMORIES)
      .map((memory, index) => {
        const fallbackMemory = retrospectiveData.memories[index]

        return {
          id: memory.id,
          title: fallbackMemory?.title,
          caption: fallbackMemory?.caption,
          imagePreviewUrl: memory.imagePreviewUrl,
        }
      })

    return {
      coupleName: mainData.coupleName.trim() || retrospectiveData.coupleName,
      retrospectiveTitle:
        mainData.retrospectiveTitle.trim() || retrospectiveData.retrospectiveTitle,
      subtitle: mainData.subtitle.trim() || retrospectiveData.subtitle,
      startDate: mainData.startDate || retrospectiveData.startDate,
      songTitle: musicMessage.songTitle.trim() || retrospectiveData.songTitle,
      artistName: musicMessage.artistName.trim() || retrospectiveData.artistName,
      audioUrl: retrospectiveData.audioUrl,
      lyrics,
      memories: memories.length > 0 ? memories : retrospectiveData.memories,
    }
  }

  return (
    <main className="flex min-h-svh w-full items-stretch justify-center bg-[radial-gradient(circle_at_50%_0%,oklch(34%_0.13_356)_0%,oklch(15%_0.032_344)_46%,oklch(8%_0.018_342)_100%)] text-pearl md:items-center md:p-6">
      <motion.section
        className="relative flex min-h-svh w-full max-w-[430px] flex-col overflow-hidden bg-ink px-6 pb-8 pt-9 shadow-romance-panel ring-1 ring-pearl/15 md:min-h-[min(780px,calc(100svh-3rem))] md:rounded-[2rem] md:px-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,oklch(41%_0.15_356_/_0.34),transparent_34%),linear-gradient(180deg,oklch(13%_0.026_344),oklch(8%_0.018_342)_64%,oklch(5%_0.015_342))]" />
          <div className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-blush/18 blur-3xl" />
          <div className="absolute right-[-5rem] top-36 size-56 rounded-full bg-wine/48 blur-3xl" />
          <div className="absolute bottom-12 left-[-6rem] size-64 rounded-full bg-roseglow/14 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          <motion.header
            className="text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-blush">
              Nossa Retrospectiva
            </p>
            <h1 className="mt-4 text-[2rem] font-extrabold leading-tight text-pearl">
              Crie sua retrospectiva
            </h1>
            <p className="mx-auto mt-3 max-w-[18rem] text-sm font-medium leading-6 text-mist/78">
              Monte uma experiência única em poucos passos.
            </p>
          </motion.header>

          <motion.div
            className="mt-9"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepIndicator steps={createSteps} currentStep={currentStep} />
          </motion.div>

          <div className="mt-8">
            <CreateStepCard
              step={currentStepData}
              isFirstStep={currentStep === 1}
              onPrevious={handlePrevious}
              onNext={handleNext}
              primaryActionLabel={
                currentStep === createSteps.length ? 'Ver retrospectiva' : 'Continuar'
              }
            >
              {currentStep === 1 && (
                <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                  {mainDataFields.map((field) => (
                    <label key={field.id} className="block">
                      <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-mist/76">
                        {field.label}
                      </span>

                      <input
                        type={field.type}
                        value={mainData[field.id]}
                        onChange={handleMainDataChange(field.id)}
                        placeholder={field.placeholder}
                        className={formInputClass}
                      />
                    </label>
                  ))}
                </form>
              )}

              {currentStep === 2 && (
                <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
                  <section className="space-y-4">
                    <div>
                      <p className={sectionTitleClass}>Música</p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-mist/76">
                        Nome da música
                      </span>
                      <input
                        type="text"
                        value={musicMessage.songTitle}
                        onChange={handleMusicMessageInputChange('songTitle')}
                        placeholder="Ex: Nossa Música"
                        className={formInputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-mist/76">
                        Nome do artista/subtítulo
                      </span>
                      <input
                        type="text"
                        value={musicMessage.artistName}
                        onChange={handleMusicMessageInputChange('artistName')}
                        placeholder="Ex: Nossa História"
                        className={formInputClass}
                      />
                    </label>

                    <div>
                      <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-mist/76">
                        Arquivo de música atual
                      </span>
                      <div className="flex items-center gap-3 rounded-2xl border border-pearl/10 bg-pearl/[0.06] p-3 shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.08)]">
                        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-blush/16 text-blush ring-1 ring-blush/24">
                          <Music2 className="size-5" strokeWidth={2.4} aria-hidden="true" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-pearl">
                            {retrospectiveData.audioUrl}
                          </p>
                          <p className="mt-1 text-xs font-medium text-mist/58">
                            Upload será configurado em outra etapa.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4 border-t border-pearl/10 pt-5">
                    <div>
                      <p className={sectionTitleClass}>Mensagem</p>
                      <p className="mt-2 text-xs font-medium leading-5 text-mist/62">
                        Digite uma frase por linha para montar a mensagem da retrospectiva.
                      </p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-mist/76">
                        Texto da mensagem/lyrics
                      </span>
                      <textarea
                        value={musicMessage.lyricsText}
                        onChange={handleLyricsTextChange}
                        placeholder="Digite sua mensagem, uma frase por linha..."
                        rows={6}
                        className={`${formInputClass} min-h-40 resize-none py-3 leading-6`}
                      />
                    </label>
                  </section>
                </form>
              )}

              {currentStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <p className={sectionTitleClass}>Memórias</p>
                    <p className="mt-2 text-xs font-medium leading-5 text-mist/62">
                      Adicione até 6 fotos para contar essa história.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {memoryItems.map((memory, index) => (
                      <div
                        key={memory.id}
                        className="group relative aspect-[0.82] overflow-hidden rounded-[1.2rem] border border-pearl/10 bg-[radial-gradient(circle_at_26%_22%,oklch(75%_0.17_8_/_0.42),transparent_30%),radial-gradient(circle_at_78%_74%,oklch(56%_0.18_316_/_0.36),transparent_34%),linear-gradient(145deg,oklch(24%_0.07_354),oklch(13%_0.035_342)_55%,oklch(20%_0.07_316))] shadow-[0_16px_38px_oklch(4%_0.012_342_/_0.42),inset_0_1px_0_oklch(96%_0.012_348_/_0.1)]"
                      >
                        {memory.imagePreviewUrl ? (
                          <img
                            src={memory.imagePreviewUrl}
                            alt={`Memória ${index + 1}`}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center">
                            <div className="grid size-12 place-items-center rounded-full border border-pearl/14 bg-ink/34 text-blush shadow-[0_0_28px_oklch(69%_0.21_356_/_0.26)] backdrop-blur-md">
                              <ImagePlus className="size-5" strokeWidth={2.4} aria-hidden="true" />
                            </div>
                          </div>
                        )}

                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,oklch(5%_0.018_342_/_0.82)_100%)]"
                        />

                        {memoryItems.length > 1 && (
                          <button
                            type="button"
                            aria-label={`Remover memória ${index + 1}`}
                            className="absolute right-2 top-2 grid size-8 place-items-center rounded-full border border-pearl/12 bg-ink/54 text-pearl/86 backdrop-blur-md transition duration-200 hover:bg-blush/24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush"
                            onClick={() => handleRemoveMemory(memory.id)}
                          >
                            <Trash2 className="size-3.5" strokeWidth={2.3} aria-hidden="true" />
                          </button>
                        )}

                        <label className="absolute inset-x-2 bottom-2 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-pearl/12 bg-ink/58 px-3 text-[0.72rem] font-bold text-pearl shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.1)] backdrop-blur-md transition duration-200 hover:bg-blush/20 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blush">
                          <ImagePlus className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
                          {memory.imagePreviewUrl ? 'Trocar' : 'Selecionar'}
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleMemoryImageChange(memory.id)}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  {memoryItems.length < MAX_MEMORIES ? (
                    <button
                      type="button"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-blush/28 bg-blush/12 px-4 text-sm font-bold text-pearl shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.12)] transition duration-200 hover:bg-blush/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush"
                      onClick={handleAddMemory}
                    >
                      <Plus className="size-4" strokeWidth={2.4} aria-hidden="true" />
                      Adicionar memória
                    </button>
                  ) : (
                    <p className="rounded-2xl border border-pearl/10 bg-pearl/[0.06] px-4 py-3 text-center text-xs font-semibold text-mist/66">
                      Limite de 6 memórias atingido.
                    </p>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-[1.25rem] border border-blush/18 bg-[radial-gradient(circle_at_50%_0%,oklch(69%_0.21_356_/_0.16),transparent_42%),linear-gradient(145deg,oklch(18%_0.04_344_/_0.9),oklch(11%_0.024_342_/_0.92))] p-5 text-center shadow-[0_18px_46px_oklch(4%_0.012_342_/_0.36)]">
                    <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-blush text-pearl shadow-[0_0_32px_oklch(69%_0.21_356_/_0.42)]">
                      <Heart className="size-5 fill-current" strokeWidth={2.5} aria-hidden="true" />
                    </div>

                    <h2 className="text-xl font-extrabold leading-tight text-pearl">
                      Tudo pronto para sua retrospectiva
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-mist/70">
                      Confira os detalhes antes de visualizar.
                    </p>
                  </div>

                  <section className={previewGroupClass}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blush/16 text-blush ring-1 ring-blush/22">
                        <Heart className="size-4 fill-current" strokeWidth={2.4} aria-hidden="true" />
                      </div>
                      <p className={sectionTitleClass}>Dados</p>
                    </div>

                    <div className="space-y-3">
                      {mainDataPreviewItems.map((item) => (
                        <div key={item.label}>
                          <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-mist/50">
                            {item.label}
                          </p>
                          <p className="mt-1 break-words text-sm font-semibold leading-5 text-pearl/88">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className={previewGroupClass}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blush/16 text-blush ring-1 ring-blush/22">
                        <Music2 className="size-4" strokeWidth={2.4} aria-hidden="true" />
                      </div>
                      <p className={sectionTitleClass}>Música</p>
                    </div>

                    <div className="space-y-3">
                      {musicPreviewItems.map((item) => (
                        <div key={item.label}>
                          <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-mist/50">
                            {item.label}
                          </p>
                          <p className="mt-1 break-words text-sm font-semibold leading-5 text-pearl/88">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className={previewGroupClass}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blush/16 text-blush ring-1 ring-blush/22">
                        <MessageCircle className="size-4" strokeWidth={2.4} aria-hidden="true" />
                      </div>
                      <p className={sectionTitleClass}>Mensagem</p>
                    </div>

                    <div className="space-y-2.5">
                      {previewMessageExcerpt.length > 0 ? (
                        previewMessageExcerpt.map((line) => (
                          <p
                            key={line}
                            className="rounded-2xl border border-pearl/8 bg-ink/28 px-3 py-2 text-sm font-medium leading-6 text-pearl/82"
                          >
                            {line}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm font-medium leading-6 text-mist/62">
                          Nenhuma mensagem informada.
                        </p>
                      )}

                      {remainingMessageLines > 0 && (
                        <p className="text-xs font-semibold text-blush/86">
                          Mais {remainingMessageLines}{' '}
                          {remainingMessageLines === 1 ? 'linha' : 'linhas'} na mensagem completa.
                        </p>
                      )}
                    </div>
                  </section>

                  <section className={previewGroupClass}>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blush/16 text-blush ring-1 ring-blush/22">
                          <Camera className="size-4" strokeWidth={2.4} aria-hidden="true" />
                        </div>
                        <p className={sectionTitleClass}>Memórias</p>
                      </div>

                      <span className="rounded-full border border-blush/20 bg-blush/12 px-3 py-1 text-[0.66rem] font-bold text-pearl">
                        {selectedMemoryCount}/{MAX_MEMORIES}
                      </span>
                    </div>

                    <p className="mb-3 text-xs font-medium leading-5 text-mist/62">
                      {selectedMemoryCount} imagens adicionadas.
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {memoryItems.map((memory, index) => (
                        <div
                          key={memory.id}
                          className="relative aspect-[0.82] overflow-hidden rounded-xl border border-pearl/10 bg-[radial-gradient(circle_at_28%_24%,oklch(75%_0.17_8_/_0.34),transparent_34%),linear-gradient(145deg,oklch(22%_0.06_354),oklch(12%_0.03_342))]"
                        >
                          {memory.imagePreviewUrl ? (
                            <img
                              src={memory.imagePreviewUrl}
                              alt={`Prévia da memória ${index + 1}`}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center text-blush/80">
                              <ImagePlus className="size-5" strokeWidth={2.4} aria-hidden="true" />
                            </div>
                          )}

                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,oklch(5%_0.018_342_/_0.64)_100%)]"
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </CreateStepCard>
          </div>
        </div>
      </motion.section>
    </main>
  )
}

export default CreateRetrospectiveScreen
