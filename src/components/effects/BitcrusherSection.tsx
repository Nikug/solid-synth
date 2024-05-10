import { Component } from "solid-js"
import { EffectSettings, BitcrusherSettings } from "../../audio/effects"
import { setSettings } from "../../audio/settingsStore"
import { Knob } from "../Knob"

interface Props {
  id: number
  effect: EffectSettings & BitcrusherSettings
}

export const BitcrusherSection: Component<Props> = (props) => {
  return (
    <div class="flex gap-2">
      <Knob
        value={props.effect.bits}
        defaultValue={10}
        min={2}
        max={500}
        label="Amount"
        step={1}
        exponential
        // @ts-expect-error
        onChange={(value) => setSettings("effects", props.id, "bits", value)}
      />
    </div>
  )
}
