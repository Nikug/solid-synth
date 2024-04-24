import { calculateUnisonDetunes } from "../math/utils"
import { Adsr, OscillatorSettings, Settings } from "./settingsStore"
import { audioContext, outputGain } from "./audioContextWrapper"
import { Message, Worklets } from "../worklets/constants"
import { random } from "../math/random"

const oscillators: Map<number, Oscillator[]> = new Map()
const releasingOscillators: Set<Oscillator> = new Set()

interface Oscillator {
  oscillators: AudioWorkletNode[]
  audioGain: GainNode
  adsrGain: GainNode
  volumeAdsr: Adsr
}

export const playNote = (frequency: number, settings: Settings) => {
  if (oscillators[frequency]) return

  const newOscillators: Oscillator[] = []
  for (const [_key, oscillatorSettings] of Object.entries(settings.oscillators)) {
    if (!oscillatorSettings.enabled) continue

    const oscillator = createOscillator(oscillatorSettings, settings, frequency)
    oscillator.oscillators.forEach((osc) => osc.port.postMessage(Message.start))
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
      const frequency = oscs[0].oscillators[0].parameters.get("frequency").value
      oscs.forEach((osc) => osc.oscillators.forEach((osc) => osc.port.postMessage(Message.stop)))
      oscillators.delete(frequency)
    }
  })
}

const createOscillator = (
  oscillatorSettings: OscillatorSettings,
  settings: Settings,
  frequency: number,
): Oscillator => {
  const volumeAdsr = settings.volumeAdsr
  const audioGain = audioContext().createGain()
  audioGain.gain.setValueAtTime(oscillatorSettings.gain, audioContext().currentTime)

  const panning = audioContext().createStereoPanner()
  panning.pan.value = oscillatorSettings.panning

  // ADSR
  const adsrGain = audioContext().createGain()

  adsrGain.gain.setValueAtTime(0, audioContext().currentTime)
  adsrGain.gain.linearRampToValueAtTime(1, audioContext().currentTime + volumeAdsr.attack / 1000)

  adsrGain.gain.linearRampToValueAtTime(
    1,
    audioContext().currentTime + volumeAdsr.attack / 1000 + volumeAdsr.hold / 1000,
  )

  adsrGain.gain.linearRampToValueAtTime(
    volumeAdsr.sustain,
    audioContext().currentTime +
      volumeAdsr.attack / 1000 +
      volumeAdsr.hold / 1000 +
      volumeAdsr.decay / 1000,
  )

  // Unison
  const unisonValues = calculateUnisonDetunes(
    oscillatorSettings.unisonVoices,
    oscillatorSettings.unisonDetune,
    oscillatorSettings.unisonWidth,
  )

  const oscillators: AudioWorkletNode[] = []
  for (const value of unisonValues) {
    if (oscillatorSettings.waveform === "sine") {
      const sineOsc = new AudioWorkletNode(audioContext(), Worklets.oscillator)
      sineOsc.parameters.get("frequency").value = frequency
      sineOsc.parameters.get("phase").value = random(0, 360)
      sineOsc.parameters.get("detune").value = value.detune + oscillatorSettings.pitch
      const unisonPanning = audioContext().createStereoPanner()
      unisonPanning.pan.value = value.panning
      sineOsc.connect(unisonPanning)
      unisonPanning.connect(adsrGain)

      oscillators.push(sineOsc)
    }
  }

  adsrGain.connect(panning)
  panning.connect(audioGain)
  audioGain.connect(outputGain())
  return {
    oscillators,
    audioGain,
    adsrGain,
    volumeAdsr,
  }
}

const moveToRelease = (oscillator: Oscillator) => {
  releasingOscillators.add(oscillator)
  const removeTime = oscillator.volumeAdsr.release
  const gain = oscillator.adsrGain.gain.value
  oscillator.adsrGain.gain.cancelScheduledValues(audioContext().currentTime)
  oscillator.adsrGain.gain.setValueAtTime(gain, audioContext().currentTime)
  oscillator.adsrGain.gain.linearRampToValueAtTime(
    0,
    audioContext().currentTime + removeTime / 1000,
  )
  setTimeout(() => {
    oscillator.oscillators.forEach((osc) => osc.port.postMessage(Message.stop))
    releasingOscillators.delete(oscillator)
  }, removeTime + 500)
}
