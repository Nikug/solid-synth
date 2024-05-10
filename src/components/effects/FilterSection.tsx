import { Component } from "solid-js"
import { EffectSettings, FilterSettings } from "../../audio/effects"
import { setSettings } from "../../audio/settingsStore"
import { Knob } from "../Knob"
import { Dropdown } from "../Dropdown"

const options = [
  { id: "lowpass", value: "Lowpass" },
  { id: "bandpass", value: "Bandpass" },
  { id: "highpass", value: "Highpass" },
  { id: "lowshelf", value: "Lowshelf" },
  { id: "highshelf", value: "Highshelf" },
  { id: "peaking", value: "Peaking" },
  { id: "notch", value: "Notch" },
  { id: "allpass", value: "Allpass" },
]

interface Props {
  id: number
  effect: EffectSettings & FilterSettings
}

export const FilterSection: Component<Props> = (props) => {
  return (
    <div class="flex gap-2">
      <Dropdown
        key={props.effect.type}
        options={options}
        // @ts-expect-error
        onChange={(value) => setSettings("effects", props.id, "type", value)}
      />
      <Knob
        value={props.effect.value}
        defaultValue={200}
        min={20}
        max={20000}
        label="Cutoff"
        exponential
        // @ts-expect-error
        onChange={(value) => setSettings("effects", props.id, "value", value)}
      />
      <Knob
        value={props.effect.resonance}
        defaultValue={1}
        min={0.001}
        max={30}
        label="Resonance"
        unit="dB"
        // @ts-expect-error
        onChange={(value) => setSettings("effects", props.id, "resonance", value)}
      />
    </div>
  )
}
