import type { Dispatch } from "react"
import { Badge } from "@/components/ui/badge"
import BillsStep from "@/components/BillsStep"
import DtiGauge from "@/components/DtiGauge"
import FeedbackBanner from "@/components/FeedbackBanner"
import PaystubStep from "@/components/PaystubStep"
import StepCard from "@/components/StepCard"
import StepControls from "@/components/StepControls"
import StepTracker from "@/components/StepTracker"
import { steps } from "@/data/content"
import type { Action, GameState } from "@/game/gameReducer"
import {
  CAN_GIVE_UP, STEPS, getBillsStepDti, getBillsStepReportDti,
  getLiveDti, getTotalScore, hasGaugeData,
} from "@/game/gameReducer"
import { getFeedback } from "@/game/feedback"
import { isStepAnswered } from "@/game/rules"

type Props = {
  game: GameState
  dispatch: Dispatch<Action>
  onFinish: () => void
}

export default function GameScreen({ game, dispatch, onFinish }: Props) {
  const { buyer, choices, stage, lastCorrect } = game
  const step = STEPS[game.stepIndex]
  const isLastStep = game.stepIndex === STEPS.length - 1

  const handleNext = () => {
    dispatch({ type: "next" })
    if (isLastStep) onFinish()
  }
  const handleGiveUp = () => {
    dispatch({ type: "giveUp" })
    onFinish()
  }

  const feedback = stage === "feedback" ? getFeedback(step, buyer, choices) : null

  const gaugeDti = step === "bills" ? getBillsStepDti(game) : getLiveDti(game)
  const gaugeReportDti = step === "bills" ? getBillsStepReportDti(game) : undefined
  const gaugeActive = step === "bills"
    ? Object.keys(choices.billSort).length > 0
    : hasGaugeData(game)

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-[1fr_320px]">
      <header className="space-y-4 md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-bold">Maya's kitchen table</h1>
          <div className="flex gap-2">
            <Badge variant="outline">Score: {getTotalScore(game)}</Badge>
            <Badge variant="outline">Rewinds: {game.totalRewinds}</Badge>
          </div>
        </div>
        <StepTracker stepIndex={game.stepIndex} completed={game.stepPoints.length} />
      </header>

      <div className="space-y-4">
        <StepCard step={step}>
          {step === "income" && (
            <PaystubStep
              buyer={buyer}
              selected={choices.income}
              locked={stage === "feedback"}
              onSelect={(option) => dispatch({ type: "chooseIncome", option })}
            />
          )}
          {step === "bills" && (
            <BillsStep
              buyer={buyer}
              billSort={choices.billSort}
              locked={stage === "feedback"}
              onSort={(billId, to) => dispatch({ type: "sortBill", billId, to })}
            />
          )}
          {(step === "house" || step === "event") && (
            <p className="text-sm text-muted-foreground">This step's interface is coming next.</p>
          )}
        </StepCard>

        {feedback && feedback.text && (
          <FeedbackBanner
            correct={!!lastCorrect}
            text={feedback.text}
            hint={lastCorrect ? undefined : steps[step].hint}
          />
        )}

        <StepControls
          stage={stage}
          correct={lastCorrect}
          canSubmit={isStepAnswered(step, buyer, choices)}
          canGiveUp={CAN_GIVE_UP.includes(step)}
          isLastStep={isLastStep}
          onSubmit={() => dispatch({ type: "submit" })}
          onRewind={() => dispatch({ type: "rewind" })}
          onNext={handleNext}
          onGiveUp={handleGiveUp}
        />
      </div>

      <aside className="md:sticky md:top-6 md:self-start">
        <DtiGauge dti={gaugeDti} active={gaugeActive} reportDti={gaugeReportDti} />
      </aside>
    </main>
  )
}
