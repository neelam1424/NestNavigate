import { formatMoney } from "@/game/dti"
import type { Bill, BillSort, Buyer } from "@/game/types"

type Props = {
  buyer: Buyer
  billSort: Record<string, BillSort>
  locked: boolean
  onSort: (billId: string, to: BillSort) => void
}

function BillSlip({
  bill,
  sorted,
  locked,
  onSort,
}: {
  bill: Bill
  sorted: BillSort | undefined
  locked: boolean
  onSort: (to: BillSort) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded border bg-card px-3 py-2 text-sm">
      <div className="min-w-0 flex-1">
        <span className="font-medium">{bill.label}</span>
        <span className="ml-2 font-mono text-muted-foreground">{formatMoney(bill.amount)}/mo</span>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          disabled={locked}
          aria-pressed={sorted === "counts"}
          onClick={() => onSort("counts")}
          className={`rounded border px-2 py-0.5 text-xs transition
            ${sorted === "counts"
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:border-foreground"
            } disabled:cursor-default disabled:opacity-60`}
        >
          Counts
        </button>
        <button
          type="button"
          disabled={locked}
          aria-pressed={sorted === "ignored"}
          onClick={() => onSort("ignored")}
          className={`rounded border px-2 py-0.5 text-xs transition
            ${sorted === "ignored"
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:border-foreground"
            } disabled:cursor-default disabled:opacity-60`}
        >
          Not counted
        </button>
      </div>
    </div>
  )
}

export default function BillsStep({ buyer, billSort, locked, onSort }: Props) {
  const unsorted = buyer.bills.filter((b) => !billSort[b.id])
  const counted = buyer.bills.filter((b) => billSort[b.id] === "counts")
  const ignored = buyer.bills.filter((b) => billSort[b.id] === "ignored")

  return (
    <div className="space-y-4">
      {unsorted.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Unsorted pile ({unsorted.length} left)
          </p>
          <div className="space-y-1.5">
            {unsorted.map((b) => (
              <BillSlip
                key={b.id}
                bill={b}
                sorted={undefined}
                locked={locked}
                onSort={(to) => onSort(b.id, to)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded border-2 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider">
            Counted on the application ({counted.length})
          </p>
          {counted.length === 0 && (
            <p className="text-xs text-muted-foreground">None yet</p>
          )}
          {counted.map((b) => (
            <BillSlip
              key={b.id}
              bill={b}
              sorted="counts"
              locked={locked}
              onSort={(to) => onSort(b.id, to)}
            />
          ))}
        </div>

        <div className="space-y-2 rounded border-2 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider">
            Not counted ({ignored.length})
          </p>
          {ignored.length === 0 && (
            <p className="text-xs text-muted-foreground">None yet</p>
          )}
          {ignored.map((b) => (
            <BillSlip
              key={b.id}
              bill={b}
              sorted="ignored"
              locked={locked}
              onSort={(to) => onSort(b.id, to)}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Gauge shows DTI if Maya buys Home A ({formatMoney(buyer.houses[0].housingPayment)}/mo).
      </p>
    </div>
  )
}
