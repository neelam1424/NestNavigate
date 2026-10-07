import { Button } from "@/components/ui/button"

type Props = { onRestart: () => void }

export default function ResultScreen({ onRestart }: Props) {
  return (
    <main className="p-8">
      <p>Results go here.</p>
      <Button onClick={onRestart}>Play again</Button>
    </main>
  )
}