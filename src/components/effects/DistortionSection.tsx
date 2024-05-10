import { Component } from "solid-js"
import { EffectSettings, DistortionSettings } from "../../audio/effects"
import { setSettings } from "../../audio/settingsStore"
import { Knob } from "../Knob"

interface Props {
  id: number
  effect: EffectSettings & DistortionSettings
}

export const DistortionSection: Component<Props> = (props) => {
  return (
    <div class="flex gap-2">
      <Knob
        value={props.effect.amount}
        defaultValue={0.5}
        min={0}
        max={1}
        label="Amount"
        // @ts-expect-error
        onChange={(value) => setSettings("effects", props.id, "amount", value)}
      />
      <Knob
        value={props.effect.postGain}
        defaultValue={0.5}
        min={0}
        max={1}
        label="Post gain"
        // @ts-expect-error
        onChange={(value) => setSettings("effects", props.id, "postGain", value)}
      />
    </div>
  )
}
