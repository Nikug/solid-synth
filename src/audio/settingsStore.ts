import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { audioContext, outputGain } from "./audioEngine"

const changeSmoothing = 1 / 60

export interface Settings {
  volume: number
  volumeAdsr: Adsr
}

interface Adsr {
  attack: number
  hold: number
  decay: number
  sustain: number
  release: number
}

const newSettings = (): Settings => ({
  volume: 0.5,
  volumeAdsr: {
    attack: 0.01,
    hold: 0.0,
    decay: 0.5,
    sustain: 0.5,
    release: 0.5,
  },
})

export const [settings, setSettings] = createStore<Settings>(newSettings())

createEffect(() => {
  outputGain.gain.setTargetAtTime(
    settings.volume,
    audioContext.currentTime + changeSmoothing,
    changeSmoothing,
  )
})
