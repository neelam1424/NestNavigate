import { Badge } from "@/components/ui/badge"
import { APPROVAL_LIMIT, COMFORT_LIMIT, formatPercent, getDtiZone } from "@/game/dti"
import type { DtiZone } from "@/game/types"

const MAX = 0.6 // the bar covers 0% to 60%
const toPct = (ratio: number) => `${(Math.min(Math.max(ratio, 0), MAX) / MAX) * 100}%`

const zoneBadge: Record<DtiZone, string> = {
  comfortable: "bg-green-600 text-white",
  stretching: "bg-amber-500 text-white",
  hard: "bg-red-600 text-white",
}
const zoneLabel: Record<DtiZone, string> = {
  comfortable: "Comfortable",
  stretching: "Stretching",
  hard: "Hard to approve",
}

type Props = { dti: number; active: boolean }

export default function DtiGauge({ dti, active }: Props) {
  const zone = getDtiZone(dti)

  return (
    <section aria-label="Debt-to-income gauge" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">The lender's view: DTI</h2>
        {active && <Badge className={zoneBadge[zone]}>{zoneLabel[zone]}</Badge>}
      </div>

      <div className="text-4xl font-bold tabular-nums">
        {active ? formatPercent(dti) : "--"}
      </div>

      <div
        role="meter"
        aria-label="Debt-to-income ratio"
        aria-valuemin={0}
        aria-valuemax={MAX * 100}
        aria-valuenow={Math.round(dti * 100)}
        className="relative h-4 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className="absolute inset-y-0 left-0 bg-green-500/40" style={{ width: toPct(COMFORT_LIMIT) }} />
        <div
          className="absolute inset-y-0 bg-amber-400/50"
          style={{ left: toPct(COMFORT_LIMIT), width: `calc(${toPct(APPROVAL_LIMIT)} - ${toPct(COMFORT_LIMIT)})` }}
        />
        <div
          className="absolute inset-y-0 right-0 bg-red-500/40"
          style={{ left: toPct(APPROVAL_LIMIT) }}
        />
        {active && (
          <div
            className="absolute inset-y-0 w-1 -translate-x-1/2 rounded bg-foreground transition-all duration-500"
            style={{ left: toPct(dti) }}
          />
        )}
      </div>

      <div className="relative h-4 text-xs text-muted-foreground">
        <span className="absolute -translate-x-1/2" style={{ left: toPct(COMFORT_LIMIT) }}>36%</span>
        <span className="absolute -translate-x-1/2" style={{ left: toPct(APPROVAL_LIMIT) }}>43%</span>
      </div>

      {!active && (
        <p className="text-sm text-muted-foreground">The gauge fills in as you make choices.</p>
      )}
    </section>
  )
}