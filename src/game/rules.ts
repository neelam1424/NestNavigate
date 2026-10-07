import type { Buyer, Choices, StepId } from "@/game/types"
import { APPROVAL_LIMIT, calcDti, getGrossMonthly, sumDebts } from "@/game/dti"

export function isStepAnswered(step: StepId, buyer: Buyer, c: Choices): boolean {
  switch (step) {
    case "income": return c.income !== null
    case "bills": return buyer.bills.every((b) => c.billSort[b.id] !== undefined)
    case "house": return c.houseId !== null
    case "event": return c.eventAccepted !== null
  }
}

export function isStepCorrect(step: StepId, buyer: Buyer, c: Choices): boolean {
  const gross = getGrossMonthly(buyer)
  const debt = sumDebts(buyer.bills)
  const house = buyer.houses.find((h) => h.id === c.houseId)
  const event = buyer.lifeEvents[0] // v1 uses the first life event

  switch (step) {
    case "income":
      return c.income === "grossMonthly"
    case "bills":
      return buyer.bills.every(
        (b) => c.billSort[b.id] === (b.countsForDti ? "counts" : "ignored"),
      )
    case "house":
      return !!house && calcDti(debt, house.housingPayment, gross) <= APPROVAL_LIMIT
    case "event": {
      if (!house || c.eventAccepted === null) return false
      const extra = c.eventAccepted ? event.debtDelta : 0
      return calcDti(debt + extra, house.housingPayment, gross) <= APPROVAL_LIMIT
    }
  }
}