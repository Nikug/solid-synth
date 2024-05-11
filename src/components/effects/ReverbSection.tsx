import { Component } from "solid-js"
import { EffectSettings, ReverbSettings } from "../../audio/effects"
import { Dropdown } from "../Dropdown"
import { setReverbImpulse, setReverbMix } from "../../audio/effectSettings"
import { Knob } from "../Knob"

export const options = [
  { id: "short.wav", value: "Short" },
  { id: "medium.wav", value: "Medium" },
  { id: "long.wav", value: "Long" },
]

interface Props {
  id: number
  effect: EffectSettings & ReverbSettings
}

export const ReverbSection: Component<Props> = (props) => {
  return (
    <div class="flex gap-2">
      <Dropdown
        key={props.effect.impulse}
        options={options}
        onChange={(value) => setReverbImpulse(props.id, value)}
      />
      <Knob
        value={props.effect.mix}
        defaultValue={0.5}
        min={0}
        max={1}
        label="Mix"
        onChange={(value) => setReverbMix(props.id, value)}
      />
    </div>
  )
}
