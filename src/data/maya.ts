import type { Buyer } from "@/game/types"

export const maya: Buyer = {
  name: "Maya",
  grossAnnual: 90000,
  // Fixed, fictional numbers. The player reads them; there is no tax calculator.
  withholdings: [
    { label: "Federal income tax", amount: 750 },
    { label: "Social Security & Medicare", amount: 574 },
    { label: "State income tax", amount: 526 },
  ],
  bills: [
    { id: "car", label: "Car payment", amount: 450, countsForDti: true,
      why: "An installment loan on your credit report. Lenders count it." },
    { id: "student", label: "Student loan", amount: 300, countsForDti: true,
      why: "A recurring loan obligation. Lenders count it." },
    { id: "card", label: "Credit-card minimum", amount: 100, countsForDti: true,
      why: "The minimum payment counts, not the full balance." },
    { id: "groceries", label: "Groceries", amount: 500, countsForDti: false,
      why: "Everyday spending isn't a debt obligation, so lenders ignore it." },
    { id: "utilities", label: "Utilities", amount: 250, countsForDti: false,
      why: "A living cost, not a debt. Not part of DTI." },
    { id: "transport", label: "Gas & car insurance", amount: 400, countsForDti: false,
      why: "A living cost. Only the car loan itself counts." },
    { id: "phone", label: "Phone & internet", amount: 150, countsForDti: false,
      why: "A bill, but not a debt obligation. Lenders ignore it." },
    { id: "netflix", label: "Netflix", amount: 20, countsForDti: false,
      why: "Subscriptions don't appear in DTI." },
    { id: "gym", label: "Gym", amount: 40, countsForDti: false,
      why: "Subscriptions don't appear in DTI." },
    { id: "misc", label: "Dining out & misc", amount: 340, countsForDti: false,
      why: "Discretionary spending isn't counted by lenders." },
  ],
  houses: [
    { id: "a", name: "Home A", housingPayment: 1800, blurb: "Cozy starter home" },
    { id: "b", name: "Home B", housingPayment: 2350, blurb: "Bigger, nicer street" },
    { id: "c", name: "Home C", housingPayment: 3100, blurb: "Dream home" },
  ],
  lifeEvents: [
    { id: "new-car", title: "New car loan",
  description: "Maya wants to finance a new car: +$600/month.",
  debtDelta: 600,
  lesson: "New debt before closing raises DTI and can sink an approval." },
    { id: "payoff", title: "Student loan paid off",
      description: "Maya pays off her student loan: -$300/month.",
      debtDelta: -300,
      lesson: "Paying down debt lowers DTI and strengthens an application." },
  ],
}