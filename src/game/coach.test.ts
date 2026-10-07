import { describe, expect, it } from "vitest"
import { maya } from "@/data/maya"
import { createInitialState, gameReducer } from "@/game/gameReducer"
import type { Action } from "@/game/gameReducer"
import { maxHousingPayment } from "@/game/dti"
import { getCoachTip } from "@/game/coach"

const run = (actions: Action[]) => actions.reduce(gameReducer, createInitialState(maya))

const submitNext: Action[] = [{ type: "submit" }, { type: "next" }]
const sortAll: Action[] = maya.bills.map((b): Action => ({
  type: "sortBill", billId: b.id, to: b.countsForDti ? "counts" : "ignored",
}))
const upToHouse: Action[] = [
  { type: "chooseIncome", option: "grossMonthly" }, ...submitNext,
  ...sortAll, ...submitNext,
]

describe("maxHousingPayment", () => {
  it("returns 2375 for Maya", () => {
    expect(maxHousingPayment(maya)).toBe(2375)
  })
})

describe("getCoachTip", () => {
  it("returns null before any send", () => {
    expect(getCoachTip(createInitialState(maya))).toBeNull()
  })

  it("returns null after a correct send (income step)", () => {
    const s = run([{ type: "chooseIncome", option: "grossMonthly" }, { type: "submit" }])
    expect(getCoachTip(s)).toBeNull()
  })

  it("returns null for the income step even on a wrong send", () => {
    const s = run([{ type: "chooseIncome", option: "takeHome" }, { type: "submit" }])
    expect(getCoachTip(s)).toBeNull()
  })

  it("after Home C submitted the tip contains $2,375", () => {
    const s = run([...upToHouse, { type: "chooseHouse", houseId: "c" }, { type: "submit" }])
    expect(getCoachTip(s)).toContain("$2,375")
  })

  it("after sorting every bill as ignored and submitting, tip contains $850", () => {
    const allIgnored: Action[] = maya.bills.map((b): Action => ({
      type: "sortBill", billId: b.id, to: "ignored",
    }))
    const s = run([
      { type: "chooseIncome", option: "grossMonthly" }, ...submitNext,
      ...allIgnored, { type: "submit" },
    ])
    expect(getCoachTip(s)).toContain("$850")
  })
})
