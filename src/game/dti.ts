import type { Bill, Buyer, DtiZone, IncomeOption } from "@/game/types"

export const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0)

export const COMFORT_LIMIT = 0.36
export const APPROVAL_LIMIT = 0.43

export const getGrossMonthly = (b: Buyer) => b.grossAnnual / 12

export const getTakeHomeMonthly = (b: Buyer) =>
  getGrossMonthly(b) - sum(b.withholdings.map((w) => w.amount))

export const sumDebts = (bills: Bill[]) =>
  sum(bills.filter((x) => x.countsForDti).map((x) => x.amount))

export const sumLivingCosts = (bills: Bill[]) =>
  sum(bills.filter((x) => !x.countsForDti).map((x) => x.amount))

/** DTI as a ratio (0.433 = 43.3%). Simplified: housing payment only. */
export function calcDti(monthlyDebt: number, housingPayment: number, grossMonthly: number) {
  if (grossMonthly <= 0) throw new Error("Gross monthly income must be positive")
  return (monthlyDebt + housingPayment) / grossMonthly
}

export function getDtiZone(dti: number): DtiZone {
  if (dti < COMFORT_LIMIT) return "comfortable"
  if (dti <= APPROVAL_LIMIT) return "stretching"
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

/** The dollar figure behind each income choice on the paystub. */
export function incomeValue(b: Buyer, option: IncomeOption): number {
  switch (option) {
    case "annual": return b.grossAnnual
    case "takeHome": return getTakeHomeMonthly(b)
    case "grossMonthly": return getGrossMonthly(b)
  }
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
})
export const formatMoney = (n: number) => usd.format(n)