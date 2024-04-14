interface UnisonValues {
  detune: number
  panning: number
}

export const calculateUnisonDetunes = (
  unisonVoices: number,
  unisonDetune: number,
  unisonWidth: number,
): UnisonValues[] => {
  if (unisonVoices === 1) return [{ detune: 0, panning: 0 }]

  const min = -unisonDetune / 2
  const minPan = -unisonWidth

  const values: UnisonValues[] = []
  const step = unisonDetune / (unisonVoices - 1)
  const panStep = (unisonWidth * 2) / (unisonVoices - 1)
  for (let i = 0; i < unisonVoices; i++) {
    const detune = i * step + min
    const panning = i * panStep + minPan
    values.push({ detune, panning })
  }

  return values
}
