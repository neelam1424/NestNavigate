import { calcDti, formatMoney, formatPercent, getDtiZone, getGrossMonthly, sumDebts } from "@/game/dti"
import type { Buyer } from "@/game/types"

type Props = {
  buyer: Buyer
  houseId: string
  accepted: boolean | null
  locked: boolean
  onChoose: (accepted: boolean) => void
}

const zoneStyle = {
  comfortable: "text-green-700",
  stretching: "text-amber-600",
  hard: "text-red-600",
} as const

export default function EventStep({ buyer, houseId, accepted, locked, onChoose }: Props) {
  const house = buyer.houses.find((h) => h.id === houseId)!
  const event = buyer.lifeEvents[0]
  const gross = getGrossMonthly(buyer)
  const debt = sumDebts(buyer.bills)

  const dtiNow = calcDti(debt + event.debtDelta, house.housingPayment, gross)
  const dtiWait = calcDti(debt, house.housingPayment, gross)
  const zoneNow = getDtiZone(dtiNow)
  const zoneWait = getDtiZone(dtiWait)

  return (
    <div className="space-y-4">
      <div className="rounded border-2 bg-card p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Incoming call
        </p>
        <p className="font-bold">{event.title}</p>
        <p className="mt-1 text-sm">{event.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={locked}
          aria-pressed={accepted === true}
          onClick={() => onChoose(true)}
          className={`rounded border-2 p-4 text-left transition
            ${accepted === true ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"}
            disabled:cursor-default`}
        >
          <p className="font-semibold">Finance the car now</p>
          <p className="mt-1 text-xs text-muted-foreground">+{formatMoney(event.debtDelta)}/mo in new debt</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">DTI:</span>
            <span className={`font-mono font-bold ${zoneStyle[zoneNow]}`}>{formatPercent(dtiNow)}</span>
          </div>
        </button>

        <button
          type="button"
          disabled={locked}
          aria-pressed={accepted === false}
          onClick={() => onChoose(false)}
          className={`rounded border-2 p-4 text-left transition
            ${accepted === false ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"}
            disabled:cursor-default`}
        >
          <p className="font-semibold">Wait until after closing</p>
          <p className="mt-1 text-xs text-muted-foreground">No change to debt before closing</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">DTI:</span>
            <span className={`font-mono font-bold ${zoneStyle[zoneWait]}`}>{formatPercent(dtiWait)}</span>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Lenders re-check your credit before closing. New debt raises DTI and can cancel an approval.
      </p>
    </div>
  )
}
