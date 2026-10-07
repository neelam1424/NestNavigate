export const POINTS_PER_STEP = 25
export const REWIND_PENALTY = 10
export const MIN_POINTS = 5

/** 25 on the first try, minus 10 per rewind, never below 5. */
export const pointsForStep = (rewinds: number) =>
  Math.max(MIN_POINTS, POINTS_PER_STEP - REWIND_PENALTY * rewinds)