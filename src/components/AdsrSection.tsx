import { Component, Show } from "solid-js"
import { Knob } from "./Knob"
import { Adsr, Settings, setSettings, settings } from "../audio/settingsStore"
import { Part } from "solid-js/store"
import { KeyOfType } from "../types"
import { AdsrVisualiser } from "./AdsrVisualiser"

interface Props {
  label?: string
  settingKey: Part<Settings, KeyOfType<Settings, Adsr>>
}

const maxDuration = 2e3 // 2 seconds

export const AdsrSection: Component<Props> = (props) => {
  const key = props.settingKey as string
  return (
    <div>
      <Show when={props.label}>
        <h3 class="mb-2">{props.label}</h3>
      </Show>
      <AdsrVisualiser adsr={settings[props.settingKey as string]} id={props.settingKey as string} />
      <div class="flex">
        <Knob
          label="Attack"
          unit="ms"
          exponential
          value={settings[key].attack}
          min={0}
          max={maxDuration}
          defaultValue={1000}
          onChange={(value) => setSettings(props.settingKey, "attack", value)}
        />
        <Knob
          label="Hold"
          unit="ms"
          exponential
          value={settings[key].hold}
          min={0}
          max={maxDuration}
          defaultValue={1000}
          onChange={(value) => setSettings(props.settingKey, "hold", value)}
        />
        <Knob
          label="Decay"
          unit="ms"
          exponential
          value={settings[key].decay}
          min={0}
          max={maxDuration}
          defaultValue={1000}
          onChange={(value) => setSettings(props.settingKey, "decay", value)}
        />
        <Knob
          label="Sustain"
          value={settings[key].sustain}
          min={0}
          max={1}
          defaultValue={0.5}
          onChange={(value) => setSettings(props.settingKey, "sustain", value)}
        />
        <Knob
          label="Release"
          unit="ms"
          exponential
          value={settings[key].release}
          min={0}
          max={maxDuration}
          defaultValue={1000}
          onChange={(value) => setSettings(props.settingKey, "release", value)}
        />
      </div>
    </div>
  )
}
