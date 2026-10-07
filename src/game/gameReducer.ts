import type { BillSort, Buyer, Choices, Ending, IncomeOption, StepId } from "@/game/types"
import { calcDti, getGrossMonthly, leftoverCash, sum } from "@/game/dti"
import { isStepAnswered, isStepCorrect } from "@/game/rules"
import { pointsForStep } from "@/game/scoring"

export const STEPS: StepId[] = ["income", "bills", "house", "event"]
export const CAN_GIVE_UP: StepId[] = ["house", "event"] // steps where denial is the consequence
export const COMFORT_CASH = 1000

export type GameState = {
  buyer: Buyer
  stepIndex: number
  stage: "choosing" | "feedback"
  lastCorrect: boolean | null
  rewindsThisStep: number
  totalRewinds: number
  stepPoints: number[] // points banked for each completed step
  choices: Choices
  finished: boolean
  failed: boolean
}

export type Action =
  | { type: "chooseIncome"; option: IncomeOption }
  | { type: "sortBill"; billId: string; to: BillSort }
  | { type: "chooseHouse"; houseId: string }
  | { type: "chooseEvent"; accepted: boolean }
  | { type: "submit" }
  | { type: "rewind" }
  | { type: "next" }
  | { type: "giveUp" }
  | { type: "reset" }

const emptyChoices = (): Choices => ({
  income: null, billSort: {}, houseId: null, eventAccepted: null,
})

export const createInitialState = (buyer: Buyer): GameState => ({
  buyer, stepIndex: 0, stage: "choosing", lastCorrect: null,
  rewindsThisStep: 0, totalRewinds: 0, stepPoints: [],
  choices: emptyChoices(), finished: false, failed: false,
})

function clearStep(c: Choices, step: StepId): Choices {
  switch (step) {
    case "income": return { ...c, income: null }
    case "bills": return { ...c, billSort: {} }
    case "house": return { ...c, houseId: null }
    case "event": return { ...c, eventAccepted: null }
  }
}

export function gameReducer(state: GameState, action: Action): GameState {
  if (action.type === "reset") return createInitialState(state.buyer)
  if (state.finished) return state

  const step = STEPS[state.stepIndex]

  if (state.stage === "choosing") {
    const c = state.choices
    switch (action.type) {
      case "chooseIncome":
        return { ...state, choices: { ...c, income: action.option } }
      case "sortBill":
        return { ...state, choices: { ...c, billSort: { ...c.billSort, [action.billId]: action.to } } }
      case "chooseHouse":
        return { ...state, choices: { ...c, houseId: action.houseId } }
      case "chooseEvent":
        return { ...state, choices: { ...c, eventAccepted: action.accepted } }
      case "submit": {
        if (!isStepAnswered(step, state.buyer, c)) return state
        const correct = isStepCorrect(step, state.buyer, c)
        return {
          ...state,
          stage: "feedback",
          lastCorrect: correct,
          stepPoints: correct
            ? [...state.stepPoints, pointsForStep(state.rewindsThisStep)]
            : state.stepPoints,
        }
      }
    }
    return state
  }

  // stage === "feedback"
  switch (action.type) {
    case "rewind":
      if (state.lastCorrect) return state
      return {
        ...state,
        stage: "choosing",
        lastCorrect: null,
        rewindsThisStep: state.rewindsThisStep + 1,
        totalRewinds: state.totalRewinds + 1,
        choices: clearStep(state.choices, step),
      }
    case "next": {
      if (!state.lastCorrect) return state
      if (state.stepIndex === STEPS.length - 1) return { ...state, finished: true }
      return { ...state, stepIndex: state.stepIndex + 1, stage: "choosing", lastCorrect: null, rewindsThisStep: 0 }
    }
    case "giveUp":
      if (state.lastCorrect || !CAN_GIVE_UP.includes(step)) return state
      return { ...state, finished: true, failed: true }
  }
  return state
}

// ---- Selectors (read-only helpers the UI will call) ----

export const getTotalScore = (s: GameState) => sum(s.stepPoints)

/** DTI for the gauge, based on what the player has chosen so far. */
export function getLiveDti(s: GameState): number {
  const { buyer, choices } = s
  const debt = sum(buyer.bills.filter((b) => choices.billSort[b.id] === "counts").map((b) => b.amount))
  const housing = buyer.houses.find((h) => h.id === choices.houseId)?.housingPayment ?? 0
  const extra = choices.eventAccepted ? buyer.lifeEvents[0].debtDelta : 0
  return calcDti(debt + extra, housing, getGrossMonthly(buyer))
}

export function getEnding(s: GameState): Ending | null {
  if (!s.finished) return null
  if (s.failed) return "denied"
  const housing = s.buyer.houses.find((h) => h.id === s.choices.houseId)!.housingPayment
  const extra = s.choices.eventAccepted ? s.buyer.lifeEvents[0].debtDelta : 0
  return leftoverCash(s.buyer, housing, extra) >= COMFORT_CASH ? "comfortable" : "house-poor"
}

/** True once the player has made a choice that moves the gauge. */
export const hasGaugeData = (s: GameState) =>
  Object.keys(s.choices.billSort).length > 0 || s.choices.houseId !== null