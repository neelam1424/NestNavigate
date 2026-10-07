import { describe, it, expect } from "vitest"
import { STEPS } from "@/game/gameReducer"
import { steps, endings } from "@/data/content"

describe("content", () => {
  it("has complete text for every step", () => {
    for (const id of STEPS) {
      const c = steps[id]
      expect(c, id).toBeDefined()
      for (const field of Object.values(c)) expect(field.length).toBeGreaterThan(0)
    }
  })

  it("has all three endings", () => {
    expect(Object.keys(endings).sort()).toEqual(["comfortable", "denied", "house-poor"])
  })
})