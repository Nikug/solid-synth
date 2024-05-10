import { Component } from "solid-js"
import { EffectSettings, ReverbSettings } from "../../audio/effects"
import { Dropdown } from "../Dropdown"
import { setReverbImpulse } from "../../audio/effectSettings"

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
    <div>
      <Dropdown
        key={props.effect.impulse}
        options={options}
        onChange={(value) => setReverbImpulse(props.id, value)}
      />
    </div>
  )
}
