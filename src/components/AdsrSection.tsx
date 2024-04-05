import { Component } from "solid-js"
import { Knob } from "./Knob"
import { Adsr, Settings, setSettings, settings } from "../audio/settingsStore"
import { Part } from "solid-js/store"
import { KeyOfType } from "../types"

interface Props {
  label: string
  settingKey: Part<Settings, KeyOfType<Settings, Adsr>>
}

const maxDuration = 2e3 // 2 seconds

export const AdsrSection: Component<Props> = (props) => {
  return (
    <div class="border rounded-lg p-4">
      <h3 class="mb-2">{props.label}</h3>
      <div class="flex">
        <Knob
          label="Attack"
          unit="ms"
          exponential
          value={settings.volumeAdsr.attack}
          min={0}
          max={maxDuration}
          onChange={(value) => setSettings(props.settingKey, "attack", value)}
        />
        <Knob
          label="Hold"
          unit="ms"
          exponential
          value={settings.volumeAdsr.hold}
          min={0}
          max={maxDuration}
          onChange={(value) => setSettings(props.settingKey, "hold", value)}
        />
        <Knob
          label="Decay"
          unit="ms"
          exponential
          value={settings.volumeAdsr.decay}
          min={0}
          max={maxDuration}
          onChange={(value) => setSettings(props.settingKey, "decay", value)}
        />
        <Knob
          label="Sustain"
          value={settings.volumeAdsr.sustain}
          min={0}
          max={1}
          onChange={(value) => setSettings(props.settingKey, "sustain", value)}
        />
        <Knob
          label="Release"
          unit="ms"
          exponential
          value={settings.volumeAdsr.release}
          min={0}
          max={maxDuration}
          onChange={(value) => setSettings(props.settingKey, "release", value)}
        />
      </div>
    </div>
  )
}
