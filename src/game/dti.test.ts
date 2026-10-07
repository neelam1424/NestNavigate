import { describe, it, expect } from "vitest"
import { maya } from "@/data/maya"
import {
  calcDti, getDtiZone, getGrossMonthly, getTakeHomeMonthly, sumDebts, leftoverCash,
} from "@/game/dti"

const gross = getGrossMonthly(maya)
const debts = sumDebts(maya.bills)
const housing = (id: string) => maya.houses.find((h) => h.id === id)!.housingPayment

describe("Maya's numbers", () => {
  it("derives income and debts", () => {
    expect(gross).toBe(7500)
    expect(getTakeHomeMonthly(maya)).toBe(5650)
    expect(debts).toBe(850)
  })

  it("scores each house", () => {
    expect(calcDti(debts, housing("a"), gross)).toBeCloseTo(0.3667, 3)
    expect(getDtiZone(calcDti(debts, housing("b"), gross))).toBe("stretching")
    expect(getDtiZone(calcDti(debts, housing("c"), gross))).toBe("hard")
  })

  it("a new car loan pushes Home A over the line", () => {
    const dti = calcDti(debts + 500, housing("a"), gross)
    expect(dti).toBeCloseTo(0.4333, 3)
    expect(getDtiZone(dti)).toBe("hard")
  })

  it("Home B leaves little cash", () => {
    expect(leftoverCash(maya, housing("a"))).toBe(1200)
    expect(leftoverCash(maya, housing("b"))).toBe(750)
  })
})