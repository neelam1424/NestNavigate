import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { steps } from "@/data/content"
import type { StepId } from "@/game/types"

type Props = { step: StepId; children?: ReactNode }

function Beat({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd className="text-muted-foreground">{text}</dd>
    </div>
  )
}

export default function StepCard({ step, children }: Props) {
  const c = steps[step]
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Badge variant="outline" className="w-fit">At the {c.place.toLowerCase()}</Badge>
        <CardTitle className="text-2xl">{c.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="space-y-3 text-sm">
          <Beat label="What it is" text={c.definition} />
          <Beat label="Why it matters" text={c.why} />
          <Beat label="How it works" text={c.how} />
        </dl>
        <div className="space-y-3 border-t pt-4">
          <p className="font-medium">{c.prompt}</p>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}