import { Button } from "@/components/ui/button"
import Mascot from "@/components/Mascot"
import { DISCLAIMER, endings, steps } from "@/data/content"
import type { GameState } from "@/game/gameReducer"
import { STEPS, getEnding, getStepRecaps, getTotalScore } from "@/game/gameReducer"
import { formatMoney, formatPercent, getTakeHomeMonthly, leftoverCash, sumDebts } from "@/game/dti"
import { POINTS_PER_STEP } from "@/game/scoring"
import { endingMood } from "@/game/mood"

type Props = { game: GameState; onRestart: () => void }

const endingBorder: Record<string, string> = {
  comfortable: "border-green-700",
  "house-poor": "border-amber-500",
  denied: "border-red-600",
}

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
      <div className={`rounded border-2 p-6 ${endingBorder[ending]}`}>
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">Result</p>
        <h1 className="text-2xl font-bold">{e.title}</h1>
        <div className="mt-4">
          <Mascot mood={endingMood[ending]} />
        </div>
        <p className="mt-2 text-muted-foreground">{e.summary}</p>
        <p className="mt-3 font-medium">{e.takeaway}</p>
        <div className="mt-4 flex flex-wrap gap-4 font-mono text-sm">
          <span className="font-bold">Score: {totalScore} / {maxScore}</span>
          <span>Rewinds: {game.totalRewinds}</span>
          {leftover !== null && (
            <span className={leftover < 1000 ? "text-amber-600" : "text-green-700"}>
              Left each month: {formatMoney(leftover)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest">What happened</h2>
        {recaps.map((r) => (
          <div key={r.step} className="rounded border-2 px-4 py-3 text-sm">
            <p className="font-semibold">{steps[r.step].title}</p>
            <p className="mt-0.5 text-muted-foreground">{r.decision}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              DTI after this step: {formatPercent(r.dtiAfter)}
            </p>
          </div>
        ))}
      </div>

      {house && (
        <div className="rounded border-2 px-4 py-4">
          <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest">Monthly budget</p>
          <div className="space-y-1.5 font-mono text-sm">
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
              <span>Living costs (approx.)</span>
              <span>- $1,700</span>
            </div>
            <div className="flex justify-between border-t-2 pt-1.5 font-bold">
              <span>Left over</span>
              <span className={leftover !== null && leftover < 1000 ? "text-amber-600" : ""}>
                {leftover !== null ? formatMoney(leftover) : "--"}
              </span>
            </div>
          </div>
        </div>
      )}

      <Button onClick={onRestart} className="w-full sm:w-auto">Play again</Button>
      <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
    </main>
  )
}
