import { Button } from "@/components/ui/button"
import { DISCLAIMER, endings, steps } from "@/data/content"
import type { GameState } from "@/game/gameReducer"
import { STEPS, getEnding, getStepRecaps, getTotalScore } from "@/game/gameReducer"
import { formatMoney, formatPercent, getTakeHomeMonthly, leftoverCash, sumDebts } from "@/game/dti"
import { POINTS_PER_STEP } from "@/game/scoring"

type Props = { game: GameState; onRestart: () => void }

export default function ResultScreen({ game, onRestart }: Props) {
  const ending = getEnding(game)

  if (!ending) {
    return (
      <main className="mx-auto max-w-xl space-y-4 p-6">
        <p>The game is not finished yet.</p>
        <Button onClick={onRestart}>Play again</Button>
      </main>
    )
  }

  const e = endings[ending]
  const recaps = getStepRecaps(game)
  const house = game.buyer.houses.find((h) => h.id === game.choices.houseId)
  const extra = game.choices.eventAccepted ? game.buyer.lifeEvents[0].debtDelta : 0
  const leftover = house ? leftoverCash(game.buyer, house.housingPayment, extra) : null
  const totalScore = getTotalScore(game)
  const maxScore = STEPS.length * POINTS_PER_STEP

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="rounded border-2 p-6">
        <h1 className="text-2xl font-bold">{e.title}</h1>
        <p className="mt-2">{e.summary}</p>
        <p className="mt-3 font-medium">{e.takeaway}</p>
        <div className="mt-4 flex flex-wrap gap-4 font-mono text-sm">
          <span>Score: {totalScore} / {maxScore}</span>
          <span>Rewinds: {game.totalRewinds}</span>
          {leftover !== null && (
            <span>Left each month: {formatMoney(leftover)}</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">What happened, step by step</h2>
        {recaps.map((r) => (
          <div key={r.step} className="rounded border px-4 py-3 text-sm">
            <p className="font-medium">{steps[r.step].title}</p>
            <p className="mt-0.5 text-muted-foreground">{r.decision}</p>
            <p className="mt-1 font-mono text-xs">
              DTI after this step: {formatPercent(r.dtiAfter)}
            </p>
          </div>
        ))}
      </div>

      {house && (
        <div className="rounded border px-4 py-3 text-sm">
          <p className="font-semibold">Monthly budget breakdown</p>
          <div className="mt-2 space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span>Take-home pay</span>
              <span>{formatMoney(getTakeHomeMonthly(game.buyer))}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Debt payments</span>
              <span>- {formatMoney(sumDebts(game.buyer.bills) + extra)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Housing payment</span>
              <span>- {formatMoney(house.housingPayment)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Living costs</span>
              <span>approx. - $1,700</span>
            </div>
            <div className="flex justify-between border-t pt-1 font-bold">
              <span>Left over</span>
              <span className={leftover !== null && leftover < 1000 ? "text-amber-600" : ""}>
                {leftover !== null ? formatMoney(leftover) : "--"}
              </span>
            </div>
          </div>
        </div>
      )}

      <Button onClick={onRestart}>Play again</Button>
      <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
    </main>
  )
}
