import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { audioContext, outputGain } from "./audioEngine"

const changeSmoothing = 1 / 60

export interface Settings {
  volume: number
  volumeAdsr: Adsr
  oscillators: Record<number, OscillatorSettings>
}

export interface Adsr {
  attack: number
  hold: number
  decay: number
  sustain: number
  release: number
}

export interface OscillatorSettings {
  waveform: OscillatorType
  gain: number
  pitch: number
  panning: number
}

const newSettings = (): Settings => ({
  volume: 0.5,
  volumeAdsr: {
    attack: 10,
    hold: 50,
    decay: 500,
    sustain: 0.2,
    release: 300,
  },
  oscillators: { 0: { waveform: "sine", gain: 0.5, pitch: 0, panning: 0 } },
})

export const [settings, setSettings] = createStore<Settings>(newSettings())

createEffect(() => {
  outputGain.gain.setTargetAtTime(
    settings.volume,
    audioContext.currentTime + changeSmoothing,
    changeSmoothing,
  )
})
