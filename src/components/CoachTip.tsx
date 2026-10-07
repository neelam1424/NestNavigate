import { useState } from "react"
import { Button } from "@/components/ui/button"

type Props = { tip: string }

export default function CoachTip({ tip }: Props) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="rounded border-2 border-dashed px-4 py-3 text-sm">
      {revealed ? (
        <p className="font-mono text-xs leading-relaxed">{tip}</p>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setRevealed(true)}>
          Show me the numbers
        </Button>
      )}
    </div>
  )
}
