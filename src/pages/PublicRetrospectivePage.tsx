import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, LoaderCircle } from 'lucide-react'

import { RetrospectivePlayerScreen } from '../components/RetrospectivePlayerScreen'
import { RetrospectiveStartScreen } from '../components/RetrospectiveStartScreen'
import type { RetrospectiveData } from '../data/retrospective'
import { getRetrospectiveBySlug } from '../services/getRetrospectiveBySlug'

type PublicStateScreenProps = {
  title: string
  description: string
  isLoading?: boolean
}

function PublicStateScreen({
  title,
  description,
  isLoading = false,
}: PublicStateScreenProps) {
  return (
    <main className="flex min-h-svh w-full items-stretch justify-center bg-[radial-gradient(circle_at_50%_0%,oklch(32%_0.12_355)_0%,oklch(14%_0.03_344)_44%,oklch(8%_0.018_342)_100%)] text-pearl md:items-center md:p-6">
      <motion.section
        className="relative grid min-h-svh w-full max-w-[430px] place-items-center overflow-hidden bg-ink px-7 py-10 text-center shadow-romance-panel ring-1 ring-pearl/15 md:h-[min(860px,calc(100svh-3rem))] md:min-h-0 md:rounded-[2rem]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,oklch(43%_0.16_356_/_0.34),transparent_36%),linear-gradient(180deg,oklch(13%_0.026_344),oklch(8%_0.018_342)_62%,oklch(5%_0.015_342))]" />
          <div className="absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-blush/18 blur-3xl" />
          <div className="absolute bottom-16 left-[-5rem] size-60 rounded-full bg-wine/38 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-[21rem] rounded-[1.55rem] border border-pearl/12 bg-[linear-gradient(145deg,oklch(17%_0.035_344_/_0.86),oklch(12%_0.026_342_/_0.8)_52%,oklch(27%_0.08_356_/_0.62))] p-6 shadow-[0_24px_70px_oklch(4%_0.012_342_/_0.5),0_0_52px_oklch(69%_0.21_356_/_0.14)]">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-blush/18 text-blush ring-1 ring-blush/24">
            {isLoading ? (
              <LoaderCircle
                className="size-6 animate-spin"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            ) : (
              <Heart className="size-6 fill-current" strokeWidth={2.4} aria-hidden="true" />
            )}
          </div>

          <h1 className="text-2xl font-extrabold leading-tight text-pearl">{title}</h1>
          <p className="mt-3 text-sm font-medium leading-6 text-mist/74">
            {description}
          </p>

          {!isLoading && (
            <Link
              to="/"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-blush/28 bg-blush/12 px-5 text-sm font-bold text-pearl transition duration-200 hover:bg-blush/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush"
            >
              Voltar ao início
            </Link>
          )}
        </div>
      </motion.section>
    </main>
  )
}

export function PublicRetrospectivePage() {
  const { slug } = useParams<{ slug: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retrospectiveData, setRetrospectiveData] =
    useState<RetrospectiveData | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadRetrospective = async () => {
      const normalizedSlug = slug?.trim()

      setIsLoading(true)
      setError(null)
      setRetrospectiveData(null)
      setHasStarted(false)

      if (!normalizedSlug) {
        setIsLoading(false)
        setError('Esse link pode estar incorreto ou a retrospectiva foi removida.')
        return
      }

      try {
        const data = await getRetrospectiveBySlug(normalizedSlug)

        if (!isActive) {
          return
        }

        if (!data) {
          setError('Esse link pode estar incorreto ou a retrospectiva foi removida.')
          setRetrospectiveData(null)
          return
        }

        setRetrospectiveData(data)
      } catch {
        if (!isActive) {
          return
        }

        setError('Não foi possível carregar essa retrospectiva agora. Tente novamente em instantes.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadRetrospective()

    return () => {
      isActive = false
    }
  }, [slug])

  if (isLoading) {
    return (
      <PublicStateScreen
        title="Carregando retrospectiva"
        description="Estamos preparando os detalhes dessa história."
        isLoading
      />
    )
  }

  if (error || !retrospectiveData) {
    return (
      <PublicStateScreen
        title="Retrospectiva não encontrada"
        description={
          error ?? 'Esse link pode estar incorreto ou a retrospectiva foi removida.'
        }
      />
    )
  }

  if (!hasStarted) {
    return (
      <RetrospectiveStartScreen
        data={retrospectiveData}
        onStart={() => setHasStarted(true)}
      />
    )
  }

  return <RetrospectivePlayerScreen data={retrospectiveData} />
}

export default PublicRetrospectivePage
