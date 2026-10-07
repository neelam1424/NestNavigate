import type { Bill, Buyer, DtiZone } from "@/game/types"

const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0)

export const getGrossMonthly = (b: Buyer) => b.grossAnnual / 12

export const getTakeHomeMonthly = (b: Buyer) =>
  getGrossMonthly(b) - sum(b.withholdings.map((w) => w.amount))

export const sumDebts = (bills: Bill[]) =>
  sum(bills.filter((x) => x.countsForDti).map((x) => x.amount))

export const sumLivingCosts = (bills: Bill[]) =>
  sum(bills.filter((x) => !x.countsForDti).map((x) => x.amount))

/** DTI as a ratio (0.433 = 43.3%): existing monthly debt + housing payment, divided by gross monthly income. */
export function calcDti(monthlyDebt: number, housingPayment: number, grossMonthly: number) {
  if (grossMonthly <= 0) throw new Error("Gross monthly income must be positive")
  return (monthlyDebt + housingPayment) / grossMonthly
}

export function getDtiZone(dti: number): DtiZone {
  if (dti < 0.36) return "comfortable"
  if (dti <= 0.43) return "stretching"
  return "hard"
}

/** Cash left each month after debts, housing, and living costs. */
export function leftoverCash(b: Buyer, housingPayment: number, extraDebt = 0) {
  return (
    getTakeHomeMonthly(b) -
    sumDebts(b.bills) -
    extraDebt -
    housingPayment -
    sumLivingCosts(b.bills)
  )
}

export const formatPercent = (ratio: number) => `${(ratio * 100).toFixed(1)}%`