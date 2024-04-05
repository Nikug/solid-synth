import { Component } from "solid-js"
import { Knob } from "./Knob"
import { setSettings, settings } from "../audio/settingsStore"

const maxDuration = 2e3 // 2 seconds

export const AdsrSection: Component = () => {
  return (
    <div class="border rounded-lg p-4">
      <h3 class="mb-2">Volume</h3>
      <div class="flex">
        <Knob
          label="Attack"
          unit="ms"
          exponential
          value={settings.volumeAdsr.attack}
          min={0}
          max={maxDuration}
          onChange={(value) => setSettings("volumeAdsr", "attack", value)}
        />
        <Knob
          label="Hold"
          unit="ms"
          exponential
          value={settings.volumeAdsr.hold}
          min={0}
          max={maxDuration}
          onChange={(value) => setSettings("volumeAdsr", "hold", value)}
        />
        <Knob
          label="Decay"
          unit="ms"
          exponential
          value={settings.volumeAdsr.decay}
          min={0}
          max={maxDuration}
          onChange={(value) => setSettings("volumeAdsr", "decay", value)}
        />
        <Knob
          label="Sustain"
          value={settings.volumeAdsr.sustain}
          min={0}
          max={1}
          onChange={(value) => setSettings("volumeAdsr", "sustain", value)}
        />
        <Knob
          label="Release"
          unit="ms"
          exponential
          value={settings.volumeAdsr.release}
          min={0}
          max={maxDuration}
          onChange={(value) => setSettings("volumeAdsr", "release", value)}
        />
      </div>
    </div>
  )
}
