export const normalize = (value: number, min: number, max: number) => {
  return (value - min) / (max - min)
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
