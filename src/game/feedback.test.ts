import { describe, it, expect } from "vitest"
import { maya } from "@/data/maya"
import { getFeedback } from "@/game/feedback"
import type { Choices } from "@/game/types"

const base = (): Choices => ({ income: null, billSort: {}, houseId: null, eventAccepted: null })

describe("getFeedback - income", () => {
  it("grossMonthly is correct", () => {
    expect(getFeedback("income", maya, { ...base(), income: "grossMonthly" }).correct).toBe(true)
  })
  it("annual is wrong", () => {
    expect(getFeedback("income", maya, { ...base(), income: "annual" }).correct).toBe(false)
  })
  it("takeHome is wrong", () => {
    expect(getFeedback("income", maya, { ...base(), income: "takeHome" }).correct).toBe(false)
  })
})

describe("getFeedback - bills", () => {
  const correctSort = Object.fromEntries(
    maya.bills.map((b) => [b.id, b.countsForDti ? "counts" as const : "ignored" as const]),
  )

  it("all correct", () => {
    const f = getFeedback("bills", maya, { ...base(), billSort: correctSort })
    expect(f.correct).toBe(true)
  })

  it("missed a debt shows missedDebt message", () => {
    const missedSort = { ...correctSort, car: "ignored" as const }
    const f = getFeedback("bills", maya, { ...base(), billSort: missedSort })
    expect(f.correct).toBe(false)
    expect(f.text).toContain("loan is missing")
  })

  it("counted spending shows countedSpending message", () => {
    const countedSort = Object.fromEntries(maya.bills.map((b) => [b.id, "counts" as const]))
    const f = getFeedback("bills", maya, { ...base(), billSort: countedSort })
    expect(f.correct).toBe(false)
    expect(f.text).toContain("Everyday spending")
  })
})

describe("getFeedback - house", () => {
  it("Home A is correct (comfortable)", () => {
    const f = getFeedback("house", maya, { ...base(), houseId: "a" })
    expect(f.correct).toBe(true)
    expect(f.text).toContain("Approved")
  })
  it("Home B is correct (stretching)", () => {
    expect(getFeedback("house", maya, { ...base(), houseId: "b" }).correct).toBe(true)
  })
  it("Home C is declined", () => {
    const f = getFeedback("house", maya, { ...base(), houseId: "c" })
    expect(f.correct).toBe(false)
    expect(f.text).toContain("Declined")
  })
})

describe("getFeedback - event", () => {
  it("waiting is correct", () => {
    expect(getFeedback("event", maya, { ...base(), houseId: "a", eventAccepted: false }).correct).toBe(true)
  })
  it("financing now is wrong", () => {
    const f = getFeedback("event", maya, { ...base(), houseId: "a", eventAccepted: true })
    expect(f.correct).toBe(false)
    expect(f.text).toContain("Approval at risk")
  })
})
