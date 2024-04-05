import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { audioContext, outputGain } from "./audioEngine"

const changeSmoothing = 1 / 60

export interface Settings {
  volume: number
}

const newSettings = (): Settings => ({
  volume: 0.5,
})

export const [settings, setSettings] = createStore<Settings>(newSettings())

createEffect(() => {
  outputGain.gain.setTargetAtTime(
    settings.volume,
    audioContext.currentTime + changeSmoothing,
    changeSmoothing,
  )
})
