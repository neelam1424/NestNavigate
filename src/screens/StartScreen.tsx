import { Button } from "@/components/ui/button"
import { DISCLAIMER } from "@/data/content"

type Props = { onStart: () => void }

export default function StartScreen({ onStart }: Props) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="-rotate-1 rounded border-2 border-foreground bg-amber-50 p-6 shadow-md dark:bg-amber-950/20">
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Nest Navigate
          </p>
          <h1 className="text-3xl font-bold leading-tight">
            Can You Afford This House?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Help Maya figure out her debt-to-income ratio before she sends her loan application.
            The numbers react as you work.
          </p>
        </div>

        <div className="rotate-1 space-y-3 rounded border-2 bg-card p-5 shadow-sm">
          <p className="font-mono text-sm font-semibold">Four steps at Maya's kitchen table:</p>
          <ol className="space-y-1 text-sm text-muted-foreground">
            <li>1. Read the paystub</li>
            <li>2. Sort the bills</li>
            <li>3. Pick a home</li>
            <li>4. Handle a surprise call</li>
          </ol>
          <Button onClick={onStart} className="w-full mt-2">Start</Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">{DISCLAIMER}</p>
      </div>
    </main>
  )
}
