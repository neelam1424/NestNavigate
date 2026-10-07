import type { DtiZone, Ending } from "@/game/types"
import type { GameState } from "@/game/gameReducer"
import { getLiveDti } from "@/game/gameReducer"
import { getDtiZone } from "@/game/dti"

export type Mood = "neutral" | "happy" | "anxious" | "sad"

export const endingMood: Record<Ending, Mood> = {
  comfortable: "happy",
  "house-poor": "anxious",
  denied: "sad",
}

const zoneMoodMap: Record<DtiZone, Mood> = {
  comfortable: "happy",
  stretching: "anxious",
  hard: "sad",
}

export function getMood(s: GameState): Mood {
  const zoneMood = s.choices.houseId !== null
    ? zoneMoodMap[getDtiZone(getLiveDti(s))]
    : null

  if (s.stage === "feedback") {
    if (!s.lastCorrect) return "sad"
    return zoneMood === "anxious" ? "anxious" : "happy"
  }

  return zoneMood ?? "neutral"
}
