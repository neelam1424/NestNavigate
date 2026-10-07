import { Button } from "@/components/ui/button"

type Props = {
  stage: "choosing" | "feedback"
  correct: boolean | null
  canSubmit: boolean
  canGiveUp: boolean
  isLastStep: boolean
  onSubmit: () => void
  onRewind: () => void
  onNext: () => void
  onGiveUp: () => void
}

export default function StepControls(p: Props) {
  if (p.stage === "choosing") {
    return (
      <Button
        onClick={p.onSubmit}
        disabled={!p.canSubmit}
        className="w-full sm:w-auto"
      >
        Send to lender
      </Button>
    )
  }
  if (p.correct) {
    return (
      <Button onClick={p.onNext} className="w-full sm:w-auto">
        {p.isLastStep ? "See results" : "Continue"}
      </Button>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={p.onRewind} className="w-full sm:w-auto">Revise application</Button>
      {p.canGiveUp && (
        <Button variant="ghost" onClick={p.onGiveUp} className="w-full sm:w-auto">
          Walk away from this deal
        </Button>
      )}
    </div>
  )
}
