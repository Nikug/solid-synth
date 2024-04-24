export const degToRad = (deg) => {
  return (deg * Math.PI) / 180
}

export const semitonesToFrequency = (semitones, frequency) => {
  return Math.pow(2, semitones / 12) * frequency
}
