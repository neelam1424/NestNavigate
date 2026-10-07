import { useReducer, useState } from "react"
import { maya } from "@/data/maya"
import { createInitialState, gameReducer } from "@/game/gameReducer"
import type { Phase } from "@/game/types"
import GameScreen from "@/screens/GameScreen"
import ResultScreen from "@/screens/ResultScreen"
import StartScreen from "@/screens/StartScreen"

export default function App() {
  const [phase, setPhase] = useState<Phase>("start")
  const [game, dispatch] = useReducer(gameReducer, maya, createInitialState)

  const restart = () => {
    dispatch({ type: "reset" })
    setPhase("start")
  }

  if (phase === "start") return <StartScreen onStart={() => setPhase("playing")} />
  if (phase === "playing")
    return <GameScreen game={game} dispatch={dispatch} onFinish={() => setPhase("result")} />
  return <ResultScreen game={game} onRestart={restart} />
}