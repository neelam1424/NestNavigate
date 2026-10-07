import { describe, expect, it } from "vitest"
import { maya } from "@/data/maya"
import { createInitialState, gameReducer } from "@/game/gameReducer"
import type { Action } from "@/game/gameReducer"
import { endingMood, getMood } from "@/game/mood"

const run = (actions: Action[]) => actions.reduce(gameReducer, createInitialState(maya))

const submitNext: Action[] = [{ type: "submit" }, { type: "next" }]
const sortAll: Action[] = maya.bills.map((b): Action => ({
  type: "sortBill", billId: b.id, to: b.countsForDti ? "counts" : "ignored",
}))
const upToHouse: Action[] = [
  { type: "chooseIncome", option: "grossMonthly" }, ...submitNext,
  ...sortAll, ...submitNext,
]

describe("getMood", () => {
  it("fresh state is neutral", () => {
    expect(getMood(createInitialState(maya))).toBe("neutral")
  })

  it("income step: takeHome then submit is sad", () => {
    const s = run([{ type: "chooseIncome", option: "takeHome" }, { type: "submit" }])
    expect(getMood(s)).toBe("sad")
  })

  it("income step: grossMonthly then submit is happy", () => {
    const s = run([{ type: "chooseIncome", option: "grossMonthly" }, { type: "submit" }])
    expect(getMood(s)).toBe("happy")
  })

  it("after upToHouse, choosing house a is happy (live, before submit)", () => {
    const s = run([...upToHouse, { type: "chooseHouse", houseId: "a" }])
    expect(getMood(s)).toBe("happy")
  })

  it("after upToHouse, choosing house b is anxious (live, before submit)", () => {
    const s = run([...upToHouse, { type: "chooseHouse", houseId: "b" }])
    expect(getMood(s)).toBe("anxious")
  })

  it("after upToHouse, choosing house c is sad (live, before submit)", () => {
    const s = run([...upToHouse, { type: "chooseHouse", houseId: "c" }])
    expect(getMood(s)).toBe("sad")
  })

  it("house b then submit: lastCorrect is true and mood is anxious", () => {
    const s = run([...upToHouse, { type: "chooseHouse", houseId: "b" }, { type: "submit" }])
    expect(s.lastCorrect).toBe(true)
    expect(getMood(s)).toBe("anxious")
  })

  it("house a, submit, next, then chooseEvent accepted:true before submit is sad", () => {
    const s = run([
      ...upToHouse,
      { type: "chooseHouse", houseId: "a" }, ...submitNext,
      { type: "chooseEvent", accepted: true },
    ])
    expect(getMood(s)).toBe("sad")
  })
})

describe("endingMood", () => {
  it("maps all three endings", () => {
    expect(endingMood.comfortable).toBe("happy")
    expect(endingMood["house-poor"]).toBe("anxious")
    expect(endingMood.denied).toBe("sad")
  })
})
