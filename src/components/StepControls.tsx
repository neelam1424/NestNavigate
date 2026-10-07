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
    return <Button onClick={p.onSubmit} disabled={!p.canSubmit}>Check my answer</Button>
  }
  if (p.correct) {
    return <Button onClick={p.onNext}>{p.isLastStep ? "See results" : "Continue"}</Button>
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={p.onRewind}>Rewind and try again</Button>
      {p.canGiveUp && (
        <Button variant="ghost" onClick={p.onGiveUp}>Walk away from this deal</Button>
      )}
    </div>
  )
}