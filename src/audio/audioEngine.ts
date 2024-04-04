const audioContext = new AudioContext()
const audioGain = audioContext.createGain()
audioGain.gain.value = 0.5
audioGain.connect(audioContext.destination)

const oscillators: Map<number, OscillatorNode> = new Map()

export const playNote = (frequency: number) => {
  if (oscillators[frequency]) return

  const oscillator = audioContext.createOscillator()
  oscillator.connect(audioGain)
  oscillator.type = "sine"
  oscillator.frequency.value = frequency
  oscillator.start()
  oscillators.set(frequency, oscillator)
}

export const stopNote = (frequency: number) => {
  const oscillator = oscillators.get(frequency)
  if (oscillator) {
    oscillator.stop()
    oscillators.delete(frequency)
  }
}

export const stopAllNotes = () => {
  oscillators.forEach((oscillator) => {
    if (oscillator) {
      oscillator.stop()
      oscillators.delete(oscillator.frequency.value)
    }
  })
}
