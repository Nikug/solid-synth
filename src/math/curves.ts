export const normalize = (value: number, min: number, max: number) => {
  const newValue = (value - min) / (max - min)
  if (newValue < 0) return 0
  if (newValue > 1) return 1
  return newValue
}

export const unnormalize = (value: number, min: number, max: number) => {
  return value * (max - min) + min
}

export const easeInCubic = (value: number) => {
  return Math.pow(value, 3)
}

export const easeOutCubic = (value: number) => {
  return Math.pow(value, 1 / 3)
}
