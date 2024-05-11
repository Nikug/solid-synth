import { Component, Show } from "solid-js"
import { EffectSettings, FilterSettings } from "../../audio/effects"
import { Knob } from "../Knob"
import { Dropdown } from "../Dropdown"
import {
  setFilterFrequency,
  setFilterGain,
  setFilterResonance,
  setFilterType,
} from "../../audio/effectSettings"

const options: { id: BiquadFilterType; value: string }[] = [
  { id: "lowpass", value: "Lowpass" },
  { id: "bandpass", value: "Bandpass" },
  { id: "highpass", value: "Highpass" },
  { id: "lowshelf", value: "Lowshelf" },
  { id: "highshelf", value: "Highshelf" },
  { id: "peaking", value: "Peaking" },
  { id: "notch", value: "Notch" },
  { id: "allpass", value: "Allpass" },
]

const useResonance = new Set<BiquadFilterType>([
  "lowpass",
  "highpass",
  "bandpass",
  "peaking",
  "notch",
  "allpass",
])
const useGain = new Set<BiquadFilterType>(["lowshelf", "highshelf", "peaking"])

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
        onChange={(value) => setFilterType(props.id, value)}
      />
      <Knob
        value={props.effect.value}
        defaultValue={200}
        min={20}
        max={20000}
        label="Cutoff"
        unit="hz"
        exponential
        onChange={(value) => setFilterFrequency(props.id, value)}
      />
      <Show when={useResonance.has(props.effect.type)}>
        <Knob
          value={props.effect.resonance}
          defaultValue={1}
          min={0.001}
          max={30}
          label="Resonance"
          exponential
          onChange={(value) => setFilterResonance(props.id, value)}
        />
      </Show>
      <Show when={useGain.has(props.effect.type)}>
        <Knob
          value={props.effect.gain}
          defaultValue={0}
          min={-30}
          max={30}
          label="Gain"
          unit="dB"
          onChange={(value) => setFilterGain(props.id, value)}
        />
      </Show>
    </div>
  )
}
