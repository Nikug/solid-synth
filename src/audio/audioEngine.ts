import { Adsr, OscillatorSettings } from "./settingsStore"

export const audioContext = new AudioContext()
export const outputGain = audioContext.createGain()
outputGain.connect(audioContext.destination)
const oscillators: Map<number, Oscillator> = new Map()
const releasingOscillators: Set<Oscillator> = new Set()

interface Oscillator {
  oscillator: OscillatorNode
  audioGain: GainNode
  volumeAdsr: Adsr
}

export const playNote = (frequency: number, volumeAdsr: Adsr, settings: OscillatorSettings) => {
  if (oscillators[frequency]) return

  const oscillator = createOscillator(volumeAdsr, settings)
  oscillator.oscillator.type = settings.waveform
  oscillator.oscillator.frequency.value = frequency
  oscillator.oscillator.start()
  oscillators.set(frequency, oscillator)
}

export const stopNote = (frequency: number) => {
  const oscillator = oscillators.get(frequency)
  if (oscillator) {
    oscillators.delete(frequency)
    moveToRelease(oscillator)
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

const createOscillator = (volumeAdsr: Adsr, settings: OscillatorSettings): Oscillator => {
  const audioGain = audioContext.createGain()
  audioGain.connect(outputGain)
  audioGain.gain.setValueAtTime(0, audioContext.currentTime)
  audioGain.gain.linearRampToValueAtTime(
    settings.gain,
    audioContext.currentTime + volumeAdsr.attack / 1000,
  )
  audioGain.gain.linearRampToValueAtTime(
    volumeAdsr.sustain,
    audioContext.currentTime +
      volumeAdsr.attack / 1000 +
      volumeAdsr.hold / 1000 +
      volumeAdsr.decay / 1000,
  )

  const oscillator = audioContext.createOscillator()
  oscillator.connect(audioGain)
  return {
    oscillator,
    audioGain,
    volumeAdsr: volumeAdsr,
  }
}

const moveToRelease = (oscillator: Oscillator) => {
  releasingOscillators.add(oscillator)
  const removeTime = oscillator.volumeAdsr.release
  const gain = oscillator.audioGain.gain.value
  oscillator.audioGain.gain.cancelScheduledValues(audioContext.currentTime)
  oscillator.audioGain.gain.setValueAtTime(gain, audioContext.currentTime)
  oscillator.audioGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + removeTime / 1000)
  setTimeout(() => {
    oscillator.oscillator.stop()
    releasingOscillators.delete(oscillator)
  }, removeTime + 500)
}
