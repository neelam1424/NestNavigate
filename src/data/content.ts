// Content that is used to teach the user about the concepts of DTI 
import type { DtiZone, Ending, IncomeOption, StepId } from "@/game/types"

export const DISCLAIMER =
  "Simplified for education: real lenders also count property taxes, insurance, and other factors. Not financial advice."

export type StepContent = {
  title: string
  place: string // which object on the table this step happens at
  definition: string // what
  why: string // why it matters
  how: string // how to do it
  prompt: string // the player's move
  hint: string // shown after a wrong try: a nudge, not the answer
}

export const steps: Record<StepId, StepContent> = {
  income: {
    title: "Read the paystub",
    place: "Paystub",
    definition:
      "Gross income is what you earn before anything is taken out. Take-home pay is what actually reaches your bank account.",
    why: "Lenders measure your payments against income they can verify on your tax documents.",
    how: "Open the paystub, compare the three figures, and pick the monthly income a lender uses.",
   prompt: "Fill in the income line on the loan application by clicking a line on the paystub.",
    hint: "Lenders compare monthly payments to monthly income. Which monthly figure on the paystub is the one before anything is taken out?",
  },
  bills: {
    title: "Sort the bills",
    place: "Bills pile",
    definition:
      "A debt obligation is a recurring payment you owe on a loan or credit account. Everyday spending, like food, utilities, and subscriptions, is not.",
    why: "DTI only measures money you've committed to lenders. Counting groceries would make almost everyone look unapprovable, and skipping a loan hides a risk the lender will find on a credit report.",
    how: "Look at each bill and decide whether it counts toward DTI or is ignored. Watch the gauge move.",
    prompt: "Sort Maya's bills for the lender.",
    hint: "For each bill, ask: if Maya stopped paying, would a lender come after her? Only those count.",
  },
  house: {
    title: "Pick a home",
    place: "Listings folder",
    definition:
      "Your housing payment is the monthly cost of the home loan. DTI adds it to your existing debts and divides by gross monthly income.",
    why: "Most lenders want DTI at or under 43%. Below 36% is comfortable, and 36-43% is a stretch.",
    how: "Pick a home and read the gauge, then check how much of Maya's take-home pay is left.",
    prompt: "Which home can Maya take on?",
    hint: "Watch which zone the gauge lands in. Above 43%, most lenders won't approve the loan.",
  },
  event: {
    title: "A surprise call",
    place: "Phone",
    definition:
      "A life event is any change to your finances between getting approved and closing day.",
    why: "Lenders re-check your credit before closing. New debt raises DTI and can cancel an approval.",
    how: "Decide whether Maya takes on the new loan now, and watch the gauge update.",
    prompt: "Does Maya finance the new car now?",
    hint: "Compare the gauge with and without the loan. Where does Maya's DTI land if she waits until after closing?",
  },
}

export const glossary = {
  dti: "Debt-to-income ratio (DTI): the share of your gross monthly income that goes to debt payments, including the new housing payment.",
  gross: "Gross income: what you earn before taxes and other deductions come out.",
  takeHome: "Take-home pay: what lands in your bank account after taxes and deductions.",
  debt: "Debt obligation: a recurring payment you owe on a loan or credit account, like a car loan, student loan, or card minimum.",
} as const

export const incomeOptions: { id: IncomeOption; label: string }[] = [
  { id: "annual", label: "Annual salary" },
  { id: "takeHome", label: "Monthly take-home pay" },
  { id: "grossMonthly", label: "Gross monthly income" },
]

export const incomeFeedback: Record<IncomeOption, { correct: boolean; text: string }> = {
  annual: {
    correct: false,
    text: "A yearly figure can't be compared with monthly payments, so the application bounces back.",
  },
  takeHome: {
    correct: false,
    text: "Take-home pay is after taxes. Lenders use pre-tax income, so this understates what Maya earns and makes her DTI look worse than it is.",
  },
 grossMonthly: {
  correct: true,
  text: "Lenders use gross monthly income, verified on your tax documents. They don't pick whichever number looks friendliest.",
},
}

export const billsFeedback = {
  correct: "Every debt counted and every living cost ignored.",
  missedDebt:
    "A loan is missing from the list. The lender sees it on Maya's credit report anyway, so her real DTI is higher than she thought.",
  countedSpending:
    "Everyday spending was counted as debt. Maya's DTI looks inflated, so she seems unable to afford a home she actually can.",
}

export const zoneFeedback: Record<DtiZone, { headline: string; body: string }> = {
  comfortable: {
    headline: "Approved, with room to breathe",
    body: "Under 36%: lenders are comfortable, and Maya has slack for surprises.",
  },
  stretching: {
    headline: "Approved, but it's a stretch",
    body: "Between 36% and 43%: most lenders will approve, but there's less margin. Is there enough cash left each month?",
  },
  hard: {
    headline: "Declined",
    body: "Above 43%: most lenders won't approve this loan.",
  },
}

export const eventFeedback = {
  accepted: {
    headline: "Approval at risk",
    body: "The new car loan pushes DTI over the line. Lenders re-check before closing, so the approval could be pulled.",
  },
  declined: {
    headline: "Approval stays safe",
    body: "Waiting until after closing keeps Maya's DTI where the lender approved it.",
  },
}

export const endings: Record<Ending, { title: string; summary: string; takeaway: string }> = {
  comfortable: {
    title: "Approved and comfortable",
    summary: "You found a home Maya can afford on paper and in real life.",
    takeaway:
      "A good result is a DTI the lender accepts and a monthly budget that still has room.",
  },
  "house-poor": {
    title: "Approved, but house-poor",
    summary: "The lender said yes, but Maya has little cash left each month.",
    takeaway:
      "Approval is the lender's limit, not your budget. Always check what's left of your take-home pay.",
  },
  denied: {
    title: "Denied",
    summary: "The lender turned this application down.",
    takeaway:
      "DTI is checked before you fall in love with a house, and again before closing. Keep your debts steady until you have the keys.",
  },
}