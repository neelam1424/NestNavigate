import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Props = { correct: boolean; text: string; hint?: string }

export default function FeedbackBanner({ correct, text, hint }: Props) {
  return (
    <Alert variant={correct ? "default" : "destructive"} role="status">
      <AlertTitle>{correct ? "That works" : "Here's what happens"}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{text}</p>
        {hint && <p className="font-medium">Hint: {hint}</p>}
      </AlertDescription>
    </Alert>
  )
}