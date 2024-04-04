const audioContext = new AudioContext()
const oscillators: Map<number, Oscillator> = new Map()

interface Oscillator {
  oscillator: OscillatorNode
  audioGain: GainNode
}

export const playNote = (frequency: number) => {
  if (oscillators[frequency]) return

  const oscillator = createOscillator()
  oscillator.oscillator.type = "sine"
  oscillator.oscillator.frequency.value = frequency
  oscillator.oscillator.start()
  oscillators.set(frequency, oscillator)
  // Create ADSR envelope
  // Create logic that update ADSR every animation frame
  // Control oscillator volume by ADSR
  // - Need to create audio gain separately for each oscillator
}

export const stopNote = (frequency: number) => {
  const oscillator = oscillators.get(frequency)
  if (oscillator) {
    oscillator.oscillator.stop()
    oscillators.delete(frequency)
  }
}

export const stopAllNotes = () => {
  oscillators.forEach((oscillator) => {
    if (oscillator) {
      oscillator.oscillator.stop()
      oscillators.delete(oscillator.oscillator.frequency.value)
    }
  })
}

const createOscillator = (): Oscillator => {
  const audioGain = audioContext.createGain()
  audioGain.connect(audioContext.destination)
  audioGain.gain.value = 0.5

  const oscillator = audioContext.createOscillator()
  oscillator.connect(audioGain)
  return { oscillator, audioGain }
}
