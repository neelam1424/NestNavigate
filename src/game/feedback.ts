import type { Buyer, Choices, StepId } from "@/game/types"
import { calcDti, getDtiZone, getGrossMonthly, sumDebts } from "@/game/dti"
import { billsFeedback, eventFeedback, incomeFeedback, zoneFeedback } from "@/data/content"

export type Feedback = { correct: boolean; text: string }

export function getFeedback(step: StepId, buyer: Buyer, choices: Choices): Feedback {
  switch (step) {
    case "income": {
      if (!choices.income) return { correct: false, text: "" }
      const f = incomeFeedback[choices.income]
      return { correct: f.correct, text: f.text }
    }
    case "bills": {
      const allCorrect = buyer.bills.every(
        (b) => choices.billSort[b.id] === (b.countsForDti ? "counts" : "ignored"),
      )
      const missedDebt = buyer.bills.some(
        (b) => b.countsForDti && choices.billSort[b.id] !== "counts",
      )
      const text = allCorrect
        ? billsFeedback.correct
        : missedDebt
          ? billsFeedback.missedDebt
          : billsFeedback.countedSpending
      return { correct: allCorrect, text }
    }
    case "house": {
      if (!choices.houseId) return { correct: false, text: "" }
      const house = buyer.houses.find((h) => h.id === choices.houseId)!
      const dti = calcDti(sumDebts(buyer.bills), house.housingPayment, getGrossMonthly(buyer))
      const zone = getDtiZone(dti)
      const f = zoneFeedback[zone]
      return { correct: zone !== "hard", text: `${f.headline}. ${f.body}` }
    }
    case "event": {
      if (choices.eventAccepted === null) return { correct: false, text: "" }
      const f = choices.eventAccepted ? eventFeedback.accepted : eventFeedback.declined
      return { correct: !choices.eventAccepted, text: `${f.headline}. ${f.body}` }
    }
  }
}
