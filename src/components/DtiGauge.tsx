import { APPROVAL_LIMIT, COMFORT_LIMIT, formatPercent, getDtiZone } from "@/game/dti"
import type { DtiZone } from "@/game/types"

const MAX = 0.6
const toPct = (ratio: number) => `${(Math.min(Math.max(ratio, 0), MAX) / MAX) * 100}%`

const zoneBg: Record<DtiZone, string> = {
  comfortable: "bg-green-600",
  stretching: "bg-amber-500",
  hard: "bg-red-600",
}
const zoneLabel: Record<DtiZone, string> = {
  comfortable: "Comfortable",
  stretching: "Stretching",
  hard: "Hard to approve",
}
const zoneText: Record<DtiZone, string> = {
  comfortable: "text-green-700 dark:text-green-400",
  stretching: "text-amber-600 dark:text-amber-400",
  hard: "text-red-600 dark:text-red-400",
}

type Props = {
  dti: number
  active: boolean
  reportDti?: number
}

export default function DtiGauge({ dti, active, reportDti }: Props) {
  const zone = getDtiZone(dti)

  return (
    <section
      aria-label="Debt-to-income gauge"
      className="rounded border-2 border-foreground p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest">DTI gauge</h2>
        {active && (
          <span className={`rounded px-2 py-0.5 text-xs font-bold ${zoneBg[zone]} text-white`}>
            {zoneLabel[zone]}
          </span>
        )}
      </div>

      <div className={`font-mono text-4xl font-bold tabular-nums ${active ? zoneText[zone] : "text-muted-foreground"}`}>
        {active ? formatPercent(dti) : "--"}
      </div>

      <div
        role="meter"
        aria-label="Debt-to-income ratio"
        aria-valuemin={0}
        aria-valuemax={Math.round(MAX * 100)}
        aria-valuenow={Math.round(dti * 100)}
        className="relative h-4 w-full overflow-hidden rounded-sm bg-muted"
      >
        <div className="absolute inset-y-0 left-0 bg-green-500/40" style={{ width: toPct(COMFORT_LIMIT) }} />
        <div
          className="absolute inset-y-0 bg-amber-400/50"
          style={{ left: toPct(COMFORT_LIMIT), width: `calc(${toPct(APPROVAL_LIMIT)} - ${toPct(COMFORT_LIMIT)})` }}
        />
        <div className="absolute inset-y-0 right-0 bg-red-500/40" style={{ left: toPct(APPROVAL_LIMIT) }} />

        {active && (
          <div
            className="absolute inset-y-0 w-1 -translate-x-1/2 rounded-sm bg-foreground transition-all motion-reduce:transition-none duration-500"
            style={{ left: toPct(dti) }}
          />
        )}
        {reportDti !== undefined && (
          <div
            aria-label={`Credit report DTI: ${formatPercent(reportDti)}`}
            className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-foreground/40 transition-all motion-reduce:transition-none duration-500"
            style={{ left: toPct(reportDti) }}
          />
        )}
      </div>

      <div className="relative h-4 font-mono text-xs text-muted-foreground">
        <span className="absolute -translate-x-1/2" style={{ left: toPct(COMFORT_LIMIT) }}>36%</span>
        <span className="absolute -translate-x-1/2" style={{ left: toPct(APPROVAL_LIMIT) }}>43%</span>
      </div>

      {reportDti !== undefined && (
        <p className="font-mono text-xs text-muted-foreground">
          Faint mark: credit report reads {formatPercent(reportDti)}
        </p>
      )}

      {!active && (
        <p className="text-sm text-muted-foreground">Gauge fills in as you make choices.</p>
      )}
    </section>
  )
}
