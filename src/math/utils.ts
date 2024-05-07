interface UnisonValues {
  detune: number
  panning: number
  phase: number
  volume: number
}

export const calculateUnisonDetunes = (
  unisonVoices: number,
  unisonDetune: number,
  unisonWidth: number,
): UnisonValues[] => {
  if (unisonVoices === 1) return [{ detune: 0, panning: 0, phase: 0, volume: 1 }]

  const min = -unisonDetune / 2
  const minPan = -unisonWidth

  const values: UnisonValues[] = []
  const step = unisonDetune / (unisonVoices - 1)
  const panStep = (unisonWidth * 2) / (unisonVoices - 1)
  const phaseStep = 180 / (unisonVoices - 1)
  const volume = 1 / (unisonVoices / 2)
  for (let i = 0; i < unisonVoices; i++) {
    const alternatingIndex = i % 2 === 0 ? Math.floor(i / 2) : Math.ceil(unisonVoices - 1 - i / 2)
    const detune = alternatingIndex * step + min
    const panning = alternatingIndex * panStep + minPan
    const phase = alternatingIndex * phaseStep
    values.push({ detune, panning, phase, volume })
  }

  return values
}

export const degToRad = (deg: number) => {
  return (deg * Math.PI) / 180
}
