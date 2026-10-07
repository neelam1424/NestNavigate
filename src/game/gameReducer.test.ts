import { describe, it, expect } from "vitest"
import { maya } from "@/data/maya"
import { createInitialState, gameReducer, getEnding, getTotalScore } from "@/game/gameReducer"
import type { Action } from "@/game/gameReducer"
import { pointsForStep } from "@/game/scoring"

const run = (actions: Action[]) => actions.reduce(gameReducer, createInitialState(maya))

const submitNext: Action[] = [{ type: "submit" }, { type: "next" }]
const sortAll: Action[] = maya.bills.map((b): Action => ({
  type: "sortBill", billId: b.id, to: b.countsForDti ? "counts" : "ignored",
}))

const upToHouse: Action[] = [
  { type: "chooseIncome", option: "grossMonthly" }, ...submitNext,
  ...sortAll, ...submitNext,
]
const finish = (houseId: string): Action[] => [
  ...upToHouse,
  { type: "chooseHouse", houseId }, ...submitNext,
  { type: "chooseEvent", accepted: false }, ...submitNext,
]

describe("scoring", () => {
  it("loses 10 per rewind, floor of 5", () => {
    expect([0, 1, 2, 3].map(pointsForStep)).toEqual([25, 15, 5, 5])
  })
})

describe("game loop", () => {
  it("perfect run on Home A: 100 points, comfortable", () => {
    const s = run(finish("a"))
    expect(s.finished).toBe(true)
    expect(getTotalScore(s)).toBe(100)
    expect(getEnding(s)).toBe("comfortable")
  })

  it("Home B is approved but house-poor", () => {
    expect(getEnding(run(finish("b")))).toBe("house-poor")
  })

  it("a wrong answer plays out, then a rewind costs points", () => {
    let s = run([{ type: "chooseIncome", option: "takeHome" }, { type: "submit" }])
    expect(s.lastCorrect).toBe(false)
    s = run([
      { type: "chooseIncome", option: "takeHome" }, { type: "submit" }, { type: "rewind" },
      { type: "chooseIncome", option: "grossMonthly" }, ...submitNext,
    ])
    expect(s.stepPoints[0]).toBe(15)
    expect(s.totalRewinds).toBe(1)
  })

  it("can't advance past a wrong answer", () => {
    const s = run([{ type: "chooseIncome", option: "annual" }, { type: "submit" }, { type: "next" }])
    expect(s.stepIndex).toBe(0)
  })

  it("Home C is denied; giving up ends the game as denied", () => {
    const s = run([...upToHouse, { type: "chooseHouse", houseId: "c" }, { type: "submit" }, { type: "giveUp" }])
    expect(s.finished).toBe(true)
    expect(getEnding(s)).toBe("denied")
  })

  it("financing the new car sinks an approval", () => {
    const s = run([...upToHouse, { type: "chooseHouse", houseId: "a" }, ...submitNext,
      { type: "chooseEvent", accepted: true }, { type: "submit" }])
    expect(s.lastCorrect).toBe(false)
  })

  it("giving up isn't allowed on the income step", () => {
    const s = run([{ type: "chooseIncome", option: "annual" }, { type: "submit" }, { type: "giveUp" }])
    expect(s.finished).toBe(false)
  })
})