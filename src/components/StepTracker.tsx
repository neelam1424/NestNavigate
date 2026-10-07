import { Progress } from "@/components/ui/progress"
import { steps } from "@/data/content"
import { STEPS } from "@/game/gameReducer"

type Props = { stepIndex: number; completed: number }

export default function StepTracker({ stepIndex, completed }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Step {stepIndex + 1} of {STEPS.length}: {steps[STEPS[stepIndex]].title}
        </span>
        <span className="text-muted-foreground">{completed} done</span>
      </div>
      <Progress value={(completed / STEPS.length) * 100} />
    </div>
  )
}