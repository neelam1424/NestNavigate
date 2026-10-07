import type { Dispatch } from "react"
import BillsStep from "@/components/BillsStep"
import DtiGauge from "@/components/DtiGauge"
import EventStep from "@/components/EventStep"
import FeedbackBanner from "@/components/FeedbackBanner"
import HouseStep from "@/components/HouseStep"
import PaystubStep from "@/components/PaystubStep"
import StepCard from "@/components/StepCard"
import StepControls from "@/components/StepControls"
import { mayaReactions, steps } from "@/data/content"
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
    <>
      <main className="mx-auto grid max-w-5xl gap-6 p-6 pb-24 md:grid-cols-[1fr_300px]">
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
            {step === "house" && (
              <HouseStep
                buyer={buyer}
                selectedId={choices.houseId}
                locked={stage === "feedback"}
                onSelect={(houseId) => dispatch({ type: "chooseHouse", houseId })}
              />
            )}
            {step === "event" && choices.houseId && (
              <EventStep
                buyer={buyer}
                houseId={choices.houseId}
                accepted={choices.eventAccepted}
                locked={stage === "feedback"}
                onChoose={(accepted) => dispatch({ type: "chooseEvent", accepted })}
              />
            )}
          </StepCard>

          {feedback && feedback.text && (
            <FeedbackBanner
              correct={!!lastCorrect}
              text={feedback.text}
              hint={lastCorrect ? undefined : steps[step].hint}
              mayaReaction={lastCorrect ? mayaReactions[step] : undefined}
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

        <aside className="space-y-4 md:sticky md:top-6 md:self-start">
          <DtiGauge dti={gaugeDti} active={gaugeActive} reportDti={gaugeReportDti} />
        </aside>
      </main>

      {/* Floating bottom dock */}
      <div
        aria-label="Game progress"
        className="fixed bottom-0 left-0 right-0 border-t-2 border-foreground bg-background/95 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-2 font-mono text-xs">
          <span>
            Step {game.stepIndex + 1}/{STEPS.length}: {steps[step].title}
          </span>
          <div className="flex gap-4">
            <span>Score: {getTotalScore(game)}</span>
            <span>Rewinds: {game.totalRewinds}</span>
          </div>
        </div>
      </div>
    </>
  )
}
