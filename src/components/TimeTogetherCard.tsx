import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Heart } from "lucide-react";

import { retrospectiveData } from "../data/retrospective";
import { calculateTimeTogether } from "../utils/calculateTimeTogether";

type TimeTogetherCardProps = {
  coupleName?: string;
  startDate?: string;
  storyPhotoUrl?: string;
};

export function TimeTogetherCard({
  coupleName,
  startDate,
  storyPhotoUrl,
}: TimeTogetherCardProps) {
  const resolvedCoupleName = coupleName?.trim() || retrospectiveData.coupleName;
  const resolvedStartDate = startDate || retrospectiveData.startDate;
  const timeTogether = useMemo(
    () => calculateTimeTogether(resolvedStartDate),
    [resolvedStartDate],
  );
  const coupleInitials = resolvedCoupleName
    .split("&")
    .map((name) => name.trim().charAt(0))
    .filter(Boolean)
    .join(" & ");

  const timeBlocks = [
    { label: "anos", value: timeTogether.years },
    { label: "meses", value: timeTogether.months },
    { label: "dias", value: timeTogether.days },
    { label: "horas", value: timeTogether.hours },
  ];

  return (
    <motion.section
      className="relative w-full overflow-hidden rounded-[1.45rem] border border-pearl/12 bg-[radial-gradient(circle_at_82%_18%,oklch(44%_0.14_354_/_0.5),transparent_32%),linear-gradient(145deg,oklch(16%_0.032_344_/_0.86),oklch(10%_0.022_342_/_0.84)_58%,oklch(25%_0.075_326_/_0.62))] p-5 text-center shadow-[0_24px_70px_oklch(4%_0.012_342_/_0.5),0_0_54px_oklch(69%_0.21_356_/_0.13)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="time-together-title"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -right-10 top-4 size-32 rounded-full bg-blush/16 blur-3xl" />
        <div className="absolute -bottom-14 left-8 size-36 rounded-full bg-wine/38 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(96%_0.012_348_/_0.07),transparent_36%)]" />
      </div>

      <div className="relative">
        <div className="relative mb-6 h-60 w-full overflow-hidden rounded-[1.25rem] border border-pearl/12 bg-[radial-gradient(circle_at_26%_22%,oklch(76%_0.17_8_/_0.72),transparent_28%),radial-gradient(circle_at_78%_24%,oklch(56%_0.18_316_/_0.68),transparent_32%),linear-gradient(135deg,oklch(32%_0.1_354),oklch(18%_0.065_328)_52%,oklch(10%_0.028_342))] shadow-[0_18px_48px_oklch(69%_0.21_356_/_0.2),inset_0_1px_0_oklch(96%_0.012_348_/_0.16)]">
          {storyPhotoUrl && (
            <img
              src={storyPhotoUrl}
              alt="Nossa história"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div aria-hidden="true" className="absolute inset-0">
            {!storyPhotoUrl && (
              <>
                <div className="absolute -left-12 top-8 size-32 rounded-full bg-blush/28 blur-3xl" />
                <div className="absolute -right-10 bottom-2 size-36 rounded-full bg-wine/46 blur-3xl" />
              </>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0_32%,oklch(96%_0.012_348_/_0.12)_39%,transparent_47%),radial-gradient(circle_at_50%_55%,transparent_0_34%,oklch(6%_0.018_342_/_0.5)_76%)]" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,oklch(6%_0.018_342_/_0.86))]" />
          </div>

          <div className="relative flex h-full flex-col justify-between p-4 text-left">
            <div className="ml-auto rounded-full border border-pearl/14 bg-ink/32 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-pearl/76 backdrop-blur-md">
              {coupleInitials}
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-blush">
                  Foto do casal
                </p>
                <p className="mt-1 text-lg font-extrabold leading-none text-pearl">
                  Nossa história
                </p>
              </div>

              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-blush text-pearl shadow-[0_0_30px_oklch(69%_0.21_356_/_0.45)] ring-1 ring-pearl/20">
                <Heart
                  className="size-5 fill-current"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-1 flex items-center justify-center gap-2 text-blush">
          <CalendarDays
            className="size-4"
            strokeWidth={2.2}
            aria-hidden="true"
          />
          <p
            id="time-together-title"
            className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-mist"
          >
            Estamos juntos há
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {timeBlocks.map((block, index) => (
            <div
              key={block.label}
              className="rounded-2xl border border-pearl/10 bg-ink/32 px-3 py-4 shadow-[inset_0_1px_0_oklch(96%_0.012_348_/_0.08)]"
            >
              <p
                className={`text-3xl font-extrabold leading-none ${index === 0 ? "text-blush" : "text-pearl"}`}
              >
                {block.value.toString().padStart(2, "0")}
              </p>
              <p className="mt-2 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-mist/70">
                {block.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-sm font-medium leading-6 text-pearl/78">
          <Heart
            className="size-4 fill-current text-blush"
            strokeWidth={2.5}
            aria-hidden="true"
          />
          E cada segundo continua valendo a pena.
        </p>
      </div>
    </motion.section>
  );
}
