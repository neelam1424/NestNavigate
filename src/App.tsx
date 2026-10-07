import { useState } from "react"
import type { Phase } from "@/game/types"
import StartScreen from "@/screens/StartScreen"
import GameScreen from "@/screens/GameScreen"
import ResultScreen from "@/screens/ResultScreen"

export default function App() {
  const [phase, setPhase] = useState<Phase>("start")

  if (phase === "start") return <StartScreen onStart={() => setPhase("playing")} />
  if (phase === "playing") return <GameScreen onFinish={() => setPhase("result")} />
  return <ResultScreen onRestart={() => setPhase("start")} />
}