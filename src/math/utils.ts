export const calculateUnisonDetunes = (unisonVoices: number, unisonDetune: number): number[] => {
  if (unisonVoices === 1) return [0]

  const min = -unisonDetune / 2

  const detunes: number[] = []
  const step = unisonDetune / (unisonVoices - 1)
  for (let i = 0; i < unisonVoices; i++) {
    detunes.push(i * step + min)
  }

  console.log(detunes)

  return detunes
}
