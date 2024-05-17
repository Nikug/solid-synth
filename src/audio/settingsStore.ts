import { createStore } from "solid-js/store"
import { audioContext, outputGain } from "./audioContextWrapper"
import { Wave } from "../worklets/constants"
import {
  EffectKey,
  EffectSettings,
  defaultBitcrusherSettings,
  defaultCompressorSettings,
  defaultDelaySettings,
  defaultDistortionSettings,
  defaultFilterSettings,
  defaultReverbSettings,
  getDefaultEffectSettings,
  setEffectState,
} from "./effects"
import { Octave } from "../constants"

export const changeSmoothing = 1 / 60
export const DefaultPresetName = "Default"

export interface Settings {
  active: boolean
  state: "uninitialized" | "initializing" | "initialized"
  presetName: string
  presetDescription: string
  isKnobActive: boolean
  midiVelocity: boolean
  octave: Octave
  volume: number
  volumeAdsr: Adsr
  filterAdsr: Adsr
  filter: Filter
  oscillators: Record<number, OscillatorSettings>
  effects: Record<number, EffectSettings>
}

export interface Filter {
  enabled: boolean
  type: BiquadFilterType
  value: number
  amount: number
  resonance: number
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

export const newSettings = (): Settings => ({
  active: false,
  state: "uninitialized",
  presetName: DefaultPresetName,
  presetDescription: "",
  isKnobActive: false,
  midiVelocity: true,
  octave: 4,
  volume: 0.3,
  volumeAdsr: {
    attack: 10,
    hold: 50,
    decay: 500,
    sustain: 0.2,
    release: 300,
  },
  filter: {
    enabled: false,
    type: "lowpass",
    value: 400,
    amount: 0,
    resonance: 1,
  },
  filterAdsr: {
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
      gain: 0.2,
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
      gain: 0.2,
      pitch: 12,
      panning: 0,
      phase: 0,
      unisonVoices: 1,
      unisonDetune: 0,
      unisonWidth: 0.5,
    },
    3: {
      enabled: false,
      waveform: Wave.sine,
      gain: 0.2,
      pitch: -12,
      panning: 0,
      phase: 0,
      unisonVoices: 1,
      unisonDetune: 0,
      unisonWidth: 0.5,
    },
  },
  effects: {
    1: defaultDistortionSettings(1, false),
    2: defaultDelaySettings(2, false),
    3: defaultReverbSettings(3, false),
    4: defaultFilterSettings(4, false),
    5: defaultCompressorSettings(5, false),
    6: defaultBitcrusherSettings(6, false),
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

export const changeEffect = (id: number, effect: EffectKey) => {
  setSettings("effects", id, getDefaultEffectSettings(id, settings.effects[id].enabled, effect))
  if (settings.effects[id].enabled) {
    setEffectState(id, true)
  }
}
