const audioContext = new AudioContext()
const audioGain = audioContext.createGain()
audioGain.gain.value = 0.5
audioGain.connect(audioContext.destination)

const oscillators: Record<number, OscillatorNode> = {}

export const playNote = (frequency: number) => {
  if (oscillators[frequency]) return

  const oscillator = audioContext.createOscillator()
  oscillator.connect(audioGain)
  oscillator.type = "sine"
  oscillator.frequency.value = frequency
  oscillator.start()
  oscillators[frequency] = oscillator
}

export const stopNote = (frequency: number) => {
  const oscillator = oscillators[frequency]
  if (oscillator) {
    oscillator.stop()
    oscillators[frequency] = undefined
  }
}
