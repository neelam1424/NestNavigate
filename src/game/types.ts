// Type of the game phases
export type Phase = "start" | "playing" | "result"

export type DtiZone = "comfortable" | "stretching" | "hard"

export type StepId = "income" | "bills" | "house" | "event"
export type IncomeOption = "annual" | "takeHome" | "grossMonthly"
export type BillSort = "counts" | "ignored"
export type Ending = "comfortable" | "house-poor" | "denied"


export type Withholding = { label: string; amount: number }

export type Bill = {
  id: string
  label: string
  amount: number
  countsForDti: boolean // true = debt a lender counts, false = everyday spending
  why: string // shown in the "why" beat after the player sorts it
}

export type House = {
  id: string
  name: string
  housingPayment: number
  blurb: string
}

export type LifeEvent = {
  id: string
  title: string
  description: string
  debtDelta: number // monthly change in debt payments
  lesson: string
}

export type Buyer = {
  name: string
  grossAnnual: number
  withholdings: Withholding[]
  bills: Bill[]
  houses: House[]
  lifeEvents: LifeEvent[]
}

export type Choices = {
  income: IncomeOption | null
  billSort: Record<string, BillSort>
  houseId: string | null
  eventAccepted: boolean | null
}

// example:-const buyer: Buyer = {
//   name: "Maya",

//   grossAnnual: 90000,

//   withholdings: [
//     {
//       label: "Federal Tax",
//       amount: 900
//     }
//   ],

//   bills: [
//     {
//       id: "car",
//       label: "Car Loan",
//       amount: 450,
//       countsForDti: true,
//       why: "Car loans are recurring debt obligations."
//     }
//   ],

//   houses: [
//     {
//       id: "house-1",
//       name: "Maple Street Starter",
//       housingPayment: 2200,
//       blurb: "A small starter home."
//     }
//   ],

//   lifeEvents: [
//     {
//       id: "new-car",
//       title: "Car Trouble",
//       description: "You need to finance a replacement car.",
//       debtDelta: 400,
//       lesson: "New debt can increase your DTI."
//     }
//   ]
// }