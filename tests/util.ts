export const assertClose = (actual: number, expected: number, maxDifference: number = 0.001) => {
  const diff = Math.abs(actual - expected)
  if (diff > maxDifference) {
    throw new Error(`Expected ${expected} but got ${actual} (difference: ${diff})`)
  }
}
