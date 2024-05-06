import { createStore } from "solid-js/store"
import { audioContext, outputGain } from "./audioContextWrapper"
import { Wave } from "../worklets/constants"

const changeSmoothing = 1 / 60

export interface Settings {
  active: boolean
  isKnobActive: boolean
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
  enabled: boolean
  waveform: (typeof Wave)[keyof typeof Wave]
  gain: number
  pitch: number
  panning: number
  phase: number
  unisonVoices: number
  unisonDetune: number
  unisonWidth: number
}

const newSettings = (): Settings => ({
  active: false,
  isKnobActive: false,
  volume: 0.5,
  volumeAdsr: {
    attack: 10,
    hold: 50,
    decay: 500,
    sustain: 0.2,
    release: 300,
  },
  oscillators: {
    1: {
      enabled: true,
      waveform: Wave.sine,
      gain: 0.5,
      pitch: 0,
      panning: 0,
      phase: 0,
      unisonVoices: 1,
      unisonDetune: 0,
      unisonWidth: 0.5,
    },
    2: {
      enabled: false,
      waveform: Wave.sine,
      gain: 0.5,
      pitch: -12,
      panning: 0,
      phase: 0,
      unisonVoices: 1,
      unisonDetune: 0,
      unisonWidth: 0.5,
    },
    3: {
      enabled: false,
      waveform: Wave.sine,
      gain: 0.5,
      pitch: 12,
      panning: 0,
      phase: 0,
      unisonVoices: 1,
      unisonDetune: 0,
      unisonWidth: 0.5,
    },
  },
})

export const [settings, setSettings] = createStore<Settings>(newSettings())

export const setGlobalVolume = (value: number) => {
  setSettings("volume", value)
  outputGain().gain.setTargetAtTime(
    settings.volume,
    audioContext().currentTime + changeSmoothing,
    changeSmoothing,
  )
}
