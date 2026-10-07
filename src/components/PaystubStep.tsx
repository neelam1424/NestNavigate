import { Badge } from "@/components/ui/badge"
import {
  calcDti, formatMoney, formatPercent, getDtiZone, getGrossMonthly,
  getTakeHomeMonthly, incomeValue, sumDebts,
} from "@/game/dti"
import type { Buyer, DtiZone, IncomeOption } from "@/game/types"

const zoneStyle: Record<DtiZone, string> = {
  comfortable: "bg-green-600 text-white",
  stretching: "bg-amber-500 text-white",
  hard: "bg-red-600 text-white",
}

type Props = {
  buyer: Buyer
  selected: IncomeOption | null
  locked: boolean // true once the application is sent
  onSelect: (option: IncomeOption) => void
}

type LineProps = {
  label: string
  value: number
  option: IncomeOption
  selected: IncomeOption | null
  locked: boolean
  strong?: boolean
  onSelect: (option: IncomeOption) => void
}

function ClickableLine({ label, value, option, selected, locked, strong, onSelect }: LineProps) {
  const isSelected = selected === option
  return (
    <button
      type="button"
      disabled={locked}
      aria-pressed={isSelected}
      onClick={() => onSelect(option)}
      className={`flex w-full justify-between rounded px-2 py-1 text-left transition hover:bg-amber-200/60 disabled:cursor-default ${
        strong ? "font-bold" : ""
      } ${isSelected ? "bg-amber-300/70 ring-2 ring-foreground" : ""}`}
    >
      <span>{label}</span>
      <span className="tabular-nums">{formatMoney(value)}</span>
    </button>
  )
}

function LiveMath({ buyer, selected }: { buyer: Buyer; selected: IncomeOption | null }) {
  const home = buyer.houses[0]
  const debt = sumDebts(buyer.bills)

  if (!selected) {
    return <p className="text-muted-foreground">The lender's math appears here.</p>
  }
  if (selected === "annual") {
    return (
      <p>A yearly figure can't be divided into monthly payments, so the lender can't run the math.</p>
    )
  }

  const income = incomeValue(buyer, selected)
  const dti = calcDti(debt, home.housingPayment, income)
  const zone = getDtiZone(dti)
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground">Lender's math on {home.name}:</p>
      <p className="font-mono">
        ({formatMoney(debt)} + {formatMoney(home.housingPayment)}) ÷ {formatMoney(income)}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tabular-nums">{formatPercent(dti)}</span>
        <Badge className={zoneStyle[zone]}>{zone}</Badge>
      </div>
    </div>
  )
}

export default function PaystubStep({ buyer, selected, locked, onSelect }: Props) {
  const common = { selected, locked, onSelect }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="-rotate-1 space-y-1 rounded border-2 bg-amber-50 p-4 font-mono text-sm shadow-sm dark:bg-amber-950/30">
        <p className="px-2 font-bold">PAYSTUB · one month</p>
        <ClickableLine label="Gross pay" value={getGrossMonthly(buyer)} option="grossMonthly" strong {...common} />
        {buyer.withholdings.map((w) => (
          <div key={w.label} className="flex justify-between px-2 py-1 text-muted-foreground">
            <span>− {w.label}</span>
            <span className="tabular-nums">{formatMoney(w.amount)}</span>
          </div>
        ))}
        <ClickableLine label="Take-home pay" value={getTakeHomeMonthly(buyer)} option="takeHome" strong {...common} />
        <div className="border-t border-dashed pt-1">
          <ClickableLine label="Yearly salary" value={buyer.grossAnnual} option="annual" {...common} />
        </div>
      </div>

      <div className="rotate-1 space-y-3 rounded border-2 bg-card p-4 text-sm shadow-sm">
        <p className="font-bold">LOAN APPLICATION</p>
        <div className="rounded border border-dashed p-3">
          <p className="text-xs text-muted-foreground">Monthly income</p>
          <p className="font-mono text-xl font-bold tabular-nums">
            {selected ? formatMoney(incomeValue(buyer, selected)) : "Click a line on the paystub"}
          </p>
        </div>
        <LiveMath buyer={buyer} selected={selected} />
      </div>
    </div>
  )
}