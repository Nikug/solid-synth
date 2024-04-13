import { Adsr, OscillatorSettings, Settings } from "./settingsStore"

export const audioContext = new AudioContext()
export const outputGain = audioContext.createGain()
outputGain.connect(audioContext.destination)
const oscillators: Map<number, Oscillator[]> = new Map()
const releasingOscillators: Set<Oscillator> = new Set()

interface Oscillator {
  oscillator: OscillatorNode
  audioGain: GainNode
  adsrGain: GainNode
  volumeAdsr: Adsr
}

export const playNote = (frequency: number, settings: Settings) => {
  if (oscillators[frequency]) return

  const newOscillators: Oscillator[] = []
  for (const [_key, oscillatorSettings] of Object.entries(settings.oscillators)) {
    const oscillator = createOscillator(settings.volumeAdsr, oscillatorSettings)
    oscillator.oscillator.type = oscillatorSettings.waveform
    oscillator.oscillator.frequency.value = frequency
    oscillator.oscillator.detune.value = oscillatorSettings.pitch * 100
    oscillator.oscillator.start()
    newOscillators.push(oscillator)
  }
  oscillators.set(frequency, newOscillators)
}

export const stopNote = (frequency: number) => {
  const oscs = oscillators.get(frequency)
  if (oscs) {
    oscillators.delete(frequency)
    oscs.forEach(moveToRelease)
  }
}

export const stopAllNotes = () => {
  oscillators.forEach((oscs) => {
    if (oscs && oscs.length > 0) {
      const frequency = oscs[0].oscillator.frequency.value
      oscs.forEach((osc) => osc.oscillator.stop())
      oscillators.delete(frequency)
    }
  })
}

const createOscillator = (volumeAdsr: Adsr, settings: OscillatorSettings): Oscillator => {
  const audioGain = audioContext.createGain()
  audioGain.gain.setValueAtTime(settings.gain, audioContext.currentTime)

  const panning = audioContext.createStereoPanner()
  panning.pan.value = settings.panning

  // ADSR
  const adsrGain = audioContext.createGain()

  adsrGain.gain.setValueAtTime(0, audioContext.currentTime)
  adsrGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + volumeAdsr.attack / 1000)

  adsrGain.gain.linearRampToValueAtTime(
    1,
    audioContext.currentTime + volumeAdsr.attack / 1000 + volumeAdsr.hold / 1000,
  )

  adsrGain.gain.linearRampToValueAtTime(
    volumeAdsr.sustain,
    audioContext.currentTime +
      volumeAdsr.attack / 1000 +
      volumeAdsr.hold / 1000 +
      volumeAdsr.decay / 1000,
  )

  const oscillator = audioContext.createOscillator()
  oscillator.connect(adsrGain)
  adsrGain.connect(panning)
  panning.connect(audioGain)
  audioGain.connect(outputGain)
  return {
    oscillator,
    audioGain,
    adsrGain,
    volumeAdsr: volumeAdsr,
  }
}

const moveToRelease = (oscillator: Oscillator) => {
  releasingOscillators.add(oscillator)
  const removeTime = oscillator.volumeAdsr.release
  const gain = oscillator.adsrGain.gain.value
  oscillator.adsrGain.gain.cancelScheduledValues(audioContext.currentTime)
  oscillator.adsrGain.gain.setValueAtTime(gain, audioContext.currentTime)
  oscillator.adsrGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + removeTime / 1000)
  setTimeout(() => {
    oscillator.oscillator.stop()
    releasingOscillators.delete(oscillator)
  }, removeTime + 500)
}
