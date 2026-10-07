import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Props = { correct: boolean; text: string; hint?: string; mayaReaction?: string }

export default function FeedbackBanner({ correct, text, hint, mayaReaction }: Props) {
  return (
    <div className="space-y-2" role="status">
      <Alert variant={correct ? "default" : "destructive"}>
        <AlertTitle>{correct ? "The lender accepts this" : "The lender pushes back"}</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{text}</p>
          {hint && <p className="font-medium">Lender's note: {hint}</p>}
        </AlertDescription>
      </Alert>
      {correct && mayaReaction && (
        <div className="rounded border bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/30">
          <span className="mr-1 font-semibold">Maya:</span>
          {mayaReaction}
        </div>
      )}
    </div>
  )
}