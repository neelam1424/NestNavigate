import { Button } from "@/components/ui/button"

type Props = { onFinish: () => void }

export default function GameScreen({ onFinish }: Props) {
  return (
    <main className="p-8">
      <p>Game steps go here.</p>
      <Button onClick={onFinish}>Finish (temporary)</Button>
    </main>
  )
}