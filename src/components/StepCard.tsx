import type { ReactNode } from "react"
import { steps } from "@/data/content"
import type { StepId } from "@/game/types"

type Props = { step: StepId; children?: ReactNode }

const stepRotation: Record<StepId, string> = {
  income: "-rotate-[0.5deg]",
  bills: "rotate-[0.3deg]",
  house: "-rotate-[0.4deg]",
  event: "rotate-[0.6deg]",
}

const stepColor: Record<StepId, string> = {
  income: "bg-amber-50 dark:bg-amber-950/20",
  bills: "bg-sky-50 dark:bg-sky-950/20",
  house: "bg-green-50 dark:bg-green-950/20",
  event: "bg-orange-50 dark:bg-orange-950/20",
}

function Beat({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wider">{label}</dt>
      <dd className="mt-0.5 text-sm text-muted-foreground">{text}</dd>
    </div>
  )
}

export default function StepCard({ step, children }: Props) {
  const c = steps[step]
  return (
    <div className={`rounded border-2 border-foreground p-5 shadow-md ${stepRotation[step]} ${stepColor[step]}`}>
      <div className="mb-4 space-y-1">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          At the {c.place.toLowerCase()}
        </p>
        <h2 className="text-xl font-bold">{c.title}</h2>
      </div>

      <dl className="mb-4 grid gap-3 border-t border-foreground/20 pt-4 sm:grid-cols-3">
        <Beat label="What it is" text={c.definition} />
        <Beat label="Why it matters" text={c.why} />
        <Beat label="How it works" text={c.how} />
      </dl>

      <div className="border-t border-foreground/20 pt-4">
        <p className="mb-3 text-sm font-semibold">{c.prompt}</p>
        {children}
      </div>
    </div>
  )
}
