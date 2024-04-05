import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { audioContext, outputGain } from "./audioEngine"

const changeSmoothing = 1 / 60

export interface Settings {
  volume: number
  volumeAdsr: Adsr
}

export interface Adsr {
  attack: number
  hold: number
  decay: number
  sustain: number
  release: number
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
})

export const [settings, setSettings] = createStore<Settings>(newSettings())

createEffect(() => {
  outputGain.gain.setTargetAtTime(
    settings.volume,
    audioContext.currentTime + changeSmoothing,
    changeSmoothing,
  )
})
