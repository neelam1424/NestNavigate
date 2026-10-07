import { describe, it, expect } from "vitest"
import { maya } from "@/data/maya"
import {
  incomeValue,calcDti, getDtiZone, getGrossMonthly, getTakeHomeMonthly, sumDebts, leftoverCash,
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
  expect(calcDti(debts, housing("a"), gross)).toBeCloseTo(0.3533, 3)
  expect(getDtiZone(calcDti(debts, housing("a"), gross))).toBe("comfortable")
  expect(getDtiZone(calcDti(debts, housing("b"), gross))).toBe("stretching")
  expect(getDtiZone(calcDti(debts, housing("c"), gross))).toBe("hard")
})

it("a new car loan pushes Home A over the line", () => {
  const dti = calcDti(debts + 600, housing("a"), gross)
  expect(dti).toBeCloseTo(0.4333, 3)
  expect(getDtiZone(dti)).toBe("hard")
})

it("Home B leaves little cash", () => {
  expect(leftoverCash(maya, housing("a"))).toBe(1300)
  expect(leftoverCash(maya, housing("b"))).toBe(750)
})
it("exposes the figure behind each income option", () => {
  expect(incomeValue(maya, "annual")).toBe(90000)
  expect(incomeValue(maya, "takeHome")).toBe(5650)
  expect(incomeValue(maya, "grossMonthly")).toBe(7500)
})

it("using take-home pay makes Home A look unaffordable", () => {
  const dti = calcDti(debts, housing("a"), incomeValue(maya, "takeHome"))
  expect(getDtiZone(dti)).toBe("hard")
})
})