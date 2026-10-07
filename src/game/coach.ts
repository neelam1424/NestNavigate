import type { GameState } from "@/game/gameReducer"
import { getLiveDti, STEPS } from "@/game/gameReducer"
import { formatMoney, formatPercent, maxHousingPayment, sum, sumDebts } from "@/game/dti"

export function getCoachTip(s: GameState): string | null {
  if (s.stage !== "feedback" || s.lastCorrect !== false) return null

  const step = STEPS[s.stepIndex]
  const { buyer, choices } = s

  switch (step) {
    case "income":
      return null

    case "bills": {
      const listedDebt = sum(
        buyer.bills.filter((b) => choices.billSort[b.id] === "counts").map((b) => b.amount),
      )
      const trueDebt = sumDebts(buyer.bills)
      return `Your list adds up to ${formatMoney(listedDebt)} a month in debt. Maya's credit report shows ${formatMoney(trueDebt)}.`
    }

    case "house": {
      const trueDebt = sumDebts(buyer.bills)
      const maxPayment = maxHousingPayment(buyer)
      return `With ${formatMoney(trueDebt)} of existing debt, a 43% limit caps Maya's housing payment at ${formatMoney(maxPayment)} a month. Compare that with each listing.`
    }

    case "event": {
      const event = buyer.lifeEvents[0]
      const dti = getLiveDti(s)
      return `Financing adds ${formatMoney(event.debtDelta)} a month in debt, which puts Maya's DTI at ${formatPercent(dti)}.`
    }
  }
}
