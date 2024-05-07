export const degToRad = (deg) => {
  return (deg * Math.PI) / 180
}

export const semitonesToFrequency = (semitones, frequency) => {
  return Math.pow(2, semitones / 12) * frequency
}

export const clamp = (value, min, max) => {
  if (value < min) return min
  if (value > max) return max
  return value
}
