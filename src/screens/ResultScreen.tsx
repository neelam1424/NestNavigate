import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DISCLAIMER, endings } from "@/data/content"
import type { GameState } from "@/game/gameReducer"
import { STEPS, getEnding, getTotalScore } from "@/game/gameReducer"
import { POINTS_PER_STEP } from "@/game/scoring"

type Props = { game: GameState; onRestart: () => void }

export default function ResultScreen({ game, onRestart }: Props) {
  const ending = getEnding(game)

  if (!ending) {
    return (
      <main className="mx-auto max-w-xl space-y-4 p-6">
        <p>The game isn't finished yet.</p>
        <Button onClick={onRestart}>Play again</Button>
      </main>
    )
  }

  const e = endings[ending]
  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{e.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{e.summary}</p>
          <p className="font-medium">{e.takeaway}</p>
          <p className="text-sm text-muted-foreground">
            Score: {getTotalScore(game)} / {STEPS.length * POINTS_PER_STEP} · Rewinds: {game.totalRewinds}
          </p>
          <Button onClick={onRestart}>Play again</Button>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
    </main>
  )
}