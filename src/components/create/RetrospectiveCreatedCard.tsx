import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, ExternalLink, Heart, Link2 } from 'lucide-react'

type RetrospectiveCreatedCardProps = {
  publicUrl: string
  onOpen: () => void
}

export function RetrospectiveCreatedCard({
  publicUrl,
  onOpen,
}: RetrospectiveCreatedCardProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  const handleCopyLink = async () => {
    setCopyError(null)

    if (!publicUrl) {
      setCopyError('Não foi possível gerar o link público.')
      return
    }

    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopyError('Não foi possível copiar automaticamente. Copie o link manualmente.')
    }
  }

  return (
    <motion.section
      className="relative overflow-hidden rounded-[1.55rem] border border-pearl/12 bg-[linear-gradient(145deg,oklch(17%_0.035_344_/_0.9),oklch(12%_0.026_342_/_0.84)_52%,oklch(27%_0.08_356_/_0.66))] p-5 text-center shadow-[0_24px_70px_oklch(4%_0.012_342_/_0.5),0_0_52px_oklch(69%_0.21_356_/_0.14)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="created-retrospective-title"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -right-12 -top-12 size-36 rounded-full bg-blush/20 blur-3xl" />
        <div className="absolute -bottom-14 left-0 size-44 rounded-full bg-wine/42 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(96%_0.012_348_/_0.08),transparent_42%)]" />
      </div>

      <div className="relative">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-blush text-pearl shadow-[0_0_34px_oklch(69%_0.21_356_/_0.46)] ring-1 ring-pearl/18">
          <Heart className="size-7 fill-current" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <h1
          id="created-retrospective-title"
          className="mt-6 text-2xl font-extrabold leading-tight text-pearl"
        >
          Sua retrospectiva está pronta!
        </h1>
        <p className="mx-auto mt-3 max-w-[18rem] text-sm font-medium leading-6 text-mist/74">
          Copie o link e compartilhe esse momento.
        </p>

        <div className="mt-6 rounded-[1.15rem] border border-pearl/10 bg-ink/38 p-3 text-left shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.08)]">
          <div className="mb-2 flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-blush">
            <Link2 className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
            Link público
          </div>
          <p className="break-all rounded-2xl border border-pearl/8 bg-pearl/[0.055] px-3 py-3 text-xs font-semibold leading-5 text-pearl/82">
            {publicUrl || 'Link indisponível'}
          </p>
        </div>

        {!publicUrl && (
          <p className="mt-3 rounded-2xl border border-blush/26 bg-blush/10 px-3 py-2 text-xs font-semibold leading-5 text-pearl">
            Não foi possível gerar o link público. Tente criar a retrospectiva novamente.
          </p>
        )}

        {copyError && (
          <p className="mt-3 rounded-2xl border border-blush/26 bg-blush/10 px-3 py-2 text-xs font-semibold leading-5 text-pearl">
            {copyError}
          </p>
        )}

        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blush px-4 text-sm font-bold text-pearl shadow-romance-button transition duration-200 hover:bg-roseglow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush disabled:cursor-not-allowed disabled:opacity-55"
            onClick={handleCopyLink}
            disabled={!publicUrl}
          >
            {copied ? (
              <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Copy className="size-4" strokeWidth={2.5} aria-hidden="true" />
            )}
            {copied ? 'Link copiado!' : 'Copiar link'}
          </button>

          <button
            type="button"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-pearl/12 bg-pearl/7 px-4 text-sm font-bold text-pearl transition duration-200 hover:bg-pearl/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush disabled:cursor-not-allowed disabled:opacity-45"
            onClick={onOpen}
            disabled={!publicUrl}
          >
            <ExternalLink className="size-4" strokeWidth={2.4} aria-hidden="true" />
            Abrir retrospectiva
          </button>
        </div>
      </div>
    </motion.section>
  )
}
