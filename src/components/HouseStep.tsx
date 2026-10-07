import { calcDti, formatMoney, formatPercent, getDtiZone, getGrossMonthly, getTakeHomeMonthly, sumDebts, sumLivingCosts } from "@/game/dti"
import type { Buyer, House } from "@/game/types"

type Props = {
  buyer: Buyer
  selectedId: string | null
  locked: boolean
  onSelect: (houseId: string) => void
}

const zoneStyle = {
  comfortable: "text-green-700",
  stretching: "text-amber-600",
  hard: "text-red-600",
} as const

function LeftoverBar({ leftover, takeHome }: { leftover: number; takeHome: number }) {
  const pct = Math.max(0, Math.min(100, (leftover / takeHome) * 100))
  const color = leftover >= 1000 ? "bg-green-500" : leftover >= 500 ? "bg-amber-400" : "bg-red-500"
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Left of take-home</span>
        <span className={`font-mono font-medium ${leftover < 500 ? "text-red-600" : ""}`}>
          {formatMoney(leftover)}/mo
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ListingCard({
  house, buyer, selected, locked, onSelect,
}: {
  house: House
  buyer: Buyer
  selected: boolean
  locked: boolean
  onSelect: () => void
}) {
  const gross = getGrossMonthly(buyer)
  const debt = sumDebts(buyer.bills)
  const dti = calcDti(debt, house.housingPayment, gross)
  const zone = getDtiZone(dti)
  const takeHome = getTakeHomeMonthly(buyer)
  const leftover = takeHome - debt - house.housingPayment - sumLivingCosts(buyer.bills)

  return (
    <button
      type="button"
      disabled={locked}
      aria-pressed={selected}
      onClick={onSelect}
      className={`w-full rounded border-2 p-4 text-left transition
        ${selected ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50"}
        disabled:cursor-default`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-bold">{house.name}</p>
          <p className="text-xs text-muted-foreground">{house.blurb}</p>
        </div>
        <p className="shrink-0 font-mono text-lg font-bold">{formatMoney(house.housingPayment)}/mo</p>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">DTI</span>
          <span className={`font-mono font-semibold ${zoneStyle[zone]}`}>{formatPercent(dti)}</span>
        </div>
        <LeftoverBar leftover={leftover} takeHome={takeHome} />
      </div>
    </button>
  )
}

export default function HouseStep({ buyer, selectedId, locked, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {buyer.houses.map((house) => (
        <ListingCard
          key={house.id}
          house={house}
          buyer={buyer}
          selected={selectedId === house.id}
          locked={locked}
          onSelect={() => onSelect(house.id)}
        />
      ))}
      <p className="text-xs text-muted-foreground">
        "Left of take-home" = take-home ({formatMoney(getTakeHomeMonthly(buyer))}) minus debts, housing,
        and living costs. Lenders don't see this; you do.
      </p>
    </div>
  )
}
